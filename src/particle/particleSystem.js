import * as THREE from 'three';

import ExplodingParticle from './explodingParticle.js';

class ParticleSystem {
    constructor(scene, texture) {
        this.scene = scene;
        this.particles = [];
        this.texture = texture; 
    }

    emit(position, radius) {
        for (let i = 0; i < 40; i++) { // Emitir múltiples partículas
            const randomPosition = this.getRandomPositionInSphere(position, radius);
            const particle = new ExplodingParticle(this.scene, randomPosition, this.texture);
            this.particles.push(particle);
        }
    }

    getRandomPositionInSphere(center, radius) {
        const randomVector = new THREE.Vector3(
            (Math.random() - 0.5) * radius * 2,
            (Math.random() - 0.5) * radius * 2,
            (Math.random() - 0.5) * radius * 2
        );

        // Asegúrate de que la posición esté dentro del radio especificado
        if (randomVector.length() > radius) {
            randomVector.setLength(radius); // Normaliza y ajusta al radio
        }

        return center.clone().add(randomVector); // Retorna la nueva posición
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime);
            if (!particle.isAlive()) {
                this.scene.remove(particle.mesh); // Eliminar la malla de la escena
                this.particles.splice(i, 1); // Eliminar partículas muertas
            }
        }
    }
}

export default ParticleSystem;