const SCALE = [10, 10, 10];
const TRANSFORMCONTROLS_SCALE = [2, 2, 2];
const POSITION = [0, -3, 0];
const BASE_GROUP_POSITION = [POSITION[0] / SCALE[0], POSITION[1] / SCALE[1], POSITION[2] / SCALE[2]];
const DEFAULT_POLARANGLE = Math.PI / 2;
const DEFAULT_AZIMUTHALANGLE = -Math.PI;
const DEFAULT_CAMZOOM = 1;
const DEFAULT_SHOW_TRANSFORMCONTROLS = false;
const DEFAULT_SHOW_GRIDHELPER = true;
const DEFAULT_PREV_MOUNT_DEGREES = [0, 0];

const ThreeModel = {
  SCALE: SCALE,
  POSITION: POSITION,
  // ROTATION: [-90, 0, 90],
  ROTATION: [-90, 0, -90],
  TRANSFORMCONTROLS_SCALE: TRANSFORMCONTROLS_SCALE,

  DEFAULT_POLARANGLE: DEFAULT_POLARANGLE,
  DEFAULT_AZIMUTHALANGLE: DEFAULT_AZIMUTHALANGLE,
  DEFAULT_CAMZOOM: DEFAULT_CAMZOOM,
  DEFAULT_SHOW_TRANSFORMCONTROLS: DEFAULT_SHOW_TRANSFORMCONTROLS,
  DEFAULT_SHOW_GRIDHELPER: DEFAULT_SHOW_GRIDHELPER,
  XARM5: {
    AXIS: 5,
    LOADED: [],
    SRCS: [],
    GROUPS: [],
    MESHS: [],
    MESHS_ROTATION: [
      [0, 0, 0], [0, 0, 180], [0, -90, 180], [0, -90, 180],
      [0, -90, 180], [0, 180, 180],
    ],
    GROUPS_POSITION: [
      BASE_GROUP_POSITION, [0, 0.267, 0], [0, 0, 0],
      [0, 0.285, -0.0535], [0, -0.3425, -0.0775], [0, -0.097, -0.076],
    ],
    update: (joints) => {
      ThreeModel.XARM5.GROUPS[1].rotation.y = toRadian(joints[0] - 180);
      ThreeModel.XARM5.GROUPS[2].rotation.x = -toRadian(joints[1]);
      ThreeModel.XARM5.GROUPS[3].rotation.x = -toRadian(joints[2]);
      ThreeModel.XARM5.GROUPS[4].rotation.x = -toRadian(joints[3]);
      ThreeModel.XARM5.GROUPS[5].rotation.y = -toRadian(joints[4]);
    }
  },
  XARM6: {
    AXIS: 6,
    LOADED: [],
    SRCS: [],
    GROUPS: [],
    MESHS: [],
    MESHS_ROTATION: [
      [0, 0, 0], [0, 0, 180], [0, -90, 180], [0, -90, 180],
      [180, 0, 0], [0, -90, 180], [0, 180, 180],
    ],
    GROUPS_POSITION: [
      BASE_GROUP_POSITION, [0, 0.267, 0], [0, 0, 0], [0, 0.285, -0.0535],
      [0, -0.3425, -0.0775], [0, 0, 0], [0, -0.097, -0.076],
    ],
    update: (joints) => {
      ThreeModel.XARM6.GROUPS[1].rotation.y = toRadian(joints[0] - 180);
      ThreeModel.XARM6.GROUPS[2].rotation.x = -toRadian(joints[1]);
      ThreeModel.XARM6.GROUPS[3].rotation.x = -toRadian(joints[2]);
      ThreeModel.XARM6.GROUPS[4].rotation.y = -toRadian(joints[3]);
      ThreeModel.XARM6.GROUPS[5].rotation.x = -toRadian(joints[4]);
      ThreeModel.XARM6.GROUPS[6].rotation.y = -toRadian(joints[5]);
    }
  },
  XARM7: {
    AXIS: 7,
    LOADED: [],
    SRCS: [],
    GROUPS: [],
    MESHS: [],
    MESHS_ROTATION: [
      [0, 0, 0], [0, 0, 180], [0, -90, 180], [0, 0, 180],
      [0, 90, 180], [180, 0, 0], [0, -90, 180], [0, 180, 180],
    ],
    GROUPS_POSITION: [
      BASE_GROUP_POSITION, [0, 0.267, 0], [0, 0, 0], [0, 0.293, 0],
      [0, 0, -0.0525], [0, -0.3425, -0.0775], [0, 0, 0], [0, -0.097, -0.076],
    ],
    update: (joints) => {
      ThreeModel.XARM7.GROUPS[1].rotation.y = toRadian(joints[0] - 180);
      ThreeModel.XARM7.GROUPS[2].rotation.x = -toRadian(joints[1]);
      ThreeModel.XARM7.GROUPS[3].rotation.y = toRadian(joints[2]);
      ThreeModel.XARM7.GROUPS[4].rotation.x = toRadian(joints[3]);
      ThreeModel.XARM7.GROUPS[5].rotation.y = -toRadian(joints[4]);
      ThreeModel.XARM7.GROUPS[6].rotation.x = -toRadian(joints[5]);
      ThreeModel.XARM7.GROUPS[7].rotation.y = -toRadian(joints[6]);
    }
  },
  checkAllIsLoaded(axis) {
    const XARMModel = axis === 5 ? this.XARM5 : axis === 6 ? this.XARM6 : this.XARM7;
    return (XARMModel.LOADED.length === axis + 1) && XARMModel.LOADED.every(ele => { return ele === 0; });
  },
  checkAllIsFinished(axis) {
    const XARMModel = axis === 5 ? this.XARM5 : axis === 6 ? this.XARM6 : this.XARM7;
    return XARMModel.LOADED.every(ele => { return ele !== -1; });
  }
}

