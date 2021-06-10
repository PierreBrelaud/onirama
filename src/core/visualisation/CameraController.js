import gsap from "gsap";

export default class CameraController {
    constructor(camera, controls){
        this.camera = camera;
        this.controls = controls;
        this.enableInteraction = true;
    }
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
    zoomIn(callback){
        gsap.to(this.camera.position, {
            y: 0,
            z: 1.7,
            onComplete: () => {
                callback();
            }
        })
    }
    zoomOut(callback){
        gsap.to(this.camera.position, {
            y: 0.1,
            z: 5,
            onComplete: () => {
                callback();
            }
        })
    }
    get canInteract() {
        return this.enableInteraction; 
    }
}