import * as THREE from 'three';
import vertexShader from '../../assets/shaders/fbm/vertex.glsl';
import fragmentShader from '../../assets/shaders/fbm/fragment.glsl'; 

export default class Background {
    constructor(width = 1.0, height = 1.0, params){
        this.width = width;
        this.height = height;
        this.params = params ? params : this.getDefaultParams();
    }
    getDefaultParams() {
        return {
            color1: [0, 0, 255],
            color2: [255, 0, 0],
            cl1Prop: 0.,
            cl2Prop: 1.,
            zoom: this.width,
            speed: 1.,
        }
    }
    createBackground() {
        const geometry = new THREE.PlaneGeometry(
            this.width,
            this.height,
            32,
            32
        );
        const material = new THREE.RawShaderMaterial({
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
                uColor1: {value: this.params.color1},
                uColor2: {value: this.params.color2},
                uCl1Prop: {value: this.params.cl1Prop},
                uCl2Prop: {value: this.params.cl2Prop},
                uZoom: {value: this.params.zoom},
                uSpeed: {value: this.params.speed},
            }
        })
        return new THREE.Mesh(geometry, material);
    }
    initGui(gui, material) {
        const bgFolder = gui.addFolder("Background");
        bgFolder.addColor(material.uniforms.uColor1, 'value').name('Color1');
        bgFolder.add(material.uniforms.uCl1Prop, 'value', 0., 1., 0.001).name('Prop color1');
        bgFolder.addColor(material.uniforms.uColor2, 'value').name('Color2');
        bgFolder.add(material.uniforms.uCl2Prop, 'value', 0., 1., 0.001).name('Prop color2');
        bgFolder.add(material.uniforms.uZoom, 'value', 0.5, 10., 0.01).name('zoom');
        bgFolder.add(material.uniforms.uSpeed, 'value', 0.1, 10., 0.001).name('speed');
    }
}