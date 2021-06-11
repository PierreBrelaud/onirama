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

 /**
 * @param {String} color 
 * @returns {[Number]}
 */
export function hexaToRgb(color) {
    const aRgbHex = color.match(/.{1,2}/g);
    const aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return aRgb;
}

export function rgbToHex(color) {
    return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
}

export function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function fillArrayWith(filler, array, size) {
    const tempArray = [...array];
    const nb = size - array.length;
    for (let i = 0; i < nb; i++) {
        tempArray.push(filler);
    }
    return tempArray;
}