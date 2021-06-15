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
/**
 * @param {[Number]} color 
 * @returns {String}
 */
export function rgbToHex(color) {
    return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
}
/**
 * @param {Number} c 
 * @returns {String}
 */
export function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
/**
 * @param {String | Number} filler 
 * @param {[String | Number]} array 
 * @param {Number} size 
 * @returns {[String | Number]}
 */
export function fillArrayWith(filler, array, size) {
    const tempArray = [...array];
    const nb = size - array.length;
    for (let i = 0; i < nb; i++) {
        tempArray.push(filler);
    }
    return tempArray;
}
/**
 * 
 * @param {Number} value 
 * @param {Number} in_min 
 * @param {Number} in_max 
 * @param {Number} out_min 
 * @param {Number} out_max 
 * @returns {Number}
 */
export function map(value, in_min, in_max, out_min, out_max) {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
/**
 * @param {[String | Number]} array 
 * @returns {String | Number}
 */
export function randomValueInArray(array) {
    return array[Math.floor(Math.random() * array.length)];
};