import * as THREE from 'three';

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

function showTitle(scene, text, font, position, seconds = 3000) {
    const titleGeometry = new TextGeometry(text, {
        font: font,
        size: 0.15,
        height: 0.001,
    });

    titleGeometry.computeBoundingBox();
    const titleWidth = titleGeometry.boundingBox.max.x - titleGeometry.boundingBox.min.x;

    const titleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x800080,
        opacity: 1,
        transparent: true,
        side: THREE.DoubleSide
    });

    const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
    titleMesh.rotation.y = Math.PI;
    titleMesh.position.set(titleWidth / 2, 5.9, position.z);

    scene.add(titleMesh);

    setTimeout(() => {
        scene.remove(titleMesh);
    }, seconds);
};

export default showTitle;