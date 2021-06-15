import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from 'gsap';

import Background from "@/core/visualisation/insidePart/Background";
import Floor from "@/core/visualisation/insidePart/Floor";
import Crystal from "@/core/visualisation/insidePart/Crystal";
import { drawPoint, degreeToRad, hexaToRgb, rgbToHex, fillArrayWith } from '@/utils/threejsUtils';
import {getColorBySubEmotion} from "@/utils/surveyData"


export default class Dream {
    /**
     * @param {Number} position
     * @param {Object} dreamData
     * @constructor
     */
    constructor(position, dreamData){
        this.position = position;
        this.dreamData = dreamData;
        this.insidePartScene = new THREE.Scene();
        this.lights = [];
        this.colors = this.getColors();
        this.scene = this.createDream();
    }
    /**
     * @returns {Object}
     */
    createDream(){
        return {
            outsidePart: this.createOutsidePart(),
            portal: this.createPortal(),
            insidePart: this.createInsidePart(),
        }
    }
    /**
     * @returns {THREE.Group}
     */
    createOutsidePart(){
        const outsidePartGroup = new THREE.Group();
        const type = this.dreamData.type;
        const outsideLoader = new GLTFLoader()
            .setPath('../../src/assets/models/outsidePart/');
        outsideLoader.load(`outsidePart_${type}.gltf`, (gltf) => {
            outsidePartGroup.add(gltf.scene);
        });
        const ptLight = new THREE.PointLight(0xFFFFFF, 1, 1.2, 1);
        outsidePartGroup.add(ptLight);
        /*
        outsidePartGroup.name = "OutsidePart";
        const extPortalMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(0.6, 1.2),
            new THREE.MeshBasicMaterial({color: 0xFFFFFF})
        )
        extPortalMesh.position.set(0, 0, 0.01)
        outsidePartGroup.add(extPortalMesh);*/
        outsidePartGroup.position.set(this.position, 0, 0);
        return outsidePartGroup;
    }
    /**
     * @returns {THREE.Scene}
     */
    createPortal(){
        const portalScene = new THREE.Scene();
        portalScene.name = "portal";

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
        const insidePartGroup = new THREE.Group();
        insidePartGroup.name = "insidePartGroup";

        this.createLight();

        insidePartGroup.add(
            this.createBackground(),
            this.createCrystal(),
        );
        
        // PILLAR LOADING
        const pillarLoader = new GLTFLoader()
            .setPath('../../src/assets/models/pillar/');
        
        const pillarId = this.getPillar();
        pillarLoader.load(`pilier_${pillarId}.gltf`, (gltf) => {
            insidePartGroup.add(this.createFloor(gltf.scene));
        });

        //insidePartGroup.add(drawPoint(0, 0, 0));
        const type = this.dreamData.type ? this.dreamData.type : 1;
        const basementLoader = new GLTFLoader();
        basementLoader.load(`/basement_${type}.gltf`, (gltf) => {
            gltf.scene.position.set(0, -0.8, 1);
            //gltf.scene.position.set(0, 0, 0);
            insidePartGroup.add(gltf.scene);
        });

        insidePartGroup.position.set(this.position, 0, -2);

        this.insidePartScene.add(insidePartGroup);

        const dreamSkybox = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide,
            })
        )
        dreamSkybox.position.x = this.position;
        this.insidePartScene.add(dreamSkybox);

        return this.insidePartScene;
    }
    /**
     * @returns {THREE.Group}
     */
    createBackground(){
        this.background = new Background(20, 20, this.position);
        const bgGp = this.background.createBackground(this.getColorsForBackground());
        bgGp.position.z = -20;
        
        return bgGp;
    }
    /**
     * @param {THREE.Scene} pillarModel
     * @returns {THREE.Group}
     */
    createFloor(pillarModel){
        const floor = new Floor();
        const flGp = floor.createFloor(pillarModel);
        floor.animateFloor();
        flGp.position.z = -0.5
        flGp.position.y = -0.8;
        
        return flGp
    }
    /**
     * @returns {THREE.Group}
     */
    createCrystal(){
        let wordsCount = {};
        if(this.dreamData.labelingData) {
            const category = {}
            Object.entries(this.dreamData.labelingData).forEach(([key, value]) => {
                if(key !== 'total'){
                    category[key] = value
                } else {
                    wordsCount[key] = value
                }
            });
            wordsCount['category'] = category;
        } else {
            wordsCount = {
                category : {
                    nbWdPeople: 5,
                    nbWdPlace: 5,
                    nbWdEmotion: 5,
                    nbWdColor: 5,
                    nbWdAction: 5,
                    nbWdTitle: 5,
                },
                total : {
                    textCount: 100,
                    labelsCount: 30,
                } 
            }
        }

        this.crystal = new Crystal(this.colors, wordsCount);
        const crystalGp = this.crystal.createCrystal();
        crystalGp.name = "crystal";
        this.crystal.animateCrystal();
        crystalGp.position.y = 0.15;
        crystalGp.position.z = 1;
        crystalGp.rotation.z = degreeToRad(20);
        return crystalGp;
    } 
    createLight() {
        const sphere = new THREE.SphereGeometry( 0.01, 16, 8 );

        const lightColors = fillArrayWith('#FFFFFF', this.colors, 3);

        const pivot1 = new THREE.Group();
        pivot1.position.set(this.position, 0.2, -1);
        pivot1.rotation.x = degreeToRad(-30);
        this.insidePartScene.add(pivot1);

        const ptLight1 = new THREE.PointLight(lightColors[0], 0.8, 0.5);
        ptLight1.position.set(0, 0, 0.3);
        ptLight1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: lightColors[0] })));
        const ptH1 = new THREE.PointLightHelper(ptLight1, 0.1);
        pivot1.add(ptLight1);
        //this.insidePartScene.add(ptH1);

        const ptLight2 = new THREE.PointLight(lightColors[1], 0.8, 0.5);
        ptLight2.position.set(0, 0, -0.5);
        ptLight2.add( new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: lightColors[1] })));
        const ptH2 = new THREE.PointLightHelper(ptLight2, 0.1);
        pivot1.add(ptLight2);
        //this.insidePartScene.add(ptH2);

        const pivot2 = new THREE.Group();
        pivot2.position.set(this.position, -0.4, -1);
        this.insidePartScene.add(pivot2)
        const ptLight3 = new THREE.PointLight(lightColors[2], 0.2, 0.8, 1);
        ptLight3.position.set(0, 0, 0.3);
        ptLight3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: lightColors[2] })));
        pivot2.add(ptLight3);
        const ptH3 = new THREE.PointLightHelper(ptLight3, 0.1);
        //this.insidePartScene.add(ptH3);

        this.animateLight(pivot1);
        this.animateLight(pivot2);

        // BACKGROUND LIGHT 
        const ptLight4 = new THREE.PointLight(
            rgbToHex(this.getColorsForBackground()[1]), 
            0.8, 
            1.
        );
        ptLight4.position.set(this.position, -0.4, -2.8);
        this.insidePartScene.add(ptLight4);
        const ptH4 = new THREE.PointLightHelper(ptLight4, 0.1);
        //this.insidePartScene.add(ptH4);
    }
    /**
     * @param {THREE.Group} pivot 
     */
    animateLight(pivot) {
        const tl = gsap.timeline({repeat: -1});
        tl.to(pivot.rotation, {
            duration: 8,
            ease: 'none',
            y: `+=${degreeToRad(360)}`,
        })
    }
    /**
     * 
     * @returns {[String]}
     */
    getColors(){
        let colors = [];
        const emotions = [];
        if(this.dreamData.emotions){
            this.dreamData.emotions.forEach(emotion => {
                if(Object.entries(emotion).length !== 0){
                    emotions.push(emotion);
                }
            })
        }

        if(emotions.length !== 0) {
            emotions.forEach(emotion => {
                colors.push(getColorBySubEmotion(emotion.emotionId, emotion.subEmotionId))
            });
        } else {
            colors = [];
        }

        return colors;
    }
    /**
     * @returns {[[Number]]}
     */
    getColorsForBackground(){
        const noneColor = [0, 255, 33];
        const rgbWhite = [255, 255, 255];
        const rgbBlack = [0, 0, 0]; 
        const rgbGrey = [65, 65, 65];
        
        let rgbColors = [];
        if(this.colors.length === 0) {
            rgbColors = [rgbBlack, rgbWhite, noneColor];
        } else if(this.colors.length === 1) {
            rgbColors = [rgbGrey, hexaToRgb(this.colors[0].slice(1)), noneColor];
        } else if(this.colors.length === 2) {
            rgbColors = [
                hexaToRgb(this.colors[0].slice(1)),
                hexaToRgb(this.colors[1].slice(1)),
                noneColor
            ];
        } else {
            rgbColors = [
                hexaToRgb(this.colors[0].slice(1)),
                hexaToRgb(this.colors[1].slice(1)),
                hexaToRgb(this.colors[2].slice(1))
            ];
        }
        return rgbColors;
    }
    /**
     * @returns {Number} - pillar's id
     */
    getPillar(){
        const lucidity = this.dreamData.lucidity;
        const recurrence = this.dreamData.recurrence;
        if(lucidity && !recurrence){
            return 1;
        }
        if(recurrence && !lucidity){
            return 2;
        }
        if(lucidity && recurrence){
            return 3;
        }
        return 4;
    }
}