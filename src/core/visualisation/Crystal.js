import * as THREE from 'three';

export default class Crystal {
    constructor(params){
        this.params = params ? params : this.getDefaultParams();
    }
    getDefaultParams() {
        return {
            nbFace: 8,
            topSpikeHeight: 0.2,
            bottomSpikeHeight: -0.2,
            angleTop: 90,
            angleLittleTop: 90,
            angleBottom: 90,
            angleLittleBottom: 90,
            crystalHeight: 0.4,
            crystalWidth: 0.1,
            spikeWidth: 0.02,
            color: '#FFCCCC',
            emissive: '#FF0000',
            opacity: 0.8,
        }
    }
    createCrystal() {
        const guidelines = this.getGuidelines();

        const bottom1Vert = this.getVertices(guidelines.bottom1);
        const bottom2Vert = this.getVertices(guidelines.bottom2);
        const top1Vert = this.getVertices(guidelines.top1);
        const top2Vert = this.getVertices(guidelines.top2);

        const vertices = [];
        // MIDDLE PART
        this.createPart(vertices, bottom1Vert, top1Vert);
        // BOTTOM PART
        this.createPart(vertices, bottom2Vert, bottom1Vert);
        // TOP PART
        this.createPart(vertices, top1Vert, top2Vert);
        // TOP & BOTTOM SPIKE
        this.createFlatPart(vertices, bottom2Vert, top2Vert);
        
        const crystalGeo = new THREE.BufferGeometry();
        crystalGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(vertices), 3),
        );
        crystalGeo.computeVertexNormals();
        

        let crystalMat = new THREE.MeshStandardMaterial({
            color: this.params.color,
            emissive: this.params.emissive,
            roughness: 0.5, 
            metalness: 0.5,
            side: THREE.DoubleSide, 
            transparent: true,
            opacity: this.params.opacity,
        })
        //crystalMat = new THREE.MeshNormalMaterial();

        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.name = "crystal";
        crystal.position.y = - this.params.crystalHeight/2;
        crystal.rotation.y = Math.PI / 2;
        crystal.castShadow = true;
        
        const edgeGeo = new THREE.EdgesGeometry( crystal.geometry );
        const edgeMat = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.6, transparent: true } );
        const edgeWireframe = new THREE.LineSegments( edgeGeo, edgeMat );
        crystal.add(edgeWireframe);

        return crystal;
    }
    createGuideline(width, angle, height = 0) {
        const geometry = new THREE.CircleGeometry(width, this.params.nbFace);
        const material = new THREE.MeshBasicMaterial({visible: false});
        const guideline = new THREE.Mesh(geometry, material);
        guideline.rotation.set(
            angle * Math.PI / 180,
            0,
            Math.PI / 2
        );
        guideline.position.y = height;
        guideline.updateMatrix();
    }
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
    createGuideline(width, angle, height = 0) {
        const geometry = new THREE.CircleGeometry(width, this.params.nbFace);
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
    createPart(vertices, bottom, top) {
        for (let i = 1; i <= this.params.nbFace; i++) {
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
    createFlatPart(vertices, bottom, top) {
        for (let i = 1; i <= this.params.nbFace; i++) {
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
    initGui(gui) {
        const evt = new Event("crystalChanged");
        const crystalFolder = gui.addFolder("Crystal")
        const generalFolder = crystalFolder.addFolder("General")
        generalFolder.add(this.params, 'nbFace', 3, 18, 1)
        .name('Faces')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        generalFolder.add(this.params, 'crystalHeight', 0.01, 4, 0.01)
        .name('Height')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        generalFolder.add(this.params, 'crystalWidth', 0.01, 1.5, 0.01)
        .name('Width')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        generalFolder.addColor(this.params, 'color')
        .name('Color')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        generalFolder.addColor(this.params, 'emissive')
        .name('Emissive')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        generalFolder.add(this.params, 'opacity', 0., 1., 0.01)
        .name('Opacity')
        .onChange(() => {
            document.dispatchEvent(evt);
        });

        const spikeFolder = crystalFolder.addFolder("Spike");
        spikeFolder.add(this.params, 'spikeWidth', 0., 0.8, 0.01)
        .name('Width')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        spikeFolder.add(this.params, 'topSpikeHeight', 0.01, 1.5, 0.01)
        .name('Top height')
        .onChange(() => {
            document.dispatchEvent(evt);
        });
        spikeFolder.add(this.params, 'bottomSpikeHeight', -1.5, -0.01, -0.01)
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