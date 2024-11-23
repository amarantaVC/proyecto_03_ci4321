import * as THREE from 'three';
import Projectile from '../projectile/Projectile';

class Canon {
    constructor() {
        // = scene;
        
        // Crear un grupo para el cañón que permita rotarlo desde su base
        this.canonGroup = new THREE.Group();

        // Canon del tanque (un cilindro)
        const canonGeometry  = new THREE.CylinderGeometry(0.2, 0.35, 4, 32);
        const canonMaterial  = new THREE.MeshPhongMaterial({ color: 0x600080 });
        this.canon  = new THREE.Mesh(canonGeometry, canonMaterial);
        this.canon.castShadow = true;  // Permitir que el cañón proyecte sombras
        
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
        if ((this.canonGroup.rotation.x - rotationSpeed ) > -3.15) {
            this.canonGroup.rotation.x -= rotationSpeed;
        }
    }

    rotateDown(rotationSpeed) {
        if ((this.canonGroup.rotation.x + rotationSpeed ) < 0) {
            this.canonGroup.rotation.x += rotationSpeed;
        }
    }

    //Metodo para obtener el pitch del cañon en grados
    getPitchInDegrees() {
        return THREE.MathUtils.radToDeg(this.canonGroup.rotation.x); // Convertir a grados el pitch del cañón con rotación en X

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

    getCanonDirection() {
        const direction = new THREE.Vector3();
        this.canonGroup.getWorldDirection(direction);
        return direction;
    }

}   

export default Canon;