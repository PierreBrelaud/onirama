import * as THREE from 'three';
import gsap from 'gsap';

export default class Floor {
    constructor(params){
        this.params = params ? params : this.getDefaultParams();
        this.floor = new THREE.Group();
    }
    getDefaultParams() {
        return {
            width: 20,
            height: 11,
            cyParams: {
                rdTop: 0.5,
                rdBottom: 0.5,
                height: 4,
                rdSeg: 6
            }
        }
    }
    createFloor() {
        const tileGeo = new THREE.CylinderGeometry(
            this.params.cyParams.rdTop,
            this.params.cyParams.rdBottom,
            this.params.cyParams.height,
            this.params.cyParams.rdSeg,
            1
        );
        const tileMat = new THREE.MeshLambertMaterial({
            emissive: 0x444444,
        });

        const radius = this.params.cyParams.rdTop * Math.cos(Math.PI/this.params.cyParams.rdSeg);
        let y = 0;
        for (let i = 0; i < radius * 2 * this.params.width - radius * 2; i += radius * 2) {
            for (let j = 0; j < this.params.height; j++) {
                const tile = new THREE.Mesh(tileGeo, tileMat);
                tile.position.x = j%2 === 0 ? i : i + radius;
                tile.position.z = y;
                tile.position.y = (Math.random() * 0.3) + 0;
                tile.name = 'tile';
                tile.receiveShadow = true;
                y += this.params.cyParams.rdTop * 3 / 2;
                this.floor.add(tile);
            }
            y = 0;
        }

        return this.floor;
    }
    animateFloor() {
        const tilePos = [];
        this.floor.children.forEach(child => {
            tilePos.push(child.position);
        });
        const tl = gsap.timeline({repeat: -1,});
        
        tl.to(tilePos, {
            y: '+=0.5',
            duration: 1.8,
            stagger: {
                grid: [this.params.width,this.params.height],
                from: "random",
                amount: 1,
                ease: 'power2.out'
            }
        });
        tl.to(tilePos, {
            y: '-=0.5',
            duration: 1.8,
            stagger: {
                grid: [this.params.width,this.params.height],
                from: "random",
                amount: 1,
                ease: 'power2.in'
            }
        });
    }
}