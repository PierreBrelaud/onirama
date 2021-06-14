<template>
  <canvas id="portalLabCanvas"></canvas>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "@three-ts/orbit-controls";
import Stats from "three/examples/jsm/libs/stats.module";

import Dream from "@/core/visualisation/Dream.js";

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

      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      this.camera.position.z = 3;

      this.controls = new OrbitControls(this.camera, this.canvas);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
      });
      this.renderer.setSize(width, height);
      //this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(0xfff0ea);
      this.renderer.autoClear = false;
      this.renderer.physicallyCorrectLights = true;
      this.renderer.outputEncoding = THREE.sRGBEncoding;

      this.dreamScene = new THREE.Scene();
      this.portalScene = new THREE.Scene();

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

      const background = this.getBackground(this.dreamScene);
      background.material.uniforms.uTime.value = this.clock.getElapsedTime();

      gl.stencilMask(0xff);
      gl.disable(gl.STENCIL_TEST);

      this.renderer.clearStencil();

      requestAnimationFrame(this.animate);
      this.stats.end();
    },
    createDream() {
      const dream = new Dream(0, {});
      this.portalScene = dream.scene.portal;
      this.dreamScene = dream.scene.insidePart;
      dream.crystal.initGui(this.gui);
      dream.background.initGui(this.gui);

      document.addEventListener("crystalChanged", () => {
        const insidePartGroup = this.dreamScene.getObjectByName("insidePartGroup");
        const crystalGroup = insidePartGroup.getObjectByName("crystal");
        crystalGroup.remove(crystalGroup.children[0]);
        //console.log(crystal);
        insidePartGroup.add(dream.crystal.createCrystal());
        //dream.crystal.crystal.position.y = 0.01;
        //dream.crystal.crystal.position.z = 1;
        //dream.crystal.animateCrystal();
      });
    },
    getBackground(scene) {
      return scene.getObjectByName("background");
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