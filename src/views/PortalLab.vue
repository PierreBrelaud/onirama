<template>
  <canvas id="portalLabCanvas"></canvas>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "@three-ts/orbit-controls";
import Stats from "three/examples/jsm/libs/stats.module";

import Dream from "@/core/visualisation/Dream.js";
import { configurations } from "@/utils/settingsConfig";
import { map } from '@/utils/threejsUtils';

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

      const quality = configurations.medium;

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: quality.antialias,
      });
      this.renderer.setSize(width, height);
      if (quality.pixelRatio) this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(0xfff0ea);
      this.renderer.autoClear = false;
      this.renderer.physicallyCorrectLights = true;
      this.renderer.outputEncoding = THREE.sRGBEncoding;

      window.addEventListener("resize", () => this.onResize());

      this.dreamScene = new THREE.Scene();
      this.portalScene = new THREE.Scene();

      this.createDream();

      this.clock = new THREE.Clock();
      this.stats = Stats();
      document.body.appendChild(this.stats.dom);

      const params = {
        basement: 1,
        pillar: 1,
        light1: {r: 255, g: 255, b: 255},
        light2: {r: 255, g: 255, b: 255},
        light3: {r: 255, g: 255, b: 255}
      };

      const basements = { 
        Cauchemar: 0,
        Mauvais_rêve: 1,
        Erotique: 2,
        Contemplatif: 3,
        Vie_quotidienne: 4,
        Inclassifiable: 5,
      };
      const basementFolder = this.gui.addFolder("Basement");
      basementFolder.add( params, 'basement', basements ).onChange((e) => {
        this.changeBasement(e)
      });

      const pillars = {
        Pillar1: 1,
        Pillar2: 2,
        Pillar3: 3,
        Pillar4: 4,
      }
      const pillarFolder = this.gui.addFolder("Pillar");
      pillarFolder.add( params, 'pillar', pillars ).onChange((e) => {
        this.changePillar(e)
      });

      this.initColorGui(this.gui, params);
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
    createDream(){
      this.dream = new Dream(0, {});
      this.portalScene = this.dream.scene.portal;
      this.dreamScene = this.dream.scene.insidePart;
      this.dream.crystal.initGui(this.gui);
      this.dream.background.initGui(this.gui);

      document.addEventListener("crystalChanged", () => {
        const insidePartGroup = this.dreamScene.getObjectByName("insidePartGroup");
        const crystalGroup = insidePartGroup.getObjectByName("crystal");
        crystalGroup.remove(crystalGroup.children[0]);
        insidePartGroup.add(this.dream.crystal.createCrystal());
      });
    },
    changeBasement(type){
      const insidePartGroup = this.dreamScene.getObjectByName("insidePartGroup");
      const basement = insidePartGroup.getObjectByName("basement");
      insidePartGroup.remove(basement);
      this.dream.createBasement(
        type, 
        new THREE.Vector3(0, -0.8, 1), 
        insidePartGroup
      )
    },
    changePillar(pillarId){
      const insidePartGroup = this.dreamScene.getObjectByName("insidePartGroup");
      const floorGroup = insidePartGroup.getObjectByName("floorGroup");
      insidePartGroup.remove(floorGroup);
      this.dream.createPillar(pillarId, insidePartGroup);
    },
    getBackground(scene){
      return scene.getObjectByName("background");
    },
    initColorGui(gui, params){
      const lightFolder = gui.addFolder("Lights");
      const crystalLight1 = this.dreamScene.getObjectByName("crystal-light-1");
      lightFolder.addColor(params, 'light1').name('Crystal Light 1').onChange(({r, g, b}) => {
        const color = new THREE.Color(
          map(r, 0, 255, 0, 1),
          map(g, 0, 255, 0, 1),
          map(b, 0, 255, 0, 1),
        )
        crystalLight1.color = color;
        crystalLight1.children[0].material.color = color
      });

      const crystalLight2 = this.dreamScene.getObjectByName("crystal-light-2");
      lightFolder.addColor(params, 'light2').name('Crystal Light 2').onChange(({r, g, b}) => {
        const color = new THREE.Color(
          map(r, 0, 255, 0, 1),
          map(g, 0, 255, 0, 1),
          map(b, 0, 255, 0, 1),
        )
        crystalLight2.color = color;
        crystalLight2.children[0].material.color = color
      });

      const crystalLight3 = this.dreamScene.getObjectByName("basement-light");
      lightFolder.addColor(params, 'light3').name('Basement Light').onChange(({r, g, b}) => {
        const color = new THREE.Color(
          map(r, 0, 255, 0, 1),
          map(g, 0, 255, 0, 1),
          map(b, 0, 255, 0, 1),
        )
        crystalLight3.color = color;
        crystalLight3.children[0].material.color = color
      });
    },
    onResize() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
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