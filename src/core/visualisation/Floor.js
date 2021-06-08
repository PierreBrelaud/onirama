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
            height: 20,
            cyParams: {
                rdTop: 0.08,
                rdBottom: 0.08,
                height: 2,
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
                const height = this.params.cyParams.height
                tile.position.y = (Math.random() * 0.1) - height / 2;
                tile.name = 'tile';
                y += this.params.cyParams.rdTop * 3 / 2;
                this.floor.add(tile);
            }
            y = 0;
        }
        const width = this.params.width * this.params.cyParams.rdTop;
        this.floor.position.x = -width;
        return this.floor;
    }
    animateFloor() {
        const tilePos = [];
        this.floor.children.forEach(child => {
            tilePos.push(child.position);
        });
        const tl = gsap.timeline({repeat: -1,});
        
        tl.to(tilePos, {
            y: '+=0.1',
            duration: 1.8,
            stagger: {
                grid: [this.params.width,this.params.height],
                from: "random",
                amount: 1,
                ease: 'power2.out'
            }
        });
        tl.to(tilePos, {
            y: '-=0.1',
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