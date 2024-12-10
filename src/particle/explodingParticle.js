import * as THREE from 'three';

class ExplodingParticle {
    constructor(scene, position) {
        this.scene = scene;
        this.position = position;
        this.particleCount = 1000; // Número de partículas
        this.particles = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.particleCount * 3);
        this.velocities = new Float32Array(this.particleCount * 3);
        this.sizes = new Float32Array(this.particleCount);

        // Color ladrillo con destellos rosas
        const baseColor = new THREE.Color(0xB22222); // Color ladrillo
        const sparkleColor = new THREE.Color(0xFF69B4); // Color rosa (HotPink)

        this.material = new THREE.PointsMaterial({
            size: 1,
            transparent: true,
            opacity: 1,
            depthWrite: false,
            blending: THREE.AdditiveBlending // Para un efecto más brillante
        });

        for (let i = 0; i < this.particleCount; i++) {
            // Posiciones aleatorias alrededor del punto de explosión
            this.positions[i * 3] = position.x + (Math.random() - 0.5) * 2;
            this.positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 2;
            this.positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 2;

            // Velocidades aleatorias para simular explosión
            this.velocities[i * 3] = (Math.random() - 0.5) * 2; // vx
            this.velocities[i * 3 + 1] = (Math.random() - 0.5) * 2; // vy
            this.velocities[i * 3 + 2] = (Math.random() - 0.5) * 2; // vz

            this.sizes[i] = Math.random() * 2 + 1; // Tamaño entre 1 y 3
            
            // Cambiar el color de la partícula aleatoriamente entre ladrillo y rosa
            const colorMixRatio = Math.random(); // Mezcla aleatoria entre los colores
            const mixedColor = baseColor.clone().lerp(sparkleColor, colorMixRatio);
            this.material.color.set(mixedColor); // Establecer el color mezclado
        }

        this.particles.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.particles.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
        
        this.particleSystem = new THREE.Points(this.particles, this.material);
        this.scene.add(this.particleSystem);

        this.lifetime = 2; // Duración en segundos
        this.startTime = Date.now();
    }

    update() {
        const elapsedTime = (Date.now() - this.startTime) / 1000;

        if (elapsedTime < this.lifetime) {
            const positions = this.particleSystem.geometry.attributes.position.array;
            const sizes = this.particleSystem.geometry.attributes.size.array;

            for (let i = 0; i < this.particleCount; i++) {
                // Actualiza posiciones
                positions[i * 3] += this.velocities[i * 3];
                positions[i * 3 + 1] += this.velocities[i * 3 + 1];
                positions[i * 3 + 2] += this.velocities[i * 3 + 2];

                // Disminuye el tamaño y la opacidad con el tiempo
                const lifeRatio = elapsedTime / this.lifetime;
                sizes[i] *= (1 - lifeRatio);
                sizes[i] = Math.max(sizes[i], 0);

                // Cambia la opacidad
                this.material.opacity = Math.max(1 - lifeRatio, 0);
            }

            // Indica que los atributos han cambiado
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
            this.particleSystem.geometry.attributes.size.needsUpdate = true;
        } else {
            this.scene.remove(this.particleSystem);
        }
    }
}

export default ExplodingParticle;