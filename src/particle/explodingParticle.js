import * as THREE from 'three';

class ExplodingParticle {
    constructor(scene, geometry, material, position) {

        if (!scene) {
            console.error('La escena es undefined o null');
            return; // Evita continuar si hay un error
        }

        this.scene = scene;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.scale.set(Math.random() * 0.5 + 0.1, Math.random() * 0.5 + 0.1, Math.random() * 0.5 + 0.1); // Tamaño inicial
        this.scene.add(this.mesh);
        
        // Inicializa velocidad aleatoria para la explosión
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
        );
        
        this.lifespan = Math.random() * 2 + 1; // Duración aleatoria
    }

    update(deltaTime) {
        // Aplicar gravedad (puedes ajustar el valor)
        const gravity = new THREE.Vector3(0, -9.81, 0); // Gravedad hacia abajo
        this.velocity.add(gravity.clone().multiplyScalar(deltaTime)); // Aumentar la velocidad con gravedad

        // Actualiza posición según la velocidad
        this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        this.lifespan -= deltaTime;
    }

    isAlive() {
        return this.lifespan > 0;
    }
}

export default ExplodingParticle;