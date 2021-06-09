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
    get canInteract() {
        return this.enableInteraction; 
    }
}