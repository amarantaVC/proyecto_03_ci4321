import * as THREE from 'three';

class Canon {
    constructor() {
        // Crear un grupo para el cañón que permita rotarlo desde su base
        this.canonGroup = new THREE.Group();

        // Canon del tanque (un cilindro)
        const canonGeometry  = new THREE.CylinderGeometry(0.2, 0.35, 4, 32);
        const canonMaterial  = new THREE.MeshBasicMaterial({ color: 0x600080 });
        this.canon  = new THREE.Mesh(canonGeometry, canonMaterial);
        
        // Ajustar rotación del cañón para que apunte hacia adelante
        this.canon.rotation.z = Math.PI / 2;
        this.canon.rotation.y = Math.PI / 2;

        // Posicionar el cañón para que esté en el centro de la esfera
        this.canon.position.set(0, 0, 1.75);
        
        // Agregar el cañón al grupo
        this.canonGroup.add(this.canon);
    }
    
    getCanon() {
        return this.canonGroup;
    }

    rotateUp(rotationSpeed) {
        this.canonGroup.rotation.x -= rotationSpeed;
    }

    rotateDown(rotationSpeed) {
        this.canonGroup.rotation.x += rotationSpeed;
    }
}   

export default Canon;