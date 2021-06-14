import * as THREE from 'three';
import { degreeToRad, drawPoint, map } from '@/utils/threejsUtils';
import gsap from 'gsap';

export default class Crystal {
    /**
     * @param {Object} params 
     * @constructor
     */
    constructor(params){
        this.params = params ? params : this.getDefaultParams();
        this.crystalGp = new THREE.Group();
        this.wordCount = {
            category : {
                nbWdPeople: 0,
                nbWdPlace: 0,
                nbWdEmotion: 0,
                nbWdColor: 0,
                nbWdAction: 0,
                nbWdTitle: 0,
            },
            total : 256
        }
    }
    /**
     * @returns {Object}
     */
    getDefaultParams() {
        return {
            nbFace: 8,
            topSpikeHeight: 0.1,
            bottomSpikeHeight: -0.1,
            angleTop: 90,
            angleLittleTop: 90,
            angleBottom: 90,
            angleLittleBottom: 90,
            crystalHeight: 0.1,
            crystalWidth: 0.08,
            spikeWidth: 0.01,
            color: '#FF0000',
            emissive: '#FF0000',
            lineColor: '#FF9999',
            opacity: 0.8,
        }
    }
    /**
     * @returns {THREE.Mesh}
     */
    createCrystal() {
        const guidelines = this.getGuidelines();

        const bottom1Vert = this.getVertices(guidelines.bottom1);
        const bottom2Vert = this.getVertices(guidelines.bottom2);
        const top1Vert = this.getVertices(guidelines.top1);
        const top2Vert = this.getVertices(guidelines.top2);

        const vertices = [];
        const nbFaces = this.getNbFace(this.wordCount);
        // MIDDLE PART
        this.createPart(vertices, bottom1Vert, top1Vert, nbFaces);
        // BOTTOM PART
        this.createPart(vertices, bottom2Vert, bottom1Vert, nbFaces);
        // TOP PART
        this.createPart(vertices, top1Vert, top2Vert, nbFaces);
        // TOP & BOTTOM SPIKE
        this.createFlatPart(vertices, bottom2Vert, top2Vert, nbFaces);

        const crystalGeo = new THREE.BufferGeometry();
        crystalGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(vertices), 3),
        );
        crystalGeo.computeVertexNormals();

        let crystalMat = new THREE.MeshStandardMaterial({
            color: this.params.color,
            emissive: this.params.color,
            emissiveIntensity: 0.4,
            roughness: 0.4, 
            //metalness: 0.5,
            side: THREE.DoubleSide, 
            transparent: true,
            opacity: 0.95,
        })

        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.name = "crystal";
        crystal.position.y = - this.params.crystalHeight/2;
        
        const edgeGeo = new THREE.EdgesGeometry( crystal.geometry );
        const edgeMat = new THREE.LineBasicMaterial( { color: this.params.lineColor, opacity: 0.6, transparent: true } );
        const edgeWireframe = new THREE.LineSegments( edgeGeo, edgeMat );
        crystal.add(edgeWireframe);

        this.crystalGp.add(crystal);
        return this.crystalGp;
    }
    /**
     * @returns {Object}
     */
    getGuidelines() {
        const bottom1 = this.createGuideline(
            this.params.crystalWidth,
            this.params.angleBottom,
        );
        const bottom2 = this.createGuideline(
            this.params.spikeWidth,
            this.params.angleLittleBottom,
            this.params.bottomSpikeHeight,
        );
        const top1 = this.createGuideline(
            this.params.crystalWidth,
            this.params.angleTop,
            this.params.crystalHeight,
        );
        const top2 = this.createGuideline(
            this.params.spikeWidth,
            this.params.angleLittleTop,
            this.params.crystalHeight + this.params.topSpikeHeight,
        );
        return {bottom1, bottom2, top1, top2};
    }
    /**
     * @param {THREE.Mesh} mesh 
     * @returns {[Object]}
     */
    getVertices(mesh) {
        const meshGeo = mesh.geometry.clone();
        meshGeo.applyMatrix4(mesh.matrix);
        const meshPts = meshGeo.attributes.position.array;

        const meshVert = [];

        for (let i = 0; i < meshPts.length; i += 3) {
            const x = meshPts[i];
            const y = meshPts[i + 1];
            const z = meshPts[i + 2];
            meshVert.push({ x, y, z });
        }

        return meshVert;
    }
    /**
     * 
     * @param {Number} width 
     * @param {Number} angle 
     * @param {Number} height 
     * @returns {THREE.Mesh} 
     */
    createGuideline(width, angle, height = 0) {
        // ici je dois mettre la shape
        //const geometry = new THREE.CircleGeometry(width, this.params.nbFace);
        const geometry = this.getCrystalShape(this.wordCount, width);

        const material = new THREE.MeshBasicMaterial({visible: false});
        const guideline = new THREE.Mesh(geometry, material);
        guideline.rotation.set(
            angle * Math.PI / 180,
            0,
            Math.PI / 2
        );
        guideline.position.y = height;
        guideline.updateMatrix();

        return guideline;
    }
    getCrystalShape(wordsCount, size) {
        const finalPts = [];
        const rawPts = []
        const nbFaces = this.getNbFace(wordsCount);

        Object.values(wordsCount.category).forEach(val => {
            if (val <= 0) return; 
            rawPts.push(val)
        });

        const angle = degreeToRad(360 / nbFaces);

        for (let i = 1; i <= nbFaces; i++) {
            let value = map(rawPts[i - 1], 0, wordsCount.total, 0.2, 1);
            //Valeur par défaut si non labelisé
            value = value ? value : 0.1;
            const coord = {
                x: Math.cos(angle * i) * value * 3 * size,
                y: Math.sin(angle * i) * value * 3 * size,
            }
            finalPts.push(coord);
        }

        const crystalShape = new THREE.Shape();

        for (let i = 0; i < finalPts.length; i++) {
            crystalShape.lineTo(finalPts[i].x, finalPts[i].y);
        }
        // close the shape
        crystalShape.lineTo(finalPts[0].x, finalPts[0].y);

        return new THREE.ShapeGeometry(crystalShape);
    }
    getNbFace(wordsCount) {
        const rawPts = [];
        Object.values(wordsCount.category).forEach(val => {
            if (val <= 0) return; 
            rawPts.push(val)
        });
        return rawPts.length < 3 ? 3 : rawPts.length;
    }
    /**
     * @param {[Object]} vertices 
     * @param {[Object]} bottom 
     * @param {[Object]} top 
     */
    createPart(vertices, bottom, top, nbFaces) {
        for (let i = 0; i < nbFaces; i++) {
            vertices.push(
                bottom[i].x, bottom[i].y, bottom[i].z,
                top[i + 1].x, top[i + 1].y, top[i + 1].z,
                bottom[i + 1].x, bottom[i + 1].y, bottom[i + 1].z,

                bottom[i].x, bottom[i].y, bottom[i].z,
                top[i].x, top[i].y, top[i].z,
                top[i + 1].x, top[i + 1].y, top[i + 1].z,
            );
        }
    }
    /**
     * 
     * @param {[Object]} vertices 
     * @param {[Object]} bottom 
     * @param {[Object]} top 
     */
    createFlatPart(vertices, bottom, top, nbFaces) {
        for (let i = 0; i < nbFaces; i++) {
            vertices.push(
                top[i].x, top[i].y, top[i].z,
                top[0].x, top[0].y, top[0].z,
                top[i + 1].x, top[i + 1].y, top[i + 1].z,

                bottom[i].x, bottom[i].y, bottom[i].z,
                bottom[0].x, bottom[0].y, bottom[0].z,
                bottom[i + 1].x, bottom[i + 1].y, bottom[i + 1].z,
            );
        }
    }
    animateCrystal(){
        const tl = gsap.timeline({repeat: -1, repeatDelay: 0});
        tl.to(this.crystalGp.rotation, {
            duration: 15,
            ease:'none',
            y: `${degreeToRad(360)}`
        })
    }
    /**
     * @param {Object} gui 
     */
    initGui(gui) {
        const evt = new Event("crystalChanged");
        const crystalFolder = gui.addFolder("Crystal")
        const generalFolder = crystalFolder.addFolder("General")
        generalFolder.add(this.params, 'nbFace', 3, 18, 1)
        .name('Faces')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        generalFolder.add(this.params, 'crystalHeight', 0.1, 0.45, 0.001)
        .name('Height')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        generalFolder.add(this.params, 'crystalWidth', 0.05, 0.2, 0.001)
        .name('Width')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        generalFolder.addColor(this.params, 'color')
        .name('Color')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        generalFolder.addColor(this.params, 'lineColor')
        .name('Line color')
        .onChange(() => {
            document.dispatchEvent(evt);
        });

        const spikeFolder = crystalFolder.addFolder("Spike");
        spikeFolder.add(this.params, 'spikeWidth', 0., 0.05, 0.001)
        .name('Width')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        spikeFolder.add(this.params, 'topSpikeHeight', 0.06, 0.13, 0.001)
        .name('Top height')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        spikeFolder.add(this.params, 'bottomSpikeHeight', -0.13, -0.06, -0.001)
        .name('Bottom height')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        const tiltFolder = crystalFolder.addFolder("Tilt");
        tiltFolder.add(this.params, 'angleTop', 65, 110, 1)
        .name('Top')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        tiltFolder.add(this.params, 'angleBottom', 65, 110, 1)
        .name('Bottom')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        tiltFolder.add(this.params, 'angleLittleTop', 65, 110, 1)
        .name('Spike top')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        tiltFolder.add(this.params, 'angleLittleBottom', 65, 110, 1)
        .name('Spike bottom')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
    }
}