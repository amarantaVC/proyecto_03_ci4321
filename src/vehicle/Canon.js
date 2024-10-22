import * as THREE from 'three';

class Canon {
    constructor() {
        // Canon del tanque (un rectángulo)
        const canonGeometry  = new THREE.CylinderGeometry(0.2, 0.2, 4, 32);
        const canonMaterial  = new THREE.MeshBasicMaterial({ color: 0x600080 });
        this.canon  = new THREE.Mesh(canonGeometry, canonMaterial);
        this.canon.castShadow = true;  // Permitir que el cañón proyecte sombras
        this.canon.receiveShadow = true;  // Permitir que el cañón reciba sombras
        // Ajustar rotación del cañón para que apunte hacia adelante
        this.canon.rotation.z = Math.PI / 2;
        this.canon.rotation.y = Math.PI / 2;

        // Posicionar el cañón para que esté en el centro de la esfera
        this.canon.position.set(0, 0, 1.75);
        
    }
    
    getCanon() {
        return this.canon;
    }
}   

export default Canon;