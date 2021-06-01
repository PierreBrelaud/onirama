<template>
  <canvas id="portalLabCanvas"></canvas>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import Dream from "../core/visualisation/Dream.js";
import Crystal from "../core/visualisation/Crystal.js";
import Background from "../core/visualisation/Background.js";
import * as dat from "dat.gui";

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
      //this.renderer.autoClear = false;

      this.scene = new THREE.Scene();

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      //this.scene.add(cube);

      this.createDream();

      this.clock = new THREE.Clock();
    },
    animate() {
      this.controls.update();

      if (this.background) {
        this.background.material.uniforms.uTime.value = this.clock.getElapsedTime();
      }

      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(this.animate);
    },
    createDream() {
      const crystal = new Crystal();
      crystal.initGui(this.gui);
      this.scene.add(crystal.createCrystal());

      const background = new Background(10, 10);
      this.background = background.createBackground();
      background.initGui(this.gui, this.background.material);
      this.background.position.z = -2;
      this.background.name = "background";
      this.scene.add(this.background);

      document.addEventListener("crystalChanged", () => {
        this.scene.remove(this.scene.getObjectByName("crystal"));
        this.scene.add(crystal.createCrystal());
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