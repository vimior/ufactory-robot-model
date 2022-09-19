/**
 * UFRobotModel: UFACTORY robot arm model loading library based on three.js
 *
 * @copyright 2022, UFACTORY, Inc.
 * @license ISC
 * @version 1.0.0
 * 
 * @author  Vinman <vinman.wen@ufactory.cc> <vinman.cub@gmail.com>
 */

'use strict';

const __SCALE = [10, 10, 10];
const __BASE_GROUP_POSITION = [0, -3, 0];
const __BASE_GROUP_POSITION_DIV_SCALE = [__BASE_GROUP_POSITION[0] / __SCALE[0], __BASE_GROUP_POSITION[1] / __SCALE[1], __BASE_GROUP_POSITION[2] / __SCALE[2]];
const __DEFAULT_POLARANGLE = Math.PI / 2;
const __DEFAULT_AZIMUTHALANGLE = -Math.PI;
const __DEFAULT_CAMZOOM = 1;
const __DEFAULT_SHOW_BASE_TRANSFORMCONTROLS = true;
const __DEFAULT_SHOW_TOOL_TRANSFORMCONTROLS = true;
const __DEFAULT_SHOW_GRIDHELPER = true;
const __DEFAULT_PREV_MOUNT_DEGREES = [0, 0];

// const toRadian = (degree) => { return Math.PI / 180 * degree; };
const toRadian = (degree) => { return 0.017453292519943295 * degree; };

// const toDegree = (radian) => { return 180 / Math.PI * radian; }
const toDegree = (radian) => { return 57.29577951308232 * radian; }

const _Rx = (theta, is_radian) => { return new THREE.Matrix4().makeRotationX(is_radian ? theta : toRadian(theta)); }
const _Ry = (theta, is_radian) => { return new THREE.Matrix4().makeRotationY(is_radian ? theta : toRadian(theta)); }
const _Rz = (theta, is_radian) => { return new THREE.Matrix4().makeRotationZ(is_radian ? theta : toRadian(theta)); }

const mat_from_static_euler = (roll, pitch, yaw, is_radian) => {
  // 外旋
  return _Rz(yaw, is_radian).multiply(_Ry(pitch, is_radian)).multiply(_Rx(roll, is_radian));
};

const mat_from_rotation_euler = (roll, pitch, yaw, is_radian) => {
  // 内旋
  return _Rx(roll, is_radian).multiply(_Ry(pitch, is_radian)).multiply(_Rz(yaw, is_radian));
};

