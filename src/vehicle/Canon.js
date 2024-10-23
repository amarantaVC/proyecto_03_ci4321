import * as THREE from 'three';
import Projectile from '../projectile/Projectile';

class Canon {
    constructor(scene) {
        this.scene = scene;

        // Crear un grupo para el cañón que permita rotarlo desde su base
        this.canonGroup = new THREE.Group();

        // Canon del tanque (un cilindro)
        const canonGeometry  = new THREE.CylinderGeometry(0.2, 0.35, 4, 32);
        const canonMaterial  = new THREE.MeshBasicMaterial({ color: 0x600080 });
        this.canon  = new THREE.Mesh(canonGeometry, canonMaterial);
        
        // Ajustar rotación del cañón para que apunte hacia adelante
        this.canon.rotation.z = Math.PI / 2;
        this.canon.rotation.y = Math.PI / 2;

        // Posicionar el cañón en el grupo
        this.canon.position.set(0, 0, 1.75);
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

    getCanonQuaternion() {
        return this.canon.quaternion.clone();
    }

    // Obtener la posicion de la punta del cañón
    getCanonPosition() {
        const position = new THREE.Vector3();
        this.canon.getWorldPosition(position);
        return position;
    }

    fireProjectile() {
        // Crear un proyectil
        console.log('Cañón dispara');

        const startPosition = this.getCanonPosition();

        // Calcular la dirección en la que el cañón está mirando
        const direction = new THREE.Vector3();
        this.canonGroup.getWorldDirection(direction);

        direction.multiplyScalar(1); // Invertir la dirección para que salga hacia adelante

        // Crear un nuevo proyectil
        const projectile = new Projectile(this.scene);
        projectile.fireProjectile(startPosition, direction);
    }
}   

export default Canon;