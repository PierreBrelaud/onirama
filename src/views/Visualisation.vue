<template>
  <div class="visu-container">
    <button id="startButton"></button>
    <div id="debug">
      {{mobile}}
      <div>alpha: <span id="alpha"></span></div>
      <div>beta: <span id="beta"></span></div>
      <div>gamma: <span id="gamma"></span></div>
    </div>
    <a class="btn-back" :href="previousView">
      <img class="" src="@/assets/images/icons/right_arrow.svg" alt="">
    </a>
    <canvas id="visuCanvas" />
    <div v-if="isZoomed" class="btn-to btn-to-bottom" @click="onArrowClicked(-1)">
      <img class="btn-icon" src="@/assets/images/icons/arrow-down.svg" alt="">
    </div>
    <div v-if="hasDream" class="dream-detail-container">
      <div class="btn-to-top" @click="onArrowClicked(1)">
        <img class="btn-icon" src="@/assets/images/icons/arrow-up.svg" alt="">
      </div>
      <h1 class="dream-title">{{dreamData.title}}</h1>
      <h3 class="dream-date">{{dreamData.date}}</h3>
      <p class="dream-text">{{ dreamData.text }}</p>
      <div class="separator"></div>
      <p>
        {{ getRestitutionSummary }}
      </p>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { gsap } from "gsap";
import { OrbitControls } from "@three-ts/orbit-controls";
import swipeDetect from "swipe-detect";
import Stats from "stats.js/src/Stats";
import Hammer from "hammerjs";

import { configurations } from "@/utils/settingsConfig";
import CameraController from "@/core/visualisation/CameraController";
import OutsideWorld from "@/core/visualisation/OutsideWorld";
import DreamController from "@/firebase/db/DreamController";
import LoaderManager from '@/core/visualisation/LoaderManager';
import RestitutionSummary from '@/utils/restitutionSummary';
import { isMobile, map } from '@/utils/threejsUtils';

