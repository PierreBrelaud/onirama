import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import Background from "@/core/visualisation/Background";
import Floor from "@/core/visualisation/Floor";
import Crystal from "@/core/visualisation/Crystal";
import { drawPoint } from '@/utils/threejsUtils';

export default class Dream {
    /**
     * @param {Number} position 
     * @param {Number} index 
     * @constructor
     */
    constructor(position, index){
        this.position = position;
        this.index = index;
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
        const insidePartScene = new THREE.Scene();
        const insidePartGroup = new THREE.Group();

        // LIGHT =================================
        const ptLight1 = new THREE.PointLight(0xffffff, 0.6);
        ptLight1.position.set(this.position + 3, 0, 3);

        const ptLight2 = new THREE.PointLight(0xffffff, 0.4);
        ptLight2.position.set(this.position - 2, 0, 0.5);

        insidePartScene.add(ptLight1, ptLight2);
        // =======================================

        insidePartGroup.add(
            this.createBackground(),
            this.createFloor(),
            this.createCrystal(),
        );

        insidePartGroup.position.set(this.position, 0, -2);

        insidePartScene.add(insidePartGroup);

        return insidePartScene;
    }
    /**
     * @returns {THREE.Mesh}
     */
    createBackground(){
        const background = new Background(20, 20);
        const bgMesh = background.createBackground();
        bgMesh.name = "background";
        bgMesh.position.z = -20;
        
        return bgMesh;
    }
    /**
     * @returns {THREE.Group}
     */
    createFloor(){
        const floor = new Floor();
        const flGp = floor.createFloor();
        floor.animateFloor();
        flGp.position.y = -0.8;
        
        return flGp
    }
    /**
     * @returns {THREE.Mesh}
     */
    createCrystal(){
        const crystal = new Crystal();
        const crystalMesh = crystal.createCrystal();
        return crystalMesh;
    }
}