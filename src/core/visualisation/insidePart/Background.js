import * as THREE from 'three';
import vertexShader from '@/assets/shaders/fbm/vertex.glsl';
import fragmentShader from '@/assets/shaders/fbm/fragment.glsl'; 
import { PointLight } from 'three';

export default class Background {
    /**
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} posX 
     * @param {Object} params 
     * @constructor
     */
    constructor(width = 1.0, height = 1.0, posX, params){
        this.width = width;
        this.height = height;
        this.posX = posX
        this.params = params ? params : this.getDefaultParams();
    }
    getDefaultParams() {
        return {
            color1: [248, 186, 43],
            color2: [255, 238, 0],
            color3: [246, 150, 37],
            cl1Prop: 0.35,
            cl2Prop: 0.4,
            cl3Prop: 0.9,
            zoom: this.width * 3,
            speed: 1.,
        }
    }
    /**
     * @param {[String]} colors - size can range from 0 to 3 elements
     */
    createBackground(rgbColors) {
        const background = new THREE.Group();

        const geometry = new THREE.PlaneGeometry(
            this.width,
            this.height,
            32,
            32
        );
        this.material = new THREE.RawShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: {value: 0},
                uResolution: {
                    value: new THREE.Vector2(
                        this.width, 
                        this.height
                    )
                },
                uColor1: {value: rgbColors[0]},
                uColor2: {value: rgbColors[1]},
                uColor3: {value: rgbColors[2]},
                uZoom: {value: this.params.zoom},
                uSpeed: {value: this.params.speed},
                uPosX: {value: this.posX}
            }
        })
        const bgMesh = new THREE.Mesh(geometry, this.material);
        bgMesh.name = "background";
        background.add(bgMesh);

        return background;
    }
    /**
     * @param {Object} gui 
     */
    initGui(gui) {
        const bgFolder = gui.addFolder("Background");
        bgFolder.addColor(this.material.uniforms.uColor1, 'value').name('Color1');
        bgFolder.addColor(this.material.uniforms.uColor2, 'value').name('Color2');
        bgFolder.addColor(this.material.uniforms.uColor3, 'value').name('Color3');
        bgFolder.add(this.material.uniforms.uZoom, 'value', 0.5, 10., 0.01).name('zoom');
        bgFolder.add(this.material.uniforms.uSpeed, 'value', 0.1, 10., 0.001).name('speed');
    }
}