import * as THREE from 'three';

class ExplodingParticle {
    constructor(scene, position, texture) {
        if (!scene) {
            console.error('La escena es undefined o null');
            return;
        }

        this.scene = scene;

        const size = Math.random() * 0.5 + 0.1; // Tamaño aleatorio

        // Usar IcosahedronGeometry para formas más irregulares
        this.geometry = new THREE.IcosahedronGeometry(size, 0);
        
        this.material = new THREE.MeshStandardMaterial({
            map: texture,
            color: 0xff0000,
            transparent: true,
            opacity: 1.0,
            alphaTest: 0.2,
            roughness: 1, 
            metalness: 0, 
            depthWrite: false,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(position);

        // Escalado y rotación aleatoria
        this.mesh.scale.set(
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5
        );

        this.mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        this.scene.add(this.mesh);
        
        const speedFactor = 0.2;

        // Inicializa velocidad aleatoria para la explosión
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * speedFactor,
            (Math.random() - 0.5) * speedFactor,
            (Math.random() - 0.5) * speedFactor
        );
        
        this.lifespan = Math.random() * 2 + 1; // Duración aleatoria
    }

    update(deltaTime) {
        const gravity = new THREE.Vector3(0, -9.81, 0); // Gravedad hacia abajo
        this.velocity.add(gravity.clone().multiplyScalar(deltaTime));

        this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        this.lifespan -= deltaTime;

        if (this.lifespan <= 0) {
            this.scene.remove(this.mesh); // Eliminar la malla cuando muere
        }
    }

    isAlive() {
        return this.lifespan > 0;
    }
}

export default ExplodingParticle;