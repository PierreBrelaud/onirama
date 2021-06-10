import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from 'gsap';

import Background from "@/core/visualisation/Background";
import Floor from "@/core/visualisation/Floor";
import Crystal from "@/core/visualisation/Crystal";
import { drawPoint, degreeToRad } from '../../utils/threejsUtils';


export default class Dream {
    /**
     * @param {Number} position 
     * @param {Number} index 
     * @constructor
     */
    constructor(position, index){
        this.position = position;
        this.index = index;
        this.insidePartScene = new THREE.Scene();
        this.lights = [];
        this.scene = this.createDream();
    }
    /**
     * @returns {Object}
     */
    createDream(){
        return {
            portal: this.createPortal(),
            insidePart: this.createInsidePart(),
        }
    }
    /**
     * @returns {THREE.Scene}
     */
    createPortal(){
        const portalScene = new THREE.Scene();
        portalScene.name = "portal";

        const planeGeo = new THREE.PlaneGeometry(0.6, 1.2);
        const planeMat = new THREE.MeshBasicMaterial();
        const planeMesh = new THREE.Mesh(planeGeo, planeMat);
        planeMesh.position.set(this.position, 0, 0);
        
        portalScene.add(planeMesh);

        return portalScene;
    }
    /**
     * @returns {THREE.Scene}
     */
    createInsidePart(){
        const insidePartGroup = new THREE.Group();

        this.createLight();

        insidePartGroup.add(
            this.createBackground(),
            this.createCrystal(),
        );
        
        // PILLAR LOADING
        const loader = new GLTFLoader()
            .setPath('../../src/assets/models/pillar/');
        
        loader.load('pilier_02.gltf', (gltf) => {
            insidePartGroup.add(this.createFloor(gltf.scene));
        })

        insidePartGroup.position.set(this.position, 0, -2);

        this.insidePartScene.add(insidePartGroup);

        const dreamSkybox = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide,
            })
        )
        this.insidePartScene.add(dreamSkybox);

        return this.insidePartScene;
    }
    /**
     * @returns {THREE.Group}
     */
    createBackground(){
        const background = new Background(20, 20, this.position);
        const bgGp = background.createBackground();
        bgGp.position.z = -20;
        
        return bgGp;
    }
    /**
     * @returns {THREE.Group}
     */
    createFloor(pillarModel){
        const floor = new Floor();
        const flGp = floor.createFloor(pillarModel);
        floor.animateFloor();
        flGp.position.z = -0.5
        flGp.position.y = -0.8;
        
        return flGp
    }
    /**
     * @returns {THREE.Group}
     */
    createCrystal(){
        const crystal = new Crystal();
        const crystalGroup = crystal.createCrystal();
        crystal.animateCrystal();
        crystalGroup.position.y = 0.2;
        crystalGroup.position.z = 1;
        return crystalGroup;
    } 
    createLight() {
        const pivot = new THREE.Group();
        pivot.position.set(this.position, 0.2, -1);
        pivot.rotation.x = degreeToRad(-30);
        //this.insidePartScene.add(drawPoint(pivot.position.x, pivot.position.y, pivot.position.z));
        this.insidePartScene.add(pivot);

        const ptLight1 = new THREE.PointLight(0xC93737, 1, 0.8, 0.8);
        ptLight1.position.set(0, 0, 0.3);
        const ptH1 = new THREE.PointLightHelper(ptLight1, 0.1);
        pivot.add(ptLight1);
        //this.insidePartScene.add(ptH1);

        const ptLight2 = new THREE.PointLight(0x23C9FF, 1, 0.8, 0.8);
        ptLight2.position.set(0, 0, -0.5);
        const ptH2 = new THREE.PointLightHelper(ptLight2, 0.1);
        pivot.add(ptLight2);
        //this.insidePartScene.add(ptH2);

        this.animateLight(pivot);
    }
    animateLight(pivot) {
        const tl = gsap.timeline({repeat: -1});
        tl.to(pivot.rotation, {
            duration: 8,
            ease: 'none',
            y: `+=${degreeToRad(360)}`,
        })
    }
}