const UFRobotModel = {
  SCALE: __SCALE,
  BASE_TRANSFORMCONTROLS_SCALE: [2, 2, 2],
  TOOL_TRANSFORMCONTROLS_SCALE: [1, 1, 1],

  BASE_MESH_ROTATION: [-90, 0, -90],
  BASE_GROUP_POSITION: __BASE_GROUP_POSITION.concat(),

  DEFAULT_POLARANGLE: __DEFAULT_POLARANGLE,
  DEFAULT_AZIMUTHALANGLE: __DEFAULT_AZIMUTHALANGLE,
  DEFAULT_CAMZOOM: __DEFAULT_CAMZOOM,
  DEFAULT_SHOW_BASE_TRANSFORMCONTROLS: __DEFAULT_SHOW_BASE_TRANSFORMCONTROLS,
  DEFAULT_SHOW_TOOL_TRANSFORMCONTROLS: __DEFAULT_SHOW_TOOL_TRANSFORMCONTROLS,
  DEFAULT_SHOW_GRIDHELPER: __DEFAULT_SHOW_GRIDHELPER,
  
  CONTROLS_PARAMS: {
    enableDrag: true,     // 是否支持拖动
    enableRotate: true,   // 是否可旋转
    rotateSpeed: 1,       // 旋转速度
    enableDamping: true,  // 是否有惯性
    dampingFactor: 1,     // 惯性系数
    autoRotate: false,    // 是否自动旋转
    autoRotateSpeed: 2.0, // 自动旋转速度
    enableZoom: true,     // 是否可以缩放
    zoomSpeed: 0.5,       // 缩放速度
    maxZoom: 10,          // 最大放大倍数
    minZoom: 10,          // 最大缩放倍数
    enablePan: false,     // 是否开启右键拖拽
    keyPanSpeed: 7.0,     // 右键拖拽速度
    defaultMinPolarAngle: 0,       // 默认垂直方向上的最小视角(弧度)
    defaultMaxPolarAngle: Math.PI, // 默认垂直方向上的最大视角(弧度)
    defaultMinAzimuthAngle: -Infinity, // 默认水平方向上最小视角(弧度)
    defaultMaxAzimuthAngle: Infinity,  // 默认水平方向上最大视角(弧度)
    minPolarAngle: 0,       // 垂直方向上的最小视角(弧度)
    maxPolarAngle: Math.PI, // 垂直方向上的最大视角(弧度)
    minAzimuthAngle: -Infinity, // 水平方向上最小视角(弧度)
    maxAzimuthAngle: Infinity,  // 水平方向上最大视角(弧度)
  },

  XARM5: {
    AXIS: 5,
    TYPE: 5,
    LOADED_: [],
    SRCS_: [],
    GROUPS: [],
    MESHS: [],
    MESHS_ROTATION_: [
      [0, 0, 0], [0, 0, 180], [0, -90, 180], [0, -90, 180],
      [0, -90, 180], [0, 180, 180],
    ],
    GROUPS_POSITION_: [
      __BASE_GROUP_POSITION_DIV_SCALE, [0, 0.267, 0], [0, 0, 0],
      [0, 0.285, -0.0535], [0, -0.3425, -0.0775], [0, -0.097, -0.076],
    ],
    params: {
      polarAngle: __DEFAULT_POLARANGLE,
      azimuthalAngle: __DEFAULT_AZIMUTHALANGLE,
      camZoom: __DEFAULT_CAMZOOM,
      showBaseTransformControls: __DEFAULT_SHOW_BASE_TRANSFORMCONTROLS,
      showToolTransformControls: __DEFAULT_SHOW_TOOL_TRANSFORMCONTROLS,
      showGridHelper: __DEFAULT_SHOW_GRIDHELPER,
      prevMountDegrees: __DEFAULT_PREV_MOUNT_DEGREES.concat(),
    },
    get: (is_radian) => {
      return [
        is_radian ? (UFRobotModel.XARM5.GROUPS[1].rotation.y + Math.PI) : toDegree(UFRobotModel.XARM5.GROUPS[1].rotation.y + Math.PI),
        is_radian ? -UFRobotModel.XARM5.GROUPS[2].rotation.x : -toDegree(UFRobotModel.XARM5.GROUPS[2].rotation.x),
        is_radian ? -UFRobotModel.XARM5.GROUPS[3].rotation.x : -toDegree(UFRobotModel.XARM5.GROUPS[3].rotation.x),
        is_radian ? -UFRobotModel.XARM5.GROUPS[4].rotation.x : -toDegree(UFRobotModel.XARM5.GROUPS[4].rotation.x),
        is_radian ? -UFRobotModel.XARM5.GROUPS[5].rotation.y : -toDegree(UFRobotModel.XARM5.GROUPS[5].rotation.y),
      ];
    },
    set: (joints, is_radian) => {
      UFRobotModel.XARM5.GROUPS[1].rotation.y = is_radian ? (joints[0] - Math.PI) : toRadian(joints[0] - 180);
      UFRobotModel.XARM5.GROUPS[2].rotation.x = is_radian ? -joints[1] : -toRadian(joints[1]);
      UFRobotModel.XARM5.GROUPS[3].rotation.x = is_radian ? -joints[2] : -toRadian(joints[2]);
      UFRobotModel.XARM5.GROUPS[4].rotation.x = is_radian ? -joints[3] : -toRadian(joints[3]);
      UFRobotModel.XARM5.GROUPS[5].rotation.y = is_radian ? -joints[4] : -toRadian(joints[4]);
    },
    
    _deprecated_warns: 0,
    /**
     * @deprecated since version 1.1.0
     */
    update: function(joints) {
      if (UFRobotModel.XARM5._deprecated_warns++ < 10)
        console.warn( 'the method `update` has been deprecated. Use method `set` instead.' );
      UFRobotModel.XARM5.set(joints, false);
    },
  },
  XARM6: {
    AXIS: 6,
    TYPE: 6,
    LOADED_: [],
    SRCS_: [],
    GROUPS: [],
    MESHS: [],
    MESHS_ROTATION_: [
      [0, 0, 0], [0, 0, 180], [0, -90, 180], [0, -90, 180],
      [180, 0, 0], [0, -90, 180], [0, 180, 180],
    ],
    GROUPS_POSITION_: [
      __BASE_GROUP_POSITION_DIV_SCALE, [0, 0.267, 0], [0, 0, 0], [0, 0.285, -0.0535],
      [0, -0.3425, -0.0775], [0, 0, 0], [0, -0.097, -0.076],
    ],
    params: {
      polarAngle: __DEFAULT_POLARANGLE,
      azimuthalAngle: __DEFAULT_AZIMUTHALANGLE,
      camZoom: __DEFAULT_CAMZOOM,
      showBaseTransformControls: __DEFAULT_SHOW_BASE_TRANSFORMCONTROLS,
      showToolTransformControls: __DEFAULT_SHOW_TOOL_TRANSFORMCONTROLS,
      showGridHelper: __DEFAULT_SHOW_GRIDHELPER,
      prevMountDegrees: __DEFAULT_PREV_MOUNT_DEGREES.concat(),
    },
    get: (is_radian) => {
      return [
        is_radian ? (UFRobotModel.XARM6.GROUPS[1].rotation.y + Math.PI) : toDegree(UFRobotModel.XARM6.GROUPS[1].rotation.y + Math.PI),
        is_radian ? -UFRobotModel.XARM6.GROUPS[2].rotation.x : -toDegree(UFRobotModel.XARM6.GROUPS[2].rotation.x),
        is_radian ? -UFRobotModel.XARM6.GROUPS[3].rotation.x : -toDegree(UFRobotModel.XARM6.GROUPS[3].rotation.x),
        is_radian ? -UFRobotModel.XARM6.GROUPS[4].rotation.y : -toDegree(UFRobotModel.XARM6.GROUPS[4].rotation.y),
        is_radian ? -UFRobotModel.XARM6.GROUPS[5].rotation.x : -toDegree(UFRobotModel.XARM6.GROUPS[5].rotation.x),
        is_radian ? -UFRobotModel.XARM6.GROUPS[6].rotation.y : -toDegree(UFRobotModel.XARM6.GROUPS[6].rotation.y),
      ];
    },
    set: (joints, is_radian) => {
      UFRobotModel.XARM6.GROUPS[1].rotation.y = is_radian ? (joints[0] - Math.PI) : toRadian(joints[0] - 180);
      UFRobotModel.XARM6.GROUPS[2].rotation.x = is_radian ? -joints[1] : -toRadian(joints[1]);
      UFRobotModel.XARM6.GROUPS[3].rotation.x = is_radian ? -joints[2] : -toRadian(joints[2]);
      UFRobotModel.XARM6.GROUPS[4].rotation.y = is_radian ? -joints[3] : -toRadian(joints[3]);
      UFRobotModel.XARM6.GROUPS[5].rotation.x = is_radian ? -joints[4] : -toRadian(joints[4]);
      UFRobotModel.XARM6.GROUPS[6].rotation.y = is_radian ? -joints[5] : -toRadian(joints[5]);
    },

    _deprecated_warns: 0,
    /**
     * @deprecated since version 1.1.0
     */
    update: function(joints) {
      if (UFRobotModel.XARM6._deprecated_warns++ < 10)
        console.warn( 'the method `update` has been deprecated. Use method `set` instead.' );
      UFRobotModel.XARM6.set(joints, false);
    },
  },
  XARM7: {
    AXIS: 7,
    TYPE: 7,
    LOADED_: [],
    SRCS_: [],
    GROUPS: [],
    MESHS: [],
    MESHS_ROTATION_: [
      [0, 0, 0], [0, 0, 180], [0, -90, 180], [0, 0, 180],
      [0, 90, 180], [180, 0, 0], [0, -90, 180], [0, 180, 180],
    ],
    GROUPS_POSITION_: [
      __BASE_GROUP_POSITION_DIV_SCALE, [0, 0.267, 0], [0, 0, 0], [0, 0.293, 0],
      [0, 0, -0.0525], [0, -0.3425, -0.0775], [0, 0, 0], [0, -0.097, -0.076],
    ],
    params: {
      polarAngle: __DEFAULT_POLARANGLE,
      azimuthalAngle: __DEFAULT_AZIMUTHALANGLE,
      camZoom: __DEFAULT_CAMZOOM,
      showBaseTransformControls: __DEFAULT_SHOW_BASE_TRANSFORMCONTROLS,
      showToolTransformControls: __DEFAULT_SHOW_TOOL_TRANSFORMCONTROLS,
      showGridHelper: __DEFAULT_SHOW_GRIDHELPER,
      prevMountDegrees: __DEFAULT_PREV_MOUNT_DEGREES.concat(),
    },
    get: (is_radian) => {
      return [
        is_radian ? (UFRobotModel.XARM7.GROUPS[1].rotation.y + Math.PI) : toDegree(UFRobotModel.XARM7.GROUPS[1].rotation.y + Math.PI),
        is_radian ? -UFRobotModel.XARM7.GROUPS[2].rotation.x : -toDegree(UFRobotModel.XARM7.GROUPS[2].rotation.x),
        is_radian ? UFRobotModel.XARM7.GROUPS[3].rotation.y : toDegree(UFRobotModel.XARM7.GROUPS[3].rotation.y),
        is_radian ? UFRobotModel.XARM7.GROUPS[4].rotation.x : toDegree(UFRobotModel.XARM7.GROUPS[4].rotation.x),
        is_radian ? -UFRobotModel.XARM7.GROUPS[5].rotation.y : -toDegree(UFRobotModel.XARM7.GROUPS[5].rotation.y),
        is_radian ? -UFRobotModel.XARM7.GROUPS[6].rotation.x : -toDegree(UFRobotModel.XARM7.GROUPS[6].rotation.x),
        is_radian ? -UFRobotModel.XARM7.GROUPS[6].rotation.y : -toDegree(UFRobotModel.XARM7.GROUPS[6].rotation.y),
      ];
    },
    set: (joints, is_radian) => {
      UFRobotModel.XARM7.GROUPS[1].rotation.y = is_radian ? (joints[0] - Math.PI) : toRadian(joints[0] - 180);
      UFRobotModel.XARM7.GROUPS[2].rotation.x = is_radian ? -joints[1] : -toRadian(joints[1]);
      UFRobotModel.XARM7.GROUPS[3].rotation.y = is_radian ? joints[2] : toRadian(joints[2]);
      UFRobotModel.XARM7.GROUPS[4].rotation.x = is_radian ? joints[3] : toRadian(joints[3]);
      UFRobotModel.XARM7.GROUPS[5].rotation.y = is_radian ? -joints[4] : -toRadian(joints[4]);
      UFRobotModel.XARM7.GROUPS[6].rotation.x = is_radian ? -joints[5] : -toRadian(joints[5]);
      UFRobotModel.XARM7.GROUPS[7].rotation.y = is_radian ? -joints[6] : -toRadian(joints[6]);
    },

    _deprecated_warns: 0,
    /**
     * @deprecated since version 1.1.0
     */
    update: function(joints) {
      if (UFRobotModel.XARM7._deprecated_warns++ < 10)
        console.warn( 'the method `update` has been deprecated. Use method `set` instead.' );
      UFRobotModel.XARM7.set(joints, false);
    },
  },
  'XARM6-TYPE8': {
    AXIS: 6,
    TYPE: 8,
    LOADED_: [],
    SRCS_: [],
    GROUPS: [],
    MESHS: [],
    MESHS_ROTATION_: [
      [0, 0, 0], [0, 0, 180], [0, -90, 180], [0, 90, 180],
      [180, 0, 0], [0, -90, 180], [0, 180, 180],
    ],
    GROUPS_POSITION_: [
      __BASE_GROUP_POSITION_DIV_SCALE, [0, 0.267, 0], [0, 0, 0], [0, 0.418, -0.0535],
      [0, -0.4655, -0.0775], [0, 0.002, 0], [0, -0.095, -0.076],
    ],
    params: {
      polarAngle: __DEFAULT_POLARANGLE,
      azimuthalAngle: __DEFAULT_AZIMUTHALANGLE,
      camZoom: __DEFAULT_CAMZOOM,
      showBaseTransformControls: __DEFAULT_SHOW_BASE_TRANSFORMCONTROLS,
      showToolTransformControls: __DEFAULT_SHOW_TOOL_TRANSFORMCONTROLS,
      showGridHelper: __DEFAULT_SHOW_GRIDHELPER,
      prevMountDegrees: __DEFAULT_PREV_MOUNT_DEGREES.concat(),
    },
    get: (is_radian) => {
      return [
        is_radian ? (UFRobotModel['XARM6-TYPE8'].GROUPS[1].rotation.y + Math.PI) : toDegree(UFRobotModel['XARM6-TYPE8'].GROUPS[1].rotation.y + Math.PI),
        is_radian ? -UFRobotModel['XARM6-TYPE8'].GROUPS[2].rotation.x : -toDegree(UFRobotModel['XARM6-TYPE8'].GROUPS[2].rotation.x),
        is_radian ? UFRobotModel['XARM6-TYPE8'].GROUPS[3].rotation.x : toDegree(UFRobotModel['XARM6-TYPE8'].GROUPS[3].rotation.x),
        is_radian ? -UFRobotModel['XARM6-TYPE8'].GROUPS[4].rotation.y : -toDegree(UFRobotModel['XARM6-TYPE8'].GROUPS[4].rotation.y),
        is_radian ? -UFRobotModel['XARM6-TYPE8'].GROUPS[5].rotation.x : -toDegree(UFRobotModel['XARM6-TYPE8'].GROUPS[5].rotation.x),
        is_radian ? -UFRobotModel['XARM6-TYPE8'].GROUPS[6].rotation.y : -toDegree(UFRobotModel['XARM6-TYPE8'].GROUPS[6].rotation.y),
      ];
    },
    set: (joints, is_radian) => {
      UFRobotModel['XARM6-TYPE8'].GROUPS[1].rotation.y = is_radian ? (joints[0] - Math.PI) : toRadian(joints[0] - 180);
      UFRobotModel['XARM6-TYPE8'].GROUPS[2].rotation.x = is_radian ? -joints[1] : -toRadian(joints[1]);
      UFRobotModel['XARM6-TYPE8'].GROUPS[3].rotation.x = is_radian ? joints[2] : toRadian(joints[2]);
      UFRobotModel['XARM6-TYPE8'].GROUPS[4].rotation.y = is_radian ? -joints[3] : -toRadian(joints[3]);
      UFRobotModel['XARM6-TYPE8'].GROUPS[5].rotation.x = is_radian ? -joints[4] : -toRadian(joints[4]);
      UFRobotModel['XARM6-TYPE8'].GROUPS[6].rotation.y = is_radian ? -joints[5] : -toRadian(joints[5]);
    },

    _deprecated_warns: 0,
    /**
     * @deprecated since version 1.1.0
     */
    update: function(joints) {
      if (UFRobotModel['XARM6-TYPE8']._deprecated_warns++ < 10)
        console.warn( 'the method `update` has been deprecated. Use method `set` instead.' );
      UFRobotModel['XARM6-TYPE8'].set(joints, false);
    },
  },
  'XARM6-TYPE9': {
    AXIS: 6,
    TYPE: 9,
    LOADED_: [],
    SRCS_: [],
    GROUPS: [],
    MESHS: [],
    MESHS_ROTATION_: [
      [0, 0, 0], [0, 0, 180], [0, -90, 90], [0, 90, 180],
      [180, 0, 0], [0, -90, 180], [0, 180, 180],
    ],
    GROUPS_POSITION_: [
      __BASE_GROUP_POSITION_DIV_SCALE, [0, 0.2435, 0], [0, 0, 0], [0, 0.2002, 0],
      [0, -0.22761, -0.087], [0, 0, 0], [0, -0.0625, 0],
    ],
    params: {
      polarAngle: __DEFAULT_POLARANGLE,
      azimuthalAngle: __DEFAULT_AZIMUTHALANGLE,
      camZoom: __DEFAULT_CAMZOOM,
      showBaseTransformControls: __DEFAULT_SHOW_BASE_TRANSFORMCONTROLS,
      showToolTransformControls: __DEFAULT_SHOW_TOOL_TRANSFORMCONTROLS,
      showGridHelper: __DEFAULT_SHOW_GRIDHELPER,
      prevMountDegrees: __DEFAULT_PREV_MOUNT_DEGREES.concat(),
    },
    get: (is_radian) => {
      return [
        is_radian ? (UFRobotModel['XARM6-TYPE9'].GROUPS[1].rotation.y + Math.PI) : toDegree(UFRobotModel['XARM6-TYPE9'].GROUPS[1].rotation.y + Math.PI),
        is_radian ? -UFRobotModel['XARM6-TYPE9'].GROUPS[2].rotation.x : -toDegree(UFRobotModel['XARM6-TYPE9'].GROUPS[2].rotation.x),
        is_radian ? UFRobotModel['XARM6-TYPE9'].GROUPS[3].rotation.x : toDegree(UFRobotModel['XARM6-TYPE9'].GROUPS[3].rotation.x),
        is_radian ? -UFRobotModel['XARM6-TYPE9'].GROUPS[4].rotation.y : -toDegree(UFRobotModel['XARM6-TYPE9'].GROUPS[4].rotation.y),
        is_radian ? -UFRobotModel['XARM6-TYPE9'].GROUPS[5].rotation.x : -toDegree(UFRobotModel['XARM6-TYPE9'].GROUPS[5].rotation.x),
        is_radian ? -UFRobotModel['XARM6-TYPE9'].GROUPS[6].rotation.y : -toDegree(UFRobotModel['XARM6-TYPE9'].GROUPS[6].rotation.y),
      ];
    },
    set: (joints, is_radian) => {
      UFRobotModel['XARM6-TYPE9'].GROUPS[1].rotation.y = is_radian ? (joints[0] - Math.PI) : toRadian(joints[0] - 180);
      UFRobotModel['XARM6-TYPE9'].GROUPS[2].rotation.x = is_radian ? -joints[1] : -toRadian(joints[1]);
      UFRobotModel['XARM6-TYPE9'].GROUPS[3].rotation.x = is_radian ? joints[2] : toRadian(joints[2]);
      UFRobotModel['XARM6-TYPE9'].GROUPS[4].rotation.y = is_radian ? -joints[3] : -toRadian(joints[3]);
      UFRobotModel['XARM6-TYPE9'].GROUPS[5].rotation.x = is_radian ? -joints[4] : -toRadian(joints[4]);
      UFRobotModel['XARM6-TYPE9'].GROUPS[6].rotation.y = is_radian ? -joints[5] : -toRadian(joints[5]);
    },

    _deprecated_warns: 0,
    /**
     * @deprecated since version 1.1.0
     */
    update: function(joints) {
      if (UFRobotModel['XARM6-TYPE9']._deprecated_warns++ < 10)
        console.warn( 'the method `update` has been deprecated. Use method `set` instead.' );
      UFRobotModel['XARM6-TYPE9'].set(joints, false);
    },
  },
  'XARM6-TYPE11': {
    AXIS: 6,
    TYPE: 11,
    LOADED_: [],
    SRCS_: [],
    GROUPS: [],
    MESHS: [],
    GROUPS_POSITION_: [
      __BASE_GROUP_POSITION_DIV_SCALE, [0, 0.267, 0], [0, 0, 0], [0, 0.445, -0.0535],
      [0, -0.3425, -0.0775], [0, 0, 0], [0, -0.097, -0.076],
    ],
    MESHS_ROTATION_: [
      [0, 0, 0], [0, 0, 180], [0, -90, 180], [0, 90, 180],
      [180, 0, 0], [0, -90, 180], [0, 180, 180],
    ],
    params: {
      polarAngle: __DEFAULT_POLARANGLE,
      azimuthalAngle: __DEFAULT_AZIMUTHALANGLE,
      camZoom: __DEFAULT_CAMZOOM,
      showBaseTransformControls: __DEFAULT_SHOW_BASE_TRANSFORMCONTROLS,
      showToolTransformControls: __DEFAULT_SHOW_TOOL_TRANSFORMCONTROLS,
      showGridHelper: __DEFAULT_SHOW_GRIDHELPER,
      prevMountDegrees: __DEFAULT_PREV_MOUNT_DEGREES.concat(),
    },
    get: (is_radian) => {
      return [
        is_radian ? (UFRobotModel['XARM6-TYPE11'].GROUPS[1].rotation.y + Math.PI) : toDegree(UFRobotModel['XARM6-TYPE11'].GROUPS[1].rotation.y + Math.PI),
        is_radian ? -UFRobotModel['XARM6-TYPE11'].GROUPS[2].rotation.x : -toDegree(UFRobotModel['XARM6-TYPE11'].GROUPS[2].rotation.x),
        is_radian ? UFRobotModel['XARM6-TYPE11'].GROUPS[3].rotation.x : toDegree(UFRobotModel['XARM6-TYPE11'].GROUPS[3].rotation.x),
        is_radian ? UFRobotModel['XARM6-TYPE11'].GROUPS[4].rotation.y : toDegree(UFRobotModel['XARM6-TYPE11'].GROUPS[4].rotation.y),
        is_radian ? -UFRobotModel['XARM6-TYPE11'].GROUPS[5].rotation.x : -toDegree(UFRobotModel['XARM6-TYPE11'].GROUPS[5].rotation.x),
        is_radian ? -UFRobotModel['XARM6-TYPE11'].GROUPS[6].rotation.y : -toDegree(UFRobotModel['XARM6-TYPE11'].GROUPS[6].rotation.y),
      ];
    },
    set: (joints, is_radian) => {
      UFRobotModel['XARM6-TYPE11'].GROUPS[1].rotation.y = is_radian ? (joints[0] - Math.PI) : toRadian(joints[0] - 180);
      UFRobotModel['XARM6-TYPE11'].GROUPS[2].rotation.x = is_radian ? -joints[1] : -toRadian(joints[1]);
      UFRobotModel['XARM6-TYPE11'].GROUPS[3].rotation.x = is_radian ? joints[2] : toRadian(joints[2]);
      UFRobotModel['XARM6-TYPE11'].GROUPS[4].rotation.y = is_radian ? joints[3] : toRadian(joints[3]);
      UFRobotModel['XARM6-TYPE11'].GROUPS[5].rotation.x = is_radian ? -joints[4] : -toRadian(joints[4]);
      UFRobotModel['XARM6-TYPE11'].GROUPS[6].rotation.y = is_radian ? -joints[5] : -toRadian(joints[5]);
    },

    _deprecated_warns: 0,
    /**
     * @deprecated since version 1.1.0
     */
    update: function(joints) {
      if (UFRobotModel['XARM6-TYPE11']._deprecated_warns++ < 10)
        console.warn( 'the method `update` has been deprecated. Use method `set` instead.' );
      UFRobotModel['XARM6-TYPE11'].set(joints, false);
    },
  },

  BASE_STATIC_MATRIX_: mat_from_rotation_euler(-90, 0, -90, false),
  WORLD_OFFSET_MATRIX_: mat_from_static_euler(0, 0, 0, false).transpose(),
  TITL_ROTATION_MATRIX_: mat_from_rotation_euler(0, 0, 0, false),
  BASE_TRANSFORMCONTROLS_MATRIX_: null,
  set_world_offset(roll, pitch, yaw, is_radian) {
    UFRobotModel.WORLD_OFFSET_MATRIX_ = mat_from_static_euler(roll, pitch, yaw, is_radian).transpose();
    const matrix = UFRobotModel.BASE_STATIC_MATRIX_.clone();
    matrix.multiply(UFRobotModel.WORLD_OFFSET_MATRIX_).multiply(UFRobotModel.TITL_ROTATION_MATRIX_);
    UFRobotModel.BASE_TRANSFORMCONTROLS_MATRIX_ = matrix;
  },
  set_tilt_rotation(titl, rotation, is_radian) {
    UFRobotModel.TITL_ROTATION_MATRIX_ = mat_from_rotation_euler(0, titl, rotation, is_radian);
    const matrix = UFRobotModel.BASE_STATIC_MATRIX_.clone();
    matrix.multiply(UFRobotModel.WORLD_OFFSET_MATRIX_).multiply(UFRobotModel.TITL_ROTATION_MATRIX_);
    UFRobotModel.BASE_TRANSFORMCONTROLS_MATRIX_ = matrix;
  },
  get_base_transform_controls_matrix() {
    if (UFRobotModel.BASE_TRANSFORMCONTROLS_MATRIX_ === null) {
      const matrix = UFRobotModel.BASE_STATIC_MATRIX_.clone();
      matrix.multiply(UFRobotModel.WORLD_OFFSET_MATRIX_).multiply(UFRobotModel.TITL_ROTATION_MATRIX_);
      UFRobotModel.BASE_TRANSFORMCONTROLS_MATRIX_ = matrix.clone();
    }
    return UFRobotModel.BASE_TRANSFORMCONTROLS_MATRIX_.clone();
  },
  get_tool_transform_controls_matrix(roll, pitch, yaw, is_radian) {
    if (UFRobotModel.BASE_TRANSFORMCONTROLS_MATRIX_ === null) 
      UFRobotModel.get_base_transform_controls_matrix();
    const matrix = UFRobotModel.BASE_TRANSFORMCONTROLS_MATRIX_.clone();
    matrix.multiply(mat_from_static_euler(roll, pitch, yaw, is_radian));
    return matrix;
  },
  _check_is_loaded(axis, type) {
    const RobotModel = this.getRobotModel(axis, type);
    return (RobotModel.LOADED_.length === axis + 1) && RobotModel.LOADED_.every(ele => { return ele === 0; });
  },
  _check_load_finished(axis, type) {
    const RobotModel = this.getRobotModel(axis, type);
    return RobotModel.LOADED_.every(ele => { return ele !== -1; });
  },
  getRobotModel(axis, type) {
    const xArmAxisType = `XARM${axis}-TYPE${type}`;
    return xArmAxisType in this ? UFRobotModel[xArmAxisType] : axis === 5 ? this.XARM5 : axis === 6 ? this.XARM6 : this.XARM7;
  },

  IS_RAINBOW_COLOR: false,
  // RAINBOW_COLORS_: [0x4B0082, 0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x0000FF, 0x9400D3, 0xFFFFFF],
  RAINBOW_COLORS_: [0x8B00FF, 0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF, 0xFFFFFF],
  // RAINBOW_COLORS_: [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF, 0x8B00FF, 0xFFFFFF],
  STL_LOADER_: new THREE.STLLoader(),
  _load(axis, type) {
    const RobotModel = this.getRobotModel(axis, type);
    for (let i = RobotModel.AXIS; i >= 0; i -= 1) {
      RobotModel.SRCS_[i] = `./static/stl/xarm${RobotModel.AXIS}-type${RobotModel.TYPE}/link${(i)}.stl`;
      RobotModel.GROUPS[i] = RobotModel.GROUPS[i] || new THREE.Group();
      RobotModel.GROUPS[i].position.set(...[
        RobotModel.GROUPS_POSITION_[i][0] * UFRobotModel.SCALE[0],
        RobotModel.GROUPS_POSITION_[i][1] * UFRobotModel.SCALE[1],
        RobotModel.GROUPS_POSITION_[i][2] * UFRobotModel.SCALE[2]
      ]);
      if (RobotModel.LOADED_[i] === 0) continue;
      RobotModel.LOADED_[i] = -1;
      UFRobotModel.STL_LOADER_.load(RobotModel.SRCS_[i], (geometry) => {
        RobotModel.MESHS[i] = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: UFRobotModel.IS_RAINBOW_COLOR ? UFRobotModel.RAINBOW_COLORS_[i] : '#69f'}) );
        // RobotModel.MESHS[i] = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: '#69f'}) );
        RobotModel.MESHS[i].scale.set(...UFRobotModel.SCALE);
        RobotModel.MESHS[i].rotation.set(...[
          RobotModel.MESHS_ROTATION_[i][0] + UFRobotModel.BASE_MESH_ROTATION[0],
          RobotModel.MESHS_ROTATION_[i][1] + UFRobotModel.BASE_MESH_ROTATION[1],
          RobotModel.MESHS_ROTATION_[i][2] + UFRobotModel.BASE_MESH_ROTATION[2]
        ].map(toRadian));
        if (i === RobotModel.AXIS) {
          RobotModel.GROUPS[i].add(RobotModel.MESHS[i]);
        }
        else {
          RobotModel.GROUPS[i].add(RobotModel.MESHS[i], RobotModel.GROUPS[i + 1]);
        }
        RobotModel.LOADED_[i] = 0;
        console.log(`load xarm${RobotModel.AXIS}-type${RobotModel.TYPE} mesh-${i} success`);
      }, (progress) => {
        // console.log(`load xarm${RobotModel.AXIS}-type${RobotModel.TYPE} mesh-${i} progress: ${progress.loaded / progress.total * 100}%`);
      }, (err) => {
        RobotModel.LOADED_[i] = 1;
        console.error(`load xarm${RobotModel.AXIS}-type${RobotModel.TYPE} mesh-${i} error`, err);
      });
    }
  },
  load(axis, type) {
    const _this = this;
    return new Promise((resolve) => {
      if (_this._check_load_finished(axis, type) && !_this._check_is_loaded(axis, type)) {
        _this._load(axis, type);
      }
      const t = setInterval(() => {
        if (_this._check_is_loaded(axis, type)) {
          clearInterval(t);
          resolve();
        }
      }, 50);
    })
  }
};
