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

            this.initMainScene();
            this.initCameraControls();

            this.isZoom = false;
            this.zoomable = true;
            this.zoom = true;

            swipeDetect(
                this.renderer.domElement,
                (dir)=>{this.onSwipe(dir)},
                10
            );

            this.canvas.addEventListener('click',
                () => { this.onClick()
            });

            this.portalScenes = [];
            this.dreamScenes = [];

            this.getDreamsData();
        },
        initMainScene(){
            this.mainScene = new THREE.Scene();

            const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
            this.mainScene.add(ambientLight);
            const hemisphereLight = new THREE.HemisphereLight(
                0xffffff,
                0x000000,
                1
            );
            this.mainScene.add(hemisphereLight);
        },
        initCameraControls(){
            this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);
            this.cameraControls.touches.one = CameraControls.ACTION.NONE;
            this.cameraControls.touches.two = CameraControls.ACTION.NONE;
            this.cameraControls.touches.three = CameraControls.ACTION.NONE;
        },
        async getDreamsData(){
            const feelingColor      = [0x91F9E5, 0x76F7BF, 0x5FDD9D, 0x499167, 0x3F4531 ];
            const memoryColor       = [0x75F4F4, 0x90E0F3, 0xB8B3E9, 0xD999B9, 0xD17B88 ];
            const credibilityColor  = [0xF5DD90, 0xF68E5F, 0xF76C5E, 0x721121];
            const sleepColor        = [0x2DE1C2, 0x6AD5CB, 0x7FBEAB, 0x7E998A, 0x85877C];
            const impactColor       = [0x11151C, 0x212D40, 0x364156, 0x7D4E57, 0xD66853];


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
                    const dreamsData = [
                        {
                            outsidePart: {color: impactColor[data.credibility]},
                            insidePart: {
                                floorData: {color: feelingColor[data.feeling]},
                                backgroundData: {color: memoryColor[data.memory]},
                                pedestalData: {color: sleepColor[data.sleep]},
                                crystalData: {color: credibilityColor[data.impact]},
                            },
                        }
                    ];
                    const dreams = this.createDreams(dreamsData);
                    this.disposeDreams(dreams);
                },
                (error) => {
                    console.log(error);
                }
            )
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
        onDevOrAllow(){
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
        animate(){
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
        resize(){
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();


        },
        onSwipe(dir){
            this.zoomable = false;
            if (dir === "left") {
                this.cameraControls.truck(10, 0, true);
                this.zoomable = true;
            } else if (dir === "right") {
                this.cameraControls.truck(-10, 0, true);
                this.zoomable = true;
            }
        },
        onClick(){
            if(window.isSecureContext) {
                this.onDevOrAllow();
            }
            if(this.zoom && this.zoomable) {
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(new THREE.Vector2(), this.camera);

                const intersects = raycaster.intersectObjects(this.getPortals());

                if(intersects.length > 0) {
                    this.cameraControls.zoomTo(2.3, true)
                    this.zoom = false;
                    this.isZoom = true;
                }
            } else {
                this.cameraControls.zoomTo(1, true);
                this.zoom = true
                this.isZoom = false;
            }
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
