<template>
  <canvas id="portalLabCanvas"></canvas>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "@three-ts/orbit-controls";
import Stats from "three/examples/jsm/libs/stats.module";

import Dream from "../core/visualisation/Dream.js";
import Crystal from "../core/visualisation/Crystal.js";
import Background from "../core/visualisation/Background.js";
import Floor from "../core/visualisation/Floor.js";

export default {
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      this.canvas = document.getElementById("portalLabCanvas");

      this.gui = new dat.GUI();

      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.position.z = 10;

      this.controls = new OrbitControls(this.camera, this.canvas);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(0xfff0ea);
      this.renderer.autoClear = false;
      this.renderer.shadowMap.enabled = true;

      this.dreamScene = new THREE.Scene();
      this.portalScene = new THREE.Scene();

      this.createPortal();
      this.createDream();

      this.clock = new THREE.Clock();
      this.stats = Stats();
      document.body.appendChild(this.stats.dom);
    },
    animate() {
      this.stats.begin();
      this.controls.update();

      this.renderer.clear();

      if (this.background) {
        this.background.material.uniforms.uTime.value =
          this.clock.getElapsedTime();
      }

      const gl = this.renderer.getContext();

      gl.enable(gl.STENCIL_TEST);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

      gl.stencilFunc(gl.ALWAYS, 1, 0xff);
      gl.stencilMask(0xff);

      this.renderer.render(this.portalScene, this.camera);

      gl.stencilFunc(gl.EQUAL, 1, 0xff);
      gl.stencilMask(0x00);

      this.renderer.clearDepth();

      this.renderer.render(this.dreamScene, this.camera);

      gl.stencilMask(0xff);
      gl.disable(gl.STENCIL_TEST);

      this.renderer.clearStencil();

      requestAnimationFrame(this.animate);
      this.stats.end();
    },
    createPortal() {
      const planeGeo = new THREE.PlaneGeometry(4, 6.5);
      const planeMat = new THREE.MeshBasicMaterial();
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.position.z = 1.8;
      const portalFolder = this.gui.addFolder("Portal");
      portalFolder.add(planeMesh.scale, "x", 0.1, 1.5, 0.01);
      this.portalScene.add(planeMesh);
    },
    createDream() {
      // CRYSTAL ==============================
      const crystal = new Crystal();
      crystal.initGui(this.gui);
      this.dreamScene.add(crystal.createCrystal());
      // ======================================

      // BACKGROUND ===========================
      const background = new Background(20, 20);
      this.background = background.createBackground();
      background.initGui(this.gui, this.background.material);
      this.background.position.z = -4;
      this.background.name = "background";
      this.dreamScene.add(this.background);
      // ======================================

      // FLOOR ================================
      const floor = new Floor();
      const flGp = floor.createFloor();
      const bbox = new THREE.Box3().setFromObject(flGp);
      const depth = bbox.max.y - bbox.min.y;
      const width = bbox.max.x - bbox.min.x;
      flGp.position.x = -(width / 2) + 0.2;
      flGp.position.z = -depth + 0.2;
      flGp.position.y = -5;
      this.dreamScene.add(flGp);
      floor.animateFloor();

      const planeTest = new THREE.PlaneGeometry(10, 10);
      const planeMat = new THREE.MeshStandardMaterial();
      planeMat.roughness = 0.7;
      const planeMesh = new THREE.Mesh(planeTest, planeMat);
      planeMesh.rotation.x = -Math.PI * 0.5;
      planeMesh.position.y = -2;
      planeMesh.receiveShadow = true;
      //this.dreamScene.add(planeMesh);
      // ======================================

      // LIGHT ================================
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      //this.dreamScene.add(ambientLight);

      const ptLight1 = new THREE.PointLight(0xffffff, 0.6);
      ptLight1.position.set(3, 0, 3);
      this.dreamScene.add(ptLight1);

      const sphereSize = 1;
      const pointLightHelper1 = new THREE.PointLightHelper(
        ptLight1,
        sphereSize
      );
      //this.dreamScene.add(pointLightHelper1);

      const ptLight2 = new THREE.PointLight(0xffffff, 0.4);
      ptLight2.position.set(-2, 0, 0.5);
      this.dreamScene.add(ptLight2);

      const pointLightHelper2 = new THREE.PointLightHelper(
        ptLight2,
        sphereSize
      );
      //this.dreamScene.add(pointLightHelper2);
      // ======================================

      document.addEventListener("crystalChanged", () => {
        this.dreamScene.remove(this.dreamScene.getObjectByName("crystal"));
        this.dreamScene.add(crystal.createCrystal());
      });
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

#portalLabCanvas {
  width: 100%;
  height: 95vh;
}
</style>