export default {
  data() {
    return {
      dreamData: {},
      isZoomed: false,
      previousView: '/',
      mobile: isMobile(),
    }
  },
  mounted() {
    this.init();
    this.animate();
  },
  computed: {
    hasDream(){
      return !!Object.keys(this.dreamData).length
    },
    getRestitutionSummary(){
      const summary = new RestitutionSummary(this.dreamData);
      return summary.buildSummary();
    },
  },
  methods: {
    init() {
      // DEBUG ===============================================================
      /*
      this.stats = new Stats();
      this.stats.showPanel(0);
      this.stats.dom.style.cssText = 'position:fixed;top:0px;right:0px;cursor:pointer;opacity: 0.9;z-index:10000;';
      document.body.appendChild(this.stats.dom);
      */
      // =====================================================================

      const quality = configurations.high;
      const size = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      this.canvas = document.getElementById("visuCanvas");

      this.renderer = this.initRenderer(quality, size, this.canvas);

      this.clock = new THREE.Clock();

      // CAMERA ==============================================================
      this.camera = new THREE.PerspectiveCamera(
        54,
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
     * Setup the renderer
     * 
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
      renderer.setClearColor(0x001a33);
      renderer.autoClear = false;
      renderer.autoClearStencil = false;
      renderer.autoClearDepth = false;
      renderer.physicallyCorrectLights = true;
      renderer.outputEncoding = THREE.sRGBEncoding;

      return renderer;
    },
    async getDreamsData() {
      //console.log(this.$store.state.auth.user.data);
      const dreamData = this.$store.state.visualisation;
      console.log(dreamData);
      if(dreamData.dreams !== null){
        LoaderManager.loadOutsideModels(() => {
          this.previousView = dreamData.previousView;
          this.initOutsideWorldScene(dreamData);
        });
      } else {
        DreamController.getAll((snapshot) => {
          const data = [];
          snapshot.docs.forEach((doc) => {
            data.push(doc.data());
          });
          LoaderManager.loadOutsideModels(() => {
            this.initOutsideWorldScene(data);
          });
        });
      }
    },
    /**
     * @param {[Object]} dreamsData
     */
    initOutsideWorldScene(dreamsData) {
      /*
      const textureCube = new THREE.CubeTextureLoader()
      .setPath( '../../src/assets/textures/cubemap/NightSky/' )
      .load( [
          'px.png',
          'nx.png',
          'py.png',
          'ny.png',
          'pz.png',
          'nz.png'
      ] );
      textureCube.mapping = THREE.CubeRefractionMapping;
      this.outsideWorldScene.background = textureCube;
      */
      this.outsideWorld = new OutsideWorld(
        this.outsideWorldScene,
        this.portalScenes,
        this.dreamScenes,
        dreamsData
      );
    },
    initListeners() {
      window.addEventListener("resize", () => this.onResize());

      window.addEventListener("keydown", ({ key }) => this.onKeyPress(key));
      
      this.canvas.addEventListener("click", (
        {clientX, clientY}) => this.onClick(clientX, clientY)
      );

      swipeDetect(this.renderer.domElement, (dir) => this.onSwipe(dir), 10);

                    
      document.getElementById("startButton").addEventListener("click", () => {
        if(!isMobile())return;
        document.getElementById('debug').style.background = 'yellow';
        window.addEventListener("deviceorientation", (e) => {
          if(!this.isZoomed) return; 
          document.getElementById("alpha").innerHTML = Math.round(e.alpha);
          document.getElementById("beta").innerHTML = Math.round(e.beta);
          document.getElementById("gamma").innerHTML = Math.round(e.gamma);
          if (e.gamma >= -30 && e.gamma <= 30) {
            const angleH = map(e.gamma, 120, 60, -30, 30);
            this.camera.position.x = Math.cos((angleH * Math.PI) / 180) * 1.3;
            this.camera.position.z = Math.sin((angleH * Math.PI) / 180) * 1.3;
          }

          //const angleV = map(e.beta, 72, 110, 0, 110);
          //camera.position.y = Math.cos((angleV * Math.PI) / 180) * 8;
          //camera.position.z = Math.sin((angleV * Math.PI) / 180) * 8;
        });
        /*
        DeviceOrientationEvent.requestPermission()
        .then((response) => {
          document.getElementById("alpha").innerHTML = 0;
          document.getElementById('debug').style.background = 'green';
          if (response == "granted") {
            window.addEventListener("deviceorientation", (e) => {
              document.getElementById("alpha").innerHTML = Math.round(e.alpha);
              document.getElementById("beta").innerHTML = Math.round(e.beta);
              document.getElementById("gamma").innerHTML = Math.round(e.gamma);
              if (e.gamma >= -30 && e.gamma <= 30) {
                const angleH = map(e.gamma, 120, 60, -30, 30);
                this.camera.position.x = Math.cos((angleH * Math.PI) / 180) * 8;
                this.camera.position.z = Math.sin((angleH * Math.PI) / 180) * 8;
              }

              //const angleV = map(e.beta, 72, 110, 0, 110);
              //camera.position.y = Math.cos((angleV * Math.PI) / 180) * 8;
              //camera.position.z = Math.sin((angleV * Math.PI) / 180) * 8;
            });
          }
        })
        .catch(e => document.getElementById('debug').style.background = 'red');*/
      })
              
      
      /*
      const hammer = new Hammer(document.body);
      hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
      hammer.on('swipe', (evt) => {
        if(this.isZoomed && evt.direction === 8){
          this.onArrowClicked(-1);
        }
      })*/

      window.addEventListener("newDream", ({detail}) => {
        this.dreamData = detail;
      })
    },
    animate() {
      //this.stats.begin();

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
          const background = this.dreamScenes[i].getObjectByName("background");
          background.material.uniforms.uTime.value =
            this.clock.getElapsedTime();
        }

        gl.stencilMask(0xff);
        gl.disable(gl.STENCIL_TEST);

        //this.stats.end();

        this.renderer.clearStencil();
      }
      requestAnimationFrame(this.animate);
    },
    /**
     * @param {String} dir - direction
     */
    moveTo(dir){
      if (!this.outsideWorld.canMoveTo(dir)) return;
        this.outsideWorld.loadNextLandscape(dir);
        this.outsideWorld.loadNextDream(dir);

        this.cameraController.moveToDirection(dir, () => {
          this.outsideWorldScene.remove(this.outsideWorld.getOutsideParts[0]);
          this.outsideWorld.getOutsideParts.shift();
          this.portalScenes.shift();
          this.dreamScenes.shift();
        });
    },
    onResize() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    },
    /**
     * @param {String} dir - direction
     */
    onSwipe(dir) {
      dir = dir === "left" ? 1 : -1;
      if (!this.cameraController.canInteract || this.isZoomed) return;
      this.moveTo(dir);
    },
    /**
     * @param {String} key
     */
    onKeyPress(key) {
      if (!this.cameraController.canInteract || this.isZoomed) return;
      if (key === "ArrowRight") {
        this.moveTo(1);
      } else if (key === "ArrowLeft") {
        this.moveTo(-1);
      }
    },
    /**
     * @param {Number} clientX
     * @param {Number} clientY
     */
    onClick(clientX, clientY){
      if(!this.cameraController.canInteract) return;
      const extPortal = this.dreamScenes[0].getObjectByName("extPortalMesh");
      if(this.isZoomed === true){
        // Remettre la camera et supprimer la détection du gyroscope
        this.cameraController.zoomOut(extPortal, () => {
          this.isZoomed = false;
        })
      } else {
        const mouse = new THREE.Vector2();
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        this.portalScenes.forEach(scene => {
          const intersects = raycaster.intersectObjects(scene.children);
          if(intersects.length > 0){
            this.cameraController.zoomIn(extPortal, () => {
              this.isZoomed = true;
              // Activer le gyroscope
            });
          }
        })
      }
    },
    onArrowClicked(dir){
      // Stopper le renderer lorsqu'on est sur les détail du rêve
      const visuContainer = document.querySelector('.visu-container');
      gsap.to(visuContainer, {
        y: `+=${this.canvas.offsetHeight * dir}`,
      })

    }
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
#debug {
  display: none;
  padding: 1em;
  position: absolute;
  height: 20vh;
  width: 100%;
  background: cornflowerblue;
  bottom: 0;
}
#startButton {
  position: absolute;
  width: 3em;
  height: 6em;
  background: transparent;
  //border: solid 1px red;
  border:none;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%
}

.visu-container {
  position: relative;
  .btn-back {
    height: 30px;
    position: absolute;
    top: 0;
  }
  .btn-to {
    height: 30px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .btn-to-bottom {
    bottom: 0;
    margin-bottom: 2rem;
  }
  .btn-to-top {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn-icon {
    height: 100%;
    width: auto;
  }
  .dream-detail-container {
    position: absolute;
    padding: 2rem;
    color: white;
    width: 100%;
    .dream-img {
      width: 100%;
      display: flex;
      justify-content: center;
      img {
        width: 30rem;
      }
    }
    .dream-title {
      text-align: center;
      margin-top: 2rem;
    }
    .dream-date {
      text-align: center;
      font-family: "Canela Light Italic";
      font-size: 1.5rem;
    }
  }
}
.separator {
  background: #FFFFFF;
  opacity: 0.2;
  height: 0.1rem;
  width: 100%;
  margin: 3rem 0;
}
</style> 