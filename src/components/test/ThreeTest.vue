<template>
  <canvas id="threeCanvas" />

  <div id="debug" v-show="isDebug">
    <p>absolute : {{ absolute }}</p>
    <p>alpha : {{ alpha }}</p>
    <p>beta : {{ beta }}</p>
    <p>gamma : {{ gamma }}</p>
    <p>secure : {{ secure }}</p>
    <button @click="onDevOrAllow">Allow device orientation</button>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import CameraControls from "camera-controls";
import swipeDetect from "swipe-detect";
import Stats from "stats.js/src/Stats";
import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls";

import OutsideWorld from "@/core/visualisation/OutsideWorld";
import CameraController from "@/core/visualisation/CameraController";
import DreamController from "@/firebase/db/DreamController";

export default {
  data() {
    return {
      isDebug: false,
      absolute: 0,
      alpha: 0,
      beta: 0,
      gamma: 0,
      secure: null,
      test: "quelconque",
    };
  },
  mounted() {
    this.init();
    this.animate();

    window.addEventListener("resize", () => {
      this.resize();
    });
  },
  methods: {
    init() {
      this.stats = new Stats();
      this.stats.showPanel(0);
      document.body.appendChild(this.stats.dom);

      this.clock = new THREE.Clock();

      this.canvas = document.getElementById("threeCanvas");

      const width = window.innerWidth;
      const height = window.innerHeight;

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(0xfff0ea);
      this.renderer.autoClear = false;
      this.renderer.physicallyCorrectLights = true;
      this.renderer.outputEncoding = THREE.sRGBEncoding;

      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      this.camera.position.set(0, 0.5, 6);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enabled = false;
      this.cameraController = new CameraController(this.camera, this.controls);

      this.initMainScene();
      //this.initCameraControls();

      this.isZoom = false;
      this.zoomable = true;
      this.zoom = true;

      swipeDetect(
        this.renderer.domElement,
        (dir) => {
          dir = dir === "left" ? 1 : -1;
          if (!this.cameraController.canInteract) return;
          this.outsideWorld.loadNext(dir);
          this.cameraController.moveToDirection(dir);
        },
        10
      );
      /*    
        this.canvas.addEventListener('click',
            () => { this.onClick()
        });
        */

      this.portalScenes = [];
      this.dreamScenes = [];

      this.getDreamsData();

      // TODO For debugging -> to delete
      window.addEventListener("keydown", (e) => {
        if (!this.cameraController.canInteract) return;
        if (e.key === "ArrowRight") {
          this.outsideWorld.loadNext(1);
          this.cameraController.moveToDirection(1);
        } else if (e.key === "ArrowLeft") {
          this.outsideWorld.loadNext(-1);
          this.cameraController.moveToDirection(-1);
        }
      });
    },
    initMainScene() {
      this.mainScene = new THREE.Scene();

      const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
      this.mainScene.add(hemisphereLight);

      this.loadOutsideWorld();
    },
    loadOutsideWorld() {
      this.outsideWorld = new OutsideWorld(this.mainScene);
    },
    initCameraControls() {
      this.cameraControls = new CameraControls(
        this.camera,
        this.renderer.domElement
      );
      this.cameraControls.touches.one = CameraControls.ACTION.NONE;
      this.cameraControls.touches.two = CameraControls.ACTION.NONE;
      this.cameraControls.touches.three = CameraControls.ACTION.NONE;
    },
    async getDreamsData() {
      const feelingColor = [0x223361, 0x223361, 0x223361, 0x223361, 0x223361];
      const memoryColor = [0x102133, 0x102133, 0x102133, 0x102133, 0x102133];
      const credibilityColor = [0xbed1f0, 0xbed1f0, 0xbed1f0, 0xbed1f0];
      const sleepColor = [0xc4ccdc, 0xc4ccdc, 0xc4ccdc, 0xc4ccdc, 0xc4ccdc];
      const impactColor = [0x466588, 0x466588, 0x466588, 0x466588, 0x466588];

      DreamController.getAll(
        (snapshot) => {
          /*
                    const dreamsData = []
                    snapshot.docs.forEach(doc => {
                        console.log(doc.data());
                        dreamsData.push(
                            {
                                outsidePart: {color: impactColor[doc.data().credibility]},
                                insidePart: {
                                    floorData: {color: feelingColor[doc.data().feeling]},
                                    backgroundData: {color: memoryColor[doc.data().memory]},
                                    pedestalData: {color: sleepColor[doc.data().sleep]},
                                    crystalData: {color: credibilityColor[doc.data().impact]},
                                },
                            }
                        )
                    })*/
          const data = snapshot.docs[0].data();
          const dreamData = [];
          const dreams = this.createDreams();
          /*
          const dreamsData = [
            {
              outsidePart: { color: impactColor[data.credibility] },
              insidePart: {
                floorData: { color: feelingColor[data.feeling] },
                backgroundData: { color: memoryColor[data.memory] },
                pedestalData: { color: sleepColor[data.sleep] },
                crystalData: { color: credibilityColor[data.impact] },
              },
            },
          ];
          const dreams = this.createDreams(dreamsData);
          this.disposeDreams(dreams);
          */
        },
        (error) => {
          console.log(error);
        }
      );
    },
    createDreams(dreamsData) {
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
      }
      /*
      const dreams = [];
      
      let step = 0;
      dreamsData.forEach((dreamData) => {
        const dream = new Dream(dreamData, step).createDream();
        dreams.push(dream);

        step += 10;
      });
      return dreams;
      */
    },
    disposeDreams(dreams) {
      dreams.forEach((dream) => {
        this.mainScene.add(dream.outsidePart);
        this.portalScenes.push(dream.portal);
        this.dreamScenes.push(dream.insidePart);
      });
    },
    getPortals() {
      const portals = [];
      this.portalScenes.forEach((portalScene) => {
        portals.push(portalScene.getObjectByName("portal"));
      });
      return portals;
    },
    onDevOrAllow() {
      const dreamGp = this.dreamScenes[0].getObjectByName("Dream Group", true);
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            const dreamGroup =
              this.dreamScenes[0].getObjectByName("dream scene");
            window.addEventListener(
              "deviceorientation",
              ({ absolute, alpha, beta, gamma }) => {
                this.absolute = absolute;
                // augmente vers la droite et diminue vers la gauche
                this.alpha = Math.round(alpha);
                this.beta = Math.round(beta);
                this.gamma = Math.round(gamma);
                if (this.isZoom) {
                  dreamGroup.rotation.y = (gamma * Math.PI) / 180;
                }
              }
            );
          }
        })
        .catch(console.error);
    },
    animate() {
      this.stats.begin();

      this.controls.update();
      //this.cameraControls.update( delta );

      this.renderer.clear();

      this.renderer.render(this.mainScene, this.camera);

      for (let index = 0; index < this.portalScenes.length; index++) {
        const gl = this.renderer.getContext();

        gl.enable(gl.STENCIL_TEST);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

        gl.stencilFunc(gl.ALWAYS, 1, 0xff);
        gl.stencilMask(0xff);

        this.renderer.render(this.portalScenes[index], this.camera);

        gl.stencilFunc(gl.EQUAL, 1, 0xff);
        gl.stencilMask(0x00);

        this.renderer.clearDepth();

        this.renderer.render(this.dreamScenes[index], this.camera);

        gl.stencilMask(0xff);
        gl.disable(gl.STENCIL_TEST);

        this.renderer.clearStencil();
      }

      this.stats.end();

      requestAnimationFrame(this.animate);
    },
    resize() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    },
    onSwipe(dir) {
      this.zoomable = false;
      if (dir === "left") {
        this.cameraControls.truck(10, 0, true);
        this.zoomable = true;
      } else if (dir === "right") {
        this.cameraControls.truck(-10, 0, true);
        this.zoomable = true;
      }
    },
    onClick() {
      if (window.location.protocol === "https:") {
        this.onDevOrAllow();
      }
      if (this.zoom && this.zoomable) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(), this.camera);

        const intersects = raycaster.intersectObjects(this.getPortals());

        if (intersects.length > 0) {
          this.cameraControls.zoomTo(2.3, true);
          this.zoom = false;
          this.isZoom = true;
        }
      } else {
        this.cameraControls.zoomTo(1, true);
        this.zoom = true;
        this.isZoom = false;
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

#threeCanvas {
  width: 100%;
}

#debug {
  background: black;
  color: white;
  font-size: 1rem;
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 1rem;
  width: 20rem;
  height: 20rem;
}
</style>
