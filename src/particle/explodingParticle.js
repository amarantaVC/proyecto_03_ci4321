import * as THREE from 'three';

class ExplodingParticle {
    constructor(scene, position, explosionRadius = 5) {
        this.scene = scene;
        this.position = position;
        this.particleCount = 1000;
        this.particles = [];
        this.explosionRadius = explosionRadius;

        const baseColor = new THREE.Color(0xB22222); // Color ladrillo
        const sparkleColor = new THREE.Color(0xFF69B4); // Color rosa

        for (let i = 0; i < this.particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.2, 4, 4);
            const material = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 1,
            });

            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(
                position.x + (Math.random() - 0.5) * this.explosionRadius * 2,
                position.y + (Math.random() - 0.5) * this.explosionRadius * 2,
                position.z + (Math.random() - 0.5) * this.explosionRadius * 2
            );

            // Asigna velocidades aleatorias
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
            );

            const mixedColor = baseColor.clone().lerp(sparkleColor, Math.random());
            particle.material.color.set(mixedColor); // Establecer el color mezclado

            this.particles.push(particle);
            this.scene.add(particle);
        }

        this.lifetime = 2;
        this.startTime = Date.now();
    }

    update() {
        const elapsedTime = (Date.now() - this.startTime) / 1000;

        if (elapsedTime < this.lifetime) {
            for (let i = 0; i < this.particleCount; i++) {
                const particle = this.particles[i];

                // Actualiza posiciones
                particle.position.add(particle.velocity);

                // Disminuye la opacidad con el tiempo
                const lifeRatio = elapsedTime / this.lifetime;
                particle.material.opacity = Math.max(1 - lifeRatio, 0);
                
                particle.scale.set(1, Math.max(1 - lifeRatio, 0), 1);
            }
        } else {
            for (const particle of this.particles) {
                this.scene.remove(particle);
            }
        }
    }
}

export default ExplodingParticle;