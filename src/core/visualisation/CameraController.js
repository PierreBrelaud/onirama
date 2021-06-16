import gsap from "gsap";
import * as THREE from 'three';
import { OrbitControls } from "@three-ts/orbit-controls";

import { map } from '@/utils/threejsUtils';

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
    zoomIn(extPortal, callback){
        gsap.to(this.camera.position, {
            y: 0,
            z: 1.2,
            onUpdate: () => {
                extPortal.material.opacity = map(
                    this.camera.position.z,
                    4.7,
                    1.2,
                    1,
                    0
                )
            },
            onComplete: () => {
                callback();
            }
        })
    }
    /**
     * @param {Function} callback 
     */
    zoomOut(extPortal, callback){
        gsap.to(this.camera.position, {
            y: 0.1,
            z: 5,
            onUpdate: () => {
                extPortal.material.opacity = map(
                    this.camera.position.z,
                    1.2,
                    4.7,
                    0,
                    1
                )
            },
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