const loader = new THREE.STLLoader();

const toRadian = (degree) => {
  return Math.PI / 180 * degree;
}

const loadXArm = (axis) => {
  const XARMModel = axis === 5 ? ThreeModel.XARM5 : axis === 6 ? ThreeModel.XARM6 : ThreeModel.XARM7;
  for (let i = XARMModel.AXIS; i >= 0; i -= 1) {
    XARMModel.SRCS[i] = `./static/models/xarm${axis}/link${(i)}.stl`;
    XARMModel.GROUPS[i] = XARMModel.GROUPS[i] || new THREE.Group();
    XARMModel.GROUPS[i].position.set(...[
      XARMModel.GROUPS_POSITION[i][0] * ThreeModel.SCALE[0],
      XARMModel.GROUPS_POSITION[i][1] * ThreeModel.SCALE[1],
      XARMModel.GROUPS_POSITION[i][2] * ThreeModel.SCALE[2]
    ]);
    if (XARMModel.LOADED[i] === 0) continue;
    XARMModel.LOADED[i] = -1;
    loader.load(XARMModel.SRCS[i], (geometry) => {
      XARMModel.MESHS[i] = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: '#69f'}) );
      XARMModel.MESHS[i].scale.set(...ThreeModel.SCALE);
      XARMModel.MESHS[i].rotation.set(...[
        XARMModel.MESHS_ROTATION[i][0] + ThreeModel.ROTATION[0],
        XARMModel.MESHS_ROTATION[i][1] + ThreeModel.ROTATION[1],
        XARMModel.MESHS_ROTATION[i][2] + ThreeModel.ROTATION[2]
      ].map(toRadian));
      if (i === XARMModel.AXIS) {
        XARMModel.GROUPS[i].add(XARMModel.MESHS[i]);
      }
      else {
        XARMModel.GROUPS[i].add(XARMModel.MESHS[i], XARMModel.GROUPS[i + 1]);
      }
      XARMModel.LOADED[i] = 0;
      console.log(`load xarm${axis} mesh-${i} success`);
    }, (progress) => {
      // console.log(`load xarm${axis} mesh-${i} progress: ${progress.loaded / progress.total * 100}%`);
    }, (err) => {
      XARMModel.LOADED[i] = 1;
      console.error(`load xarm${axis} mesh-${i} error`, err);
    });
  }
}

ThreeModel.init = (axis) => {
  return new Promise((resolve) => {
    if (ThreeModel.checkAllIsFinished(axis) && !ThreeModel.checkAllIsLoaded(axis)) {
      loadXArm(axis);
    }
    const t = setInterval(() => {
      if (ThreeModel.checkAllIsLoaded(axis)) {
        clearInterval(t);
        resolve();
      }
    }, 50);
  })
}