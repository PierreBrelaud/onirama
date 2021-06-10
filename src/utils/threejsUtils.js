import * as THREE from 'three';

/**
 * 
 * @param {Number} x - x coordinate
 * @param {Number} y - y coordinate
 * @param {Number} z - z coordinate
 * @param {} color - color 0xFFFFFF format
 * @returns {THREE.Points}
 */
export function drawPoint(x, y, z, color = 0x0000FF) {
    const vertices = [x, y, z];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
    );
    const material = new THREE.PointsMaterial({ size: 0.4, color });

    const point = new THREE.Points(geometry, material);

    return point;
}

export function degreeToRad(degree) {
    return degree * Math.PI / 180;
}