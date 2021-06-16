import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class LoaderManager {
    /**
     * @constructor
     */
    constructor() {
        this.manager = new THREE.LoadingManager();
        this.outsideModels = {};
    }
    loadOutsideModels(callback){
        const outsidePath = '/outsideParts/';
        const outsideLoader = new GLTFLoader(this.manager).setPath(outsidePath);
        for (let i = 0; i <= 5; i++) {
            outsideLoader.load(`outsidePart_${i}.gltf`, (gltf) => {
                this.outsideModels[`outsidePart_${i}`] = gltf.scene;
            })
        }
        this.manager.onLoad = function() {
            callback();
        };
    }
    getOutsideModel(type){
        return this.outsideModels[`outsidePart_${type}`];
    }
    
}

export default new LoaderManager();