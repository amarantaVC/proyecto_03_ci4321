import * as THREE from 'three';
//import { Return } from 'three/webgpu';


class Projectile {
    constructor(scene) {
        this.scene = scene;

        const projectilGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const projectilMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.projectile = new THREE.Mesh(projectilGeometry, projectilMaterial);
        
        // Velocidad del proyectil
        this.speed = 0.5;
        this.direction = new THREE.Vector3();

        this.scene.add(this.projectile); 
        this.projectile.visible = false; // Inicialmente invisible
    
    }

    getProjectile() {
        return this.projectile;
    }

    fireProjectile(startPosition, direction) {
        this.projectile.position.copy(startPosition); // Establecer la posición inicial
        this.direction.copy(direction).normalize(); // Establecer la dirección y normalizarla
        this.projectile.visible = true; // Hacerlo visible
        this.moveRectilinea();  // Comienza a mover el proyectil
    }

    moveRectilinea() {
        const move = () => {
            this.projectile.position.add(this.direction.clone().multiplyScalar(this.speed)); // Mueve el proyectil
            requestAnimationFrame(move);
        };
        move();
    }
}

export default Projectile; 
