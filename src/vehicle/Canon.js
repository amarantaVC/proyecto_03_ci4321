import * as THREE from 'three';

class Canon {
    constructor() {
        // Canon del tanque (un rectángulo)
        const canonGeometry  = new THREE.CylinderGeometry(0.2, 0.35, 4, 32);
        const canonMaterial  = new THREE.MeshBasicMaterial({ color: 0x600080 });
        this.canon  = new THREE.Mesh(canonGeometry, canonMaterial);
        
        this.canon.rotation.z = Math.PI / 2; // Rotar el cañón para que apunte hacia adelante
        this.canon.rotation.y = Math.PI / 2;
    }
    
    getCanon() {
        return this.canon;
    }
}   

export default Canon;