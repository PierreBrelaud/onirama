import * as THREE from 'three';

export function drawPoint(x, y, z) {
    const vertices = [x, y, z];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
    );
    const material = new THREE.PointsMaterial({ size: 0.4, color: 0xff0000 });

    const point = new THREE.Points(geometry, material);

    return point;
}