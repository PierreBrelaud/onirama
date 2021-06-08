<template>
  <canvas id="visuCanvas" />

</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import swipeDetect from "swipe-detect";
import Stats from "stats.js/src/Stats";

import { configurations } from "@/utils/settingsConfig";
import CameraController from "@/core/visualisation/CameraController";
import OutsideWorld from "@/core/visualisation/OutsideWorld";
import DreamController from "@/firebase/db/DreamController";
import { drawPoint } from "@/utils/threejsUtils";

export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      // DEBUG ===============================================================
      this.stats = new Stats();
      this.stats.showPanel(0);
      document.body.appendChild(this.stats.dom);
      // =====================================================================

      const quality = configurations.low;
      const size = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      this.canvas = document.getElementById("visuCanvas");

      this.renderer = this.initRenderer(quality, size, this.canvas);

      this.clock = new THREE.Clock();

      // CAMERA ==============================================================
      this.camera = new THREE.PerspectiveCamera(
        40,
        size.width / size.height,
        0.1,
        1000
      );
      this.camera.position.set(0, 0.1, 5);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enabled = false;

      this.cameraController = new CameraController(this.camera, this.controls);
      // =====================================================================

      this.outsideWorldScene = new THREE.Scene();

      /**
       * @type {[THREE.Scene]}
       */
      this.portalScenes = [];
      /**
       * @type {[THREE.Scene]}
       */
      this.dreamScenes = [];

      this.getDreamsData();
      this.initListeners();
    },
    /**
     * @param {Object} quality
     * @param {Object} size
     * @param {HTMLCanvasElement} canvas
     * @returns {THREE.WebGLRenderer}
     */
    initRenderer(quality, size, canvas) {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: quality.antialias,
      });

      renderer.setSize(size.width, size.height);
      if (quality.pixelRatio) renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0xfff0ea);
      renderer.autoClear = false;
      renderer.autoClearStencil = false;
      renderer.autoClearDepth = false;
      renderer.physicallyCorrectLights = true;
      renderer.outputEncoding = THREE.sRGBEncoding;

      return renderer;
    },
    async getDreamsData() {
      DreamController.getAll((snapshot) => {
        const data = [];
        snapshot.docs.forEach((doc) => {
          data.push(doc.data());
        });
        this.initOutsideWorldScene();
      });
    },
    initOutsideWorldScene() {
      const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
      this.outsideWorldScene.add(hemisphereLight);

      this.outsideWorld = new OutsideWorld(
        this.outsideWorldScene,
        this.portalScenes,
        this.dreamScenes
      );
    },
    initListeners() {
      window.addEventListener("resize", () => this.onResize());

      window.addEventListener("keydown", ({ key }) => this.onKeyPress(key));

      swipeDetect(this.renderer.domElement, (dir) => this.onSwipe(dir), 10);
    },
    getBackground(scene) {
      return scene.getObjectByName("background");
    },
    animate() {
      this.stats.begin();

      this.controls.update();

      this.renderer.clear();

      this.renderer.render(this.outsideWorldScene, this.camera);

      if (this.portalScenes.length > 0) {
        const gl = this.renderer.getContext();

        gl.enable(gl.STENCIL_TEST);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

        for (let i = 0; i < this.portalScenes.length; i++) {
          gl.stencilFunc(gl.ALWAYS, i + 1, 0xff);
          gl.stencilMask(0xff);
          this.renderer.render(this.portalScenes[i], this.camera);
        }

        this.renderer.clearDepth();

        for (let i = 0; i < this.portalScenes.length; i++) {
          gl.stencilFunc(gl.EQUAL, i + 1, 0xff);
          gl.stencilMask(0x00);

          this.renderer.render(this.dreamScenes[i], this.camera);

          // BACKGROUND ANIMATION
          const background = this.getBackground(this.dreamScenes[i]);
          background.material.uniforms.uTime.value =
            this.clock.getElapsedTime();
        }

        gl.stencilMask(0xff);
        gl.disable(gl.STENCIL_TEST);

        this.stats.end();

        this.renderer.clearStencil();
      }
      requestAnimationFrame(this.animate);
    },
    onResize() {
      console.log("resize");
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    },
    /**
     * @param {String} dir - direction
     */
    onSwipe(dir) {
      dir = dir === "left" ? 1 : -1;
      if (!this.cameraController.canInteract) return;
      if (!this.outsideWorld.canMoveTo(dir)) return;
      this.outsideWorld.loadNextLandscape(dir);
      this.cameraController.moveToDirection(dir);
    },
    /**
     * @param {String} key
     */
    onKeyPress(key) {
      if (!this.cameraController.canInteract) return;
      if (key === "ArrowRight") {
        if (!this.outsideWorld.canMoveTo(1)) return;
        this.outsideWorld.loadNextLandscape(1);
        this.outsideWorld.loadNextDream(1);
        this.cameraController.moveToDirection(1, () => {
          console.log("test");
          this.portalScenes.shift();
          this.dreamScenes.shift();
        });
      } else if (key === "ArrowLeft") {
        if (!this.outsideWorld.canMoveTo(-1)) return;
        this.outsideWorld.loadNextLandscape(-1);
        this.outsideWorld.loadNextDream(-1);
        this.cameraController.moveToDirection(-1, () => {
          this.portalScenes.shift();
          this.dreamScenes.shift();
        });
        
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
#visuCanvas {
  width: 100%;
}
</style> 