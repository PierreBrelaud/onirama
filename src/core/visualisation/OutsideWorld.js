import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';

import Dream from '@/core/visualisation/Dream'
import {drawPoint} from '@/utils/threejsUtils'

export default class OutsideWorld {
    /**
     * @param {THREE.Scene} outsideWorldScene 
     * @param {[THREE.Scene]} portalScenes 
     * @param {[THREE.Scene]} dreamScenes
     * @param {[Object]} dreamsData 
     * @constructor
     */
    constructor(outsideWorldScene, portalScenes, dreamScenes, dreamsData) {
        this.outsideWorldScene = outsideWorldScene;
        this.portalScenes = portalScenes;
        this.dreamScenes = dreamScenes;
        this.dreamsData = dreamsData;
        
        this.landscapeSize = 9.37;
        this.dreams = {
			current: 0,
			min: 0,
			max: this.dreamsData.length, 
			data: [
				{text: "dream 0"},
				{text: "dream 1"},
				{text: "dream 2"},
				{text: "dream 3"},
				{text: "dream 4"},
			]
		};
        this.displayedLandscape = [3, 4, 0, 1, 2];
        this.loader = new GLTFLoader().setPath(
            "../../src/assets/models/landscapes/"
        );
        
		this.currentPos = 0;
		
		this.currentDream = this.dreams.current;
		this.lastDream = this.dreams.current;
        this.outsideParts = [];
        
		this.initLandscapes();
		this.initDream();
    }
    initLandscapes() {
        this.displayedLandscape.forEach((id, index) => {
            this.loader.load(`map_${id}.gltf`, (gltf) => {
                const posX = this.landscapeSize * (index - 2)
                gltf.scene.position.x = posX;
                gltf.scene.name = `landscape_${id}`;
                // TODO Replace material by a cheapest one

                const pointLight = new THREE.PointLight( 0xD01119, 1);
                pointLight.position.x = posX;
                gltf.scene.children.push(pointLight);

                this.outsideWorldScene.add(gltf.scene);
            });
        });
    }
	/**
	 * @param {Number} dir - direction (-1, 1) 
	 */
    loadNextLandscape(dir) {
        const last = this.displayedLandscape[this.displayedLandscape.length - 1];
        const first = this.displayedLandscape[0];
        
        let next = null;
        if(dir === -1) {
            next = first === 0 ? 4 : first - 1;
            this.displayedLandscape.unshift(next)
            this.displayedLandscape.pop();
        } else {
            next = last === 4 ? 0 : last + 1;
            this.displayedLandscape.push(next);
            this.displayedLandscape.shift();
        }

        this.loader.load(`map_${next}.gltf`, (gltf) => {
            const posX = dir === -1 ? 
                this.currentPos - this.landscapeSize * 2 :
                this.currentPos + this.landscapeSize * 2;
            gltf.scene.position.x = posX;
            gltf.scene.name = `landscape_${next}`;
            
            const pointLight = new THREE.PointLight( 0xffffff, 0.4, 0);
            pointLight.position.x = posX;
            gltf.scene.children.push(pointLight);

            this.outsideWorldScene.add(gltf.scene);
        });
        
        const toRemove = dir === -1 ? last : first;
        this.outsideWorldScene.remove(this.outsideWorldScene.getObjectByName(`landscape_${toRemove}`));
        
        this.currentPos += this.landscapeSize * dir;
    }
	initDream(){
        const dreamData = this.dreamsData[this.currentDream];
		const dream = new Dream(this.currentPos, dreamData);

        //this.outsideWorldScene.add(dream.scene.outsidePart);
        this.outsideParts.push(dream.scene.outsidePart);
		this.portalScenes.push(dream.scene.portal);
        this.dreamScenes.push(dream.scene.insidePart);
	}
	/**
	 * @param {Number} dir - direction 
	 */
	loadNextDream(dir){
		this.lastDream = this.currentDream;
		this.currentDream += dir;
        const dreamData = this.dreamsData[this.currentDream];
		const dream = new Dream(this.currentPos, dreamData);
        //this.outsideWorldScene.add(dream.scene.outsidePart);
        //this.outsideParts.push(dream.scene.outsidePart);
		this.portalScenes.push(dream.scene.portal);
        this.dreamScenes.push(dream.scene.insidePart);
	}
	/**
	 * 
	 * @param {Number} dir - direction (-1, 1)
	 * @returns {Boolean} 
	 */
	canMoveTo(dir) {
		if(dir === -1 && this.currentDream <= this.dreams.min) {
			return false;
		} else if(dir === 1 && this.currentDream + 1 >= this.dreams.max) {
			return false;
		}
		return true;
	}
    /**
     * 🚧 Work in progress
     * @returns {[THREE.Mesh]}
     */
    get getOutsideParts() {
        return this.outsideParts;
    }
}