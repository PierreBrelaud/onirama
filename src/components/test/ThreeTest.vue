<template>
    <canvas id="threeCanvas"/>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';
import CameraControls from 'camera-controls';
import swipeDetect from 'swipe-detect';
import Stats from 'stats.js';

export default {
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
            
            this.mainScene = new THREE.Scene();
            this.portalScenes = [];
            this.portals = [];
            this.dreamScenes = [];
            this.crystals = [];
			
            this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
            this.camera.position.z = 10;
            
            this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
            this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
            this.renderer.setClearColor(0xFFF0EA);
            this.renderer.autoClear = false;

            this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);
            this.cameraControls.touches.one = CameraControls.ACTION.NONE;
            this.cameraControls.touches.two = CameraControls.ACTION.NONE;
            this.cameraControls.touches.three = CameraControls.ACTION.NONE;

            let zoomable = true

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
            
            const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
            this.mainScene.add(ambientLight);
            const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1 );
            this.mainScene.add(hemisphereLight);

            this.generateWorld({x: 0});
            this.generateWorld({x: 10});
            this.generateWorld({x: 20});

            // Zoom
            let zoom = true;

            this.canvas.addEventListener('click', () => {
                if(zoom && zoomable) {
                    const raycaster = new THREE.Raycaster();
                    raycaster.setFromCamera(new THREE.Vector2(), this.camera);
                    /*
                    const ray = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 100, Math.random() * 0xffffff )
                    this.mainScene.add(ray);*/
                    const intersects = raycaster.intersectObjects(this.portals);
                    if(intersects.length > 0) {
                        this.cameraControls.zoomTo(2, true)
                        zoom = false;
                    }
                } else {
                    this.cameraControls.zoomTo(1, true);
                    zoom = true
                }
            }) 
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

            this.crystals.forEach(crystal => {
                crystal.rotation.y += 0.01;
            })

            requestAnimationFrame(this.animate);
        },
        generateWorld(position) {
            // Main Scene
            const planeGeo = new THREE.PlaneGeometry(8, 8);
            const planeMat = new THREE.MeshBasicMaterial({
                color: 0x9A4C95,
                side: THREE.DoubleSide
            });
            const plane = new THREE.Mesh(planeGeo, planeMat);
            plane.position.y = -2.5;
            plane.position.x = position.x;
            plane.rotation.x = Math.PI / 2;
            this.mainScene.add(plane);
            
            this.generateDream(position);
        },
        generateDream(position) {
            // Portal
            const portalScene = new THREE.Scene();
            const portalGeometry = new THREE.PlaneGeometry(3.5, 5);
            const portalMaterial = new THREE.MeshBasicMaterial({
                color: 0x222222,
                colorWrite: true,
                depthWrite: false
            });
            const portal = new THREE.Mesh(portalGeometry, portalMaterial);
            portal.position.x = position.x;
            portalScene.add(portal);
            this.portals.push(portal);
            this.portalScenes.push(portalScene);

            const dreamScene  = new THREE.Scene();

            //==================================================
            //  Inside the portal
            //================================================== 
            const dreamHemLight = new THREE.HemisphereLight(0xffffff, 0xF3A712, 0.8 );
            dreamScene.add(dreamHemLight);

            const dreamGroup = new THREE.Group();
            dreamGroup.position.z = -5;
            dreamGroup.position.x = position.x;
            
            const dreamPlaneGeo = new THREE.PlaneGeometry(10, 10);
            
            // Floor
            const dreamFloorMat = new THREE.MeshStandardMaterial({
                color: 0xFF6F59,
                side: THREE.DoubleSide,
            })
            const dreamFloor = new THREE.Mesh(dreamPlaneGeo, dreamFloorMat);
            dreamFloor.rotation.x = Math.PI / 2;
            dreamFloor.position.y = - 2.6;
            dreamGroup.add(dreamFloor)

            // Background
            
            // Crystal
            const crystalGeo = new THREE.IcosahedronGeometry(0.8);
            const crystalMat = new THREE.MeshStandardMaterial({
                color: 0x337CA0,
            });
            const crystal = new THREE.Mesh(crystalGeo, crystalMat);
            crystal.position.z = 3;
            crystal.position.y = 1;
            dreamGroup.add(crystal);
            this.crystals.push(crystal);
            
            // Pedestal
            const pedestalGeo = new THREE.BoxGeometry(1.5, 2.5, 1.5);
            const pedestalMat = new THREE.MeshStandardMaterial({
                color: 0xF3A712,
            });
            const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
            pedestal.position.y = -1.5;
            pedestal.position.z = 3;
            dreamGroup.add(pedestal);
            
            dreamScene.add(dreamGroup);
            //==================================================

            this.dreamScenes.push(dreamScene);
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
#threeCanvas {
    width: 100%;
    height: 95vh;
}
</style>