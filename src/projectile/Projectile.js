import * as THREE from 'three';

class Projectile {
    constructor(scene) {
        // Establecer campo de visión
        this.xMax = 50;
        this.xMin = -this.xMax;
        this.yMax = 100;
        this.yMin = 0 ;
        this.zMax = 50;
        this.zMin = -this.zMax;
        
        // Crear el proyectil
        this.scene = scene;
        const projectilGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const projectilMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.projectile = new THREE.Mesh(projectilGeometry, projectilMaterial);
        
        // Propiedad del proyectil
        this.baseSpeed = 1.2; // Velocidad base para movimiento 
        this.parabolicSpeed = 60; // Velocidad para movimiento parabólico
        this.gravity = -9.81;
        this.initialHeight = 0; 
        this.vehicleHeight = 2.36;
        
        this.velocity = new THREE.Vector3();

        this.scene.add(this.projectile); 
        this.projectile.visible = false;
    }

    getProjectile() {
        return this.projectile;
    }

    getPosition() {
        return this.projectile.position;
    }

    fireProjectile(startPosition, direction) {

        // Establecer la posición inicial
        this.projectile.position.set(startPosition.x, startPosition.y, startPosition.z);
        this.direction = direction.normalize();

        this.projectile.visible = true; 

        // Verificar si es un disparo rectilíneo o parabólico
        if (this.direction.y > 0) {
            this.velocity.set(
                this.direction.x * this.parabolicSpeed, 
                this.direction.y * this.parabolicSpeed, 
                this.direction.z * this.parabolicSpeed
            );
            this.moveCurvilinea();
        } else {
            this.velocity.set(
                this.direction.x * this.baseSpeed, 
                this.direction.y * this.baseSpeed, 
                this.direction.z * this.baseSpeed
            );
            this.moveRectilinea();
        }
        
        //console.log("Disparar projectile: ", this.direction);  
        
    }

    moveRectilinea() {
        const move = () => {
            
            // Proyectil fuera del campo de visión
            const position = this.getPosition();
            if (position && (position.x > this.xMax || position.x < this.xMin || position.z > this.zMax || position.z < this.zMin)) {
                this.projectile.visible = false;
                //console.log('Proyectil fuera del campo de visión');
                this.scene.remove(this.projectile);
                return;
            }
            
            this.projectile.position.add(this.velocity.clone().multiplyScalar(this.baseSpeed)); // Mueve el proyectil
            //console.log(this.getPosition());
            requestAnimationFrame(move);
              
        };
        move();
    }

    moveCurvilinea() {
        
        let lastTime = performance.now();
        const airResistance = 0.99; // Factor de resistencia del aire

        const move = (currentTime) => {
            // Verificar colisión con el suelo
            if (this.projectile.position.y <= 0 || this.projectile.position.y > this.yMax) {
                this.projectile.visible = false;
                this.scene.remove(this.projectile);
                return;
            }

            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            // Actualizar posición
            this.projectile.position.x += this.velocity.x * deltaTime;
            this.projectile.position.z += this.velocity.z * deltaTime;

            // Aplicar gravedad
            this.velocity.y += this.gravity * deltaTime;

            // Actualizar posición vertical
            this.projectile.position.y += this.velocity.y * deltaTime;

            // Aplicar resistencia del aire
            this.velocity.x *= airResistance;
            this.velocity.y *= airResistance;
            this.velocity.z *= airResistance;

            //console.log(this.getPosition());
            requestAnimationFrame(move); // Continuar el bucle de animación
        };

        requestAnimationFrame(move); // Iniciar el bucle de animación
    }
}

export default Projectile; 
