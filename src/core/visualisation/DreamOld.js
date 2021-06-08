import * as THREE from 'three';

export default class DreamOld {
    constructor(dreamData, position) {
        this.dreamData = dreamData;
        this.position = position;
    };
    createDream(){
        return {
            outsidePart: this.createDreamOutsidePart(this.dreamData.outsidePart),
            portal: this.createPortal(),
            insidePart: this.createDreamInsidePart(this.dreamData.insidePart),
        }

    };
    createDreamOutsidePart({color}){
        const groundGeo = new THREE.PlaneGeometry(8, 8);
        const groundMat = new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = Math.PI / 2;
        const portalSize = 5;
        ground.position.set(this.position, -portalSize/2, 0)

        const outsideGroup = new THREE.Group();
        //outsideGroup.add(ground);

        return outsideGroup;
    };
    createPortal(){
        const portalScene = new THREE.Scene();

        const portalGeometry = new THREE.PlaneGeometry(3.5, 5);
        const portalMaterial = new THREE.MeshBasicMaterial({
            color: 0x222222,
            colorWrite: true,
            depthWrite: false
        });
        const portal = new THREE.Mesh(portalGeometry, portalMaterial);
        portal.name = "portal";
        portal.position.set(this.position, 0, 0);

        portalScene.add(portal);

        return portalScene;
    };
    createDreamInsidePart({floorData, backgroundData, pedestalData, crystalData }){
        const insidePartScene = new THREE.Scene();

        const insidePartGroup = new THREE.Group();

        const dreamHemLight = new THREE.HemisphereLight(
            0xffffff,
            0x000000,
            0.8
        );
        insidePartScene.add(dreamHemLight);

        const dreamPointLight = new THREE.PointLight(0x0000ff, 0.5, 30);
        dreamPointLight.position.set(this.position, 2, -1.5);
        insidePartScene.add(dreamPointLight);

        insidePartGroup.add(
            this.createFloor(floorData),
            this.createBackground(backgroundData),
            this.createPedestal(pedestalData),
            this.createCrystal(crystalData),
        )

        const portalSize = 5;
        insidePartGroup.position.set(this.position, - portalSize/2, -3);

        insidePartGroup.name = "dream scene";

        insidePartScene.add(insidePartGroup);

        return insidePartScene;
    };
    createFloor({color}){
        const floorGeo = new THREE.PlaneGeometry(10, 10);
        const floorMat = new THREE.MeshStandardMaterial({
            color,
            side: THREE.DoubleSide,
        })
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.name = "floor";
        floor.rotation.x = Math.PI/2;

        return floor;
    };
    createBackground({color}){
        const backgroundGeo = new THREE.PlaneGeometry(10, 10);
        const backgroundMat = new THREE.MeshStandardMaterial({
            color,
            side: THREE.DoubleSide,
        })
        const background = new THREE.Mesh(backgroundGeo, backgroundMat);
        background.name = "background";
        background.position.set(0, 4, -4);

        return background;
    };
    createPedestal({color}){
        const pedestalGeo = new THREE.BoxGeometry(1.5, 2.5, 1.5);
        const pedestalMat = new THREE.MeshStandardMaterial({
            color: color,
        });
        const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
        pedestal.name = "pedestal"
        pedestal.position.set(0, 1.25, 0);

        return pedestal;
    };
    createCrystal({color}){
        const crystalGeo = new THREE.IcosahedronGeometry(0.8);
        const crystalMat = new THREE.MeshStandardMaterial({
            color,
        });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.name ="crystal";
        crystal.position.set(0, 3.5, 0,);

        return crystal;
    };
}
