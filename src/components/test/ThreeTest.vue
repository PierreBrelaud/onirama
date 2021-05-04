<template>
    <canvas id="threeCanvas"/>

    <div id="debug" v-show="isDebug">
        <p>absolute : {{absolute}}</p>
        <p>alpha : {{alpha}}</p>
        <p>beta : {{beta}}</p>
        <p>gamma : {{gamma}}</p>
        <p>secure : {{secure}}</p>
        <button @click="onDevOrAllow">Allow device orientation</button>
    </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';
import CameraControls from 'camera-controls';
import swipeDetect from 'swipe-detect';
import Stats from 'stats.js/src/Stats';
import {DeviceOrientationControls} from 'three/examples/jsm/controls/DeviceOrientationControls';
import Dream from "../../core/visualisation/Dream";

export default {
    data() {
        return {
            isDebug: false,
            absolute: 0,
            alpha: 0,
            beta: 0,
            gamma: 0,
            secure: null,
        }
    },
    mounted() {
        this.init();
        this.animate();

        window.addEventListener('resize', () => {
            this.resize();
        });
    },
    methods: {
        init() {
            CameraControls.install({THREE: THREE});

            this.stats = new Stats();
            this.stats.showPanel(0);
            document.body.appendChild(this.stats.dom);

            this.clock = new THREE.Clock();

            this.canvas = document.getElementById('threeCanvas');

            const width = window.innerWidth;
            const height = window.innerHeight

            this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            this.camera.position.z = 10;

            this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
            this.renderer.setSize(width, height);
            //this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setClearColor(0xFFF0EA);
            this.renderer.autoClear = false;

            this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);
            this.cameraControls.touches.one = CameraControls.ACTION.NONE;
            this.cameraControls.touches.two = CameraControls.ACTION.NONE;
            this.cameraControls.touches.three = CameraControls.ACTION.NONE;

            let zoomable = true;

            swipeDetect(
                this.renderer.domElement,
                (dir) => {
                    zoomable = false;
                    if (dir === "left") {
                        this.cameraControls.truck(10, 0, true);
                        zoomable = true;
                    } else if (dir === "right") {
                        this.cameraControls.truck(-10, 0, true);
                        zoomable = true;
                    }
                },
                10
            );

            //==================================================
            //  Zoom
            //==================================================
            let zoom = true;
            this.isZoom = false;

            this.canvas.addEventListener('click', () => {
                //this.onDevOrAllow();
                if(zoom && zoomable) {
                    const raycaster = new THREE.Raycaster();
                    raycaster.setFromCamera(new THREE.Vector2(), this.camera);

                    const intersects = raycaster.intersectObjects(this.getPortals());

                    if(intersects.length > 0) {
                        this.cameraControls.zoomTo(2.3, true)
                        zoom = false;
                        this.isZoom = true;
                    }
                } else {
                    this.cameraControls.zoomTo(1, true);
                    zoom = true
                    this.isZoom = false;
                }
            })
            this.secure = window.isSecureContext;

            this.mainScene = new THREE.Scene();

            const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
            this.mainScene.add(ambientLight);
            const hemisphereLight = new THREE.HemisphereLight(
                0xffffff,
                0x000000,
                1
            );
            this.mainScene.add(hemisphereLight);

            this.portalScenes = [];
            this.dreamScenes = [];

            const dreamsData = this.getDreamsData();
            const dreams = this.createDreams(dreamsData);
            this.disposeDreams(dreams);
        },
        getDreamsData(){
            return [
                {
                    outsidePart: {color: 0x444554},
                    insidePart: {
                        floorData: {color: 0xffffff},
                        backgroundData: {color:0xffffff},
                        pedestalData: {color: 0xffffff},
                        crystalData: {color:0xffffff},
                    },
                },
                {
                    outsidePart: {color: 0x444554},
                    insidePart: {
                        floorData: {color: 0xffffff},
                        backgroundData: {color:0xffffff},
                        pedestalData: {color: 0xffffff},
                        crystalData: {color:0xffffff},
                    },
                }
            ]
        },
        createDreams(dreamsData){
            const dreams = [];
            let step = 0;
            dreamsData.forEach(dreamData => {
                const dream = new Dream(dreamData, step).createDream();
                dreams.push(dream);

                step += 10;
            })
            return dreams;
        },
        disposeDreams(dreams){
            dreams.forEach(dream => {
                this.mainScene.add(dream.outsidePart);
                this.portalScenes.push(dream.portal);
                this.dreamScenes.push(dream.insidePart);
            });
        },
        getPortals(){
            const portals = [];
            this.portalScenes.forEach(portalScene => {
                portals.push(portalScene.getObjectByName('portal'));
            })
            return portals
        },
        onDevOrAllow() {
            const dreamGp = this.dreamScenes[0].getObjectByName("Dream Group", true);
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', ({absolute, alpha, beta, gamma}) => {
                            this.absolute = absolute;
                            // augmente vers la droite et diminue vers la gauche
                            this.alpha = Math.round(alpha);
                            this.beta = Math.round(beta);
                            this.gamma = Math.round(gamma);
                            if(this.isZoom) {
                              dreamGp.rotation.y = gamma * Math.PI/180;
                            }
                        })
                    }
                })
                .catch(console.error)
        },
        animate() {
            this.stats.begin();

            const delta = this.clock.getDelta();
            this.cameraControls.update( delta );

            this.renderer.clear();

            this.renderer.render(this.mainScene, this.camera);

            for (let index = 0; index < this.portalScenes.length; index++) {
                const gl = this.renderer.getContext();

                gl.enable(gl.STENCIL_TEST);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

                gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
                gl.stencilMask(0xFF);

                this.renderer.render(this.portalScenes[index], this.camera);

                gl.stencilFunc(gl.EQUAL, 1, 0xFF);
                gl.stencilMask(0x00);

                this.renderer.clearDepth();

                this.renderer.render(this.dreamScenes[index], this.camera);

                gl.stencilMask(0xFF);
                gl.disable(gl.STENCIL_TEST);

                this.renderer.clearStencil();
            }

            this.stats.end();
            this.dreamScenes.forEach(scene => {
                const crystal = scene.getObjectByName('crystal');
                crystal.rotation.y += 0.01;
            })

            requestAnimationFrame(this.animate);
        },
        resize() {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();


        }
    }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

#threeCanvas {
    width: 100%;
    height: 95vh;
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
