import * as THREE from 'three';
import Projectile from '../projectile/Projectile.js';

class ObstacleProjectiles {
    constructor(obstacle, projectilesArray, scene) {
        this.obstacle = obstacle;
        this.projectilesArray = projectilesArray;
        this.scene = scene;

        this.startShooting();
    }

    startShooting() {
        setInterval(() => {
            this.shootProjectile();
        }, Math.random() * (3000 - 1000) + 1000); // Dispara cada entre 1s y 3s
    }

    shootProjectile() {
        const startPosition = this.obstacle.position.clone();
        startPosition.y += this.obstacle.geometry.parameters.radius || this.obstacle.geometry.parameters.height / 2;

        const direction = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            -0.5,
            (Math.random() - 0.5) * 2
        ).normalize();

        // Crear el proyectil
        const projectile = new Projectile(this.scene);
        projectile.fireProjectile(startPosition, direction);
        
        this.projectilesArray.push(projectile);
    }
}

export default ObstacleProjectiles;
