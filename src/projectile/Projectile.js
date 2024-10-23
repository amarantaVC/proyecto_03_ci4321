import * as THREE from 'three';
//import { Return } from 'three/webgpu';


class Projectile {
    constructor(scene) {
        this.scene = scene;

        // Crear el proyectil
        const projectilGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const projectilMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.projectile = new THREE.Mesh(projectilGeometry, projectilMaterial);
        
        // Propiedad del proyectil
        this.speed = 0.5;
        this.gravity = -9.81;
        this.isCurvilinear = false;

        // Propiedades de movimiento
        this.direction = new THREE.Vector3(); // Dirección de movimiento
        this.velocity = new THREE.Vector3(); // Velocidad del proyectil

        this.scene.add(this.projectile); 
        this.projectile.visible = false; // Inicialmente invisible
    
    }

    getProjectile() {
        return this.projectile;
    }

    fireProjectile(startPosition, direction) {
        this.projectile.position.copy(startPosition); // Establecer la posición inicial
        this.direction.copy(direction).normalize(); // Establecer la dirección y normalizarla
        this.velocity.copy(this.direction).multiplyScalar(this.speed); // Inicializar la velocidad
        this.projectile.visible = true; // Hacerlo visible
        
        if (this.isCurvilinear) {
            this.moveCurvilinea(); // Iniciar movimiento curvilíneo
        } else {
            this.moveRectilinea(); // Iniciar movimiento rectilíneo
        }
    }

    moveRectilinea() {
        const move = () => {
            this.projectile.position.add(this.direction.clone().multiplyScalar(this.speed)); // Mueve el proyectil
            requestAnimationFrame(move);
        };
        move();
    }

    moveCurvilinea() {
        const move = () => {
            // Aplicar gravedad
            this.velocity.y += this.gravity * 0.016; // Ajustar el tiempo según el frame (16ms como ejemplo)
            
            // Actualizar posición
            this.projectile.position.add(this.velocity.clone().multiplyScalar(0.016)); // Multiplica por el tiempo

            // Si el proyectil sale del área visible, ocúltalo
            if (this.projectile.position.y < 0) {
                this.projectile.visible = false;
                return; // Detener movimiento
            }

            requestAnimationFrame(move);
        };
        move();
    }

    setCurvilinearMovement(isCurvilinear) {
        this.isCurvilinear = isCurvilinear; // Establecer el tipo de movimiento
    }
}

export default Projectile; 
