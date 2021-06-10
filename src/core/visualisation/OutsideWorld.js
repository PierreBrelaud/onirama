import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';
import Dream from '@/core/visualisation/Dream'

export default class OutsideWorld {
    /**
     * @param {THREE.Scene} outsideWorldScene 
     * @param {[THREE.Scene]} portalScenes 
     * @param {[THREE.Scene]} dreamScenes 
     * @constructor
     */
    constructor(outsideWorldScene, portalScenes, dreamScenes) {
        this.outsideWorldScene = outsideWorldScene;
        this.portalScenes = portalScenes;
        this.dreamScenes = dreamScenes;
        this.landscapeSize = 9.37;

        this.dreams = {
			current: 1,
			min: 0,
			max: 4, 
			data: [
				{text: "dream 0"},
				{text: "dream 1"},
				{text: "dream 2"},
				{text: "dream 3"},
				{text: "dream 4"},
			]
		};
        this.displayedLandscape = [14, 15, 0, 1, 2];
        this.loader = new GLTFLoader().setPath(
            "../../src/assets/models/landscapes/"
        );
        
		this.currentPos = 0;
		
		this.currentDream = this.dreams.current;
		this.lastDream = this.dreams.current;
        
		this.initLandscapes();
		this.initDream();
    }
    initLandscapes() {
        this.displayedLandscape.forEach((id, index) => {
            this.loader.load(`landscape_${id}.gltf`, (gltf) => {
                const posX = this.landscapeSize * (index - 2)
                gltf.scene.position.x = posX;
                gltf.scene.name = `landscape_${id}`;
                // TODO Replace material by a cheapest one

                const pointLight = new THREE.PointLight( 0xffffff, 0.4, 0);
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
            next = first === 0 ? 15 : first - 1;
            this.displayedLandscape.unshift(next)
            this.displayedLandscape.pop();
        } else {
            next = last === 15 ? 0 : last + 1;
            this.displayedLandscape.push(next);
            this.displayedLandscape.shift();
        }

        this.loader.load(`landscape_${next}.gltf`, (gltf) => {
            const posX = dir === -1 ? 
                this.currentPos - this.landscapeSize * 2 :
                this.currentPos + this.landscapeSize * 2;
            gltf.scene.position.x = posX;
            gltf.scene.name = `landscape_${next}`;
            
            const pointLight = new THREE.PointLight( 0xffffff, 0.4, 0);
            pointLight.position.x = posX;
            gltf.scene.children.push(pointLight);

            // TODO Charger un rêve

            this.outsideWorldScene.add(gltf.scene);
        });
        
        const toRemove = dir === -1 ? last : first;
        this.outsideWorldScene.remove(this.outsideWorldScene.getObjectByName(`landscape_${toRemove}`));
        
        this.currentPos += this.landscapeSize * dir;
    }
	initDream(){
		const data = this.dreams.data[this.currentDream];
		const dream = new Dream(this.currentPos, 1);
		this.portalScenes.push(dream.scene.portal);
        this.dreamScenes.push(dream.scene.insidePart);
	}
	/**
	 * @param {Number} dir - direction 
	 */
	loadNextDream(dir){
		this.lastDream = this.currentDream;
		this.currentDream += dir;
		const dream = new Dream(this.currentPos, this.currentDream);
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
		} else if(dir === 1 && this.currentDream >= this.dreams.max) {
			return false;
		}
		return true;
	}
}