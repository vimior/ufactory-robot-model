## UFACTORY robot arm model loading library based on three.js

### Run Example
- Load the example through the server (here takes Python2/3 and Node as an example)
  - #### Python2
    ```bash
    # run SimpleHTTPServer
    python2 -m SimpleHTTPServer 8888

    # Access http://localhost:8888/ufactory_robot_model_example.html through a browser
    ```
  - #### Python3
    ```bash
    # run http.server
    python3 -m http.server 8888

    # Access http://localhost:8888/ufactory_robot_model_example.html through a browser
    ```
  - #### Node
    ```bash
    # install anywhere
    npm install -g anywhere
    # run anywhere server
    anywhere -h localhost -p 8888 -s

    # Access http://localhost:8888/ufactory_robot_model_example.html through a browser
    ```

- Introduce in want to enter, refer to [ufactory_robot_model_example.html](./ufactory_robot_model_example.html)

### Example Display
- #### xArm5 (Standard version)
  ![xArm5](./docs/img/xarm5-type5_R0_T0.png)
  ![xArm5](./docs/img/xarm5-type5_T90_R0.png)
  ![xArm5](./docs/img/xarm5-type5_T0_R0_bio.png)

- #### xArm6 (Standard version)
  ![xArm6](./docs/img/xarm6-type6_R0_T0.png)
  ![xArm6](./docs/img/xarm6-type6_T90_R180.png)
  ![xArm6](./docs/img/xarm6-type6_T90_R0_robotiq.png)

- #### xArm7 (Standard version)
  ![xArm7](./docs/img/xarm7-type7_R0_T0.png)
  ![xArm7](./docs/img/xarm7-type7_T180_R180_vacuum_gripper.png)

- #### Lite6 (Standard version)
  ![Lite6](./docs/img/xarm6-type9_R0_T0.png)
  ![Lite6](./docs/img/xarm6-type9_T0_R0_gripper.png)
  ![Lite6](./docs/img/xarm6-type9_T0_R0_vacuum_gripper.png)

- #### xArm6-Type8 (Customized version)
  ![xArm6-Type8](./docs/img/xarm6-type8_R0_T0.png)

- #### xArm6-Type11 (Customized version)
  ![xArm6-Type11](./docs/img/xarm6-type11_R0_T0.png)