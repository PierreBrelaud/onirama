import gsap from "gsap";
import * as THREE from 'three';
import { OrbitControls } from "@three-ts/orbit-controls";

export default class CameraController {
    /**
     * @param {THREE.PerspectiveCamera} camera 
     * @param {OrbitControls} controls 
     */
    constructor(camera, controls){
        this.camera = camera;
        this.controls = controls;
        this.enableInteraction = true;
    }
    /**
     * @param {Number} dir 
     * @param {Function} callback 
     */
    moveToDirection(dir, callback){
        const step = 9.37;
        gsap.to(this.camera.position, {
            duration: 1.5,
            x: `+=${step * dir}`,
        })
        gsap.to(this.controls.target, {
            duration: 1.5,
            x: `+=${step * dir}`,
            onStart: () => {this.enableInteraction = false},
            onComplete: () => {
                this.enableInteraction = true;
                callback();
            },
        })
    }
    /**
     * @param {Function} callback 
     */
    zoomIn(callback){
        gsap.to(this.camera.position, {
            y: 0,
            z: 1.7,
            onComplete: () => {
                callback();
            }
        })
    }
    /**
     * @param {Function} callback 
     */
    zoomOut(callback){
        gsap.to(this.camera.position, {
            y: 0.1,
            z: 5,
            onComplete: () => {
                callback();
            }
        })
    }
    /**
     * @returns {Boolean}
     */
    get canInteract() {
        return this.enableInteraction; 
    }
}