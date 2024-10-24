import * as THREE from 'three';
import Torreta from './Torreta';
import Wheel from './Wheel';

class Vehicle {
  constructor(scene) {
    this.vehicle = new THREE.Group();

    // Crear la geometría del cuerpo del tanque usando BufferGeometry
    const cuerpoGeometry = new THREE.BufferGeometry();

    // Definir los vértices de la caja (8 vértices para una caja)
    const vertices = new Float32Array([
      -1.5, -0.75, -3,  // Vértice 0
       1.5, -0.75, -3,  // Vértice 1
       1.5,  0.75, -3,  // Vértice 2
      -1.5,  0.75, -3,  // Vértice 3
      -1.5, -0.75,  3,  // Vértice 4
       1.5, -0.75,  3,  // Vértice 5
       1.5,  0.75,  3,  // Vértice 6
      -1.5,  0.75,  3   // Vértice 7
    ]);
    
    // Definir las caras de la caja (12 triángulos, 2 por cada cara)
    const indices = new Uint16Array([
      0, 1, 2,  2, 3, 0,  // Cara frontal
      4, 5, 6,  6, 7, 4,  // Cara trasera
      0, 1, 5,  5, 4, 0,  // Cara inferior
      2, 3, 7,  7, 6, 2,  // Cara superior
      0, 3, 7,  7, 4, 0,  // Cara izquierda
      1, 2, 6,  6, 5, 1   // Cara derecha
    ]);

    // Asignar los vértices y las caras a la geometría
    cuerpoGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    cuerpoGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // Crear el material y la malla
    const cuerpoMaterial = new THREE.MeshBasicMaterial({ color: 0x800080 });
    const cuerpo = new THREE.Mesh(cuerpoGeometry, cuerpoMaterial);

    cuerpo.castShadow = true;  // Permitir que el cuerpo proyecte sombras


    
    // Posición inicial del cuerpo
    cuerpo.position.set(0, 1, 0);
    
    // Añadimos el cuerpo al vehículo
    this.vehicle.add(cuerpo);

    // Crear y agregar las ruedas al vehículo
    this.ruedas = [];
    const numRuedas = 4;
    
    // Añadir cada rueda al vehículo
    for (let i = 0; i < numRuedas; i++) {
      const zPos = -2.25 + (i * 1.5);  // Distribuir las ruedas a lo largo del eje Z

      // Agregar una rueda en el lado derecho
      const ruedaDerecha = new Wheel(1.5, 0.5, zPos).getWheel();
      ruedaDerecha.initialRotation = ruedaDerecha.rotation.clone(); // Guardar la rotación inicial
      this.ruedas.push(ruedaDerecha);

      // Agregar una rueda en el lado izquierdo
      const ruedaIzquierda = new Wheel(-1.5, 0.5, zPos).getWheel();
      ruedaIzquierda.initialRotation = ruedaDerecha.rotation.clone(); // Guardar la rotación inicial
      this.ruedas.push(ruedaIzquierda);
    }

    // Añadir cada par de rueda al vehículo
    this.ruedas.forEach(rueda => this.vehicle.add(rueda)); 

    this.torreta = new Torreta(scene);  // Pasar la escena hacia abajo
    this.vehicle.add(this.torreta.getTorreta());
    
    // Posicionar el vehículo en el origen
    this.vehicle.position.set(0, 1.5, 0);

  }

  getVehicle() {
    return this.vehicle;
  }

  getDirection() {
    const direction = new THREE.Vector3();
    this.vehicle.getWorldDirection(direction);
    return direction;
  } 

  // Mover el vehículo hacia adelante
  moveForward(speed) {
    this.alignFrontWheels();
    const direction = this.getDirection();
    this.vehicle.position.add(direction.multiplyScalar(speed)); // Mover el vehículo en la dirección en la que está mirando
    this.ruedas.forEach(rueda => { rueda.rotation.x += speed * 2; }); // Rotar las ruedas
  }

  // Mover el vehículo hacia atrás
  moveBackward(speed) {
    this.alignFrontWheels();
    const direction = this.getDirection();
    this.vehicle.position.add(direction.multiplyScalar(-speed)); // Mover el vehículo en la dirección opuesta a la que está mirando
    this.ruedas.forEach(rueda => { rueda.rotation.x -= speed * 2; }); // Rotar las ruedas
  }

  // Rotar el vehículo hacia la izquierda
  rotateLeft(rotationSpeed) {
    this.vehicle.rotation.y += rotationSpeed;
    this.rotateWheelsOnce(Math.PI / 5);
  }

  // Rotar el vehículo hacia la derecha
  rotateRight(rotationSpeed) {
    this.vehicle.rotation.y -= rotationSpeed;
    this.rotateWheelsOnce(-Math.PI / 5);
  }

  // Rotar la torreta hacia la izquierda
  rotateTorretaLeft(rotationSpeed) {
    this.torreta.rotateLeft(rotationSpeed);
  }

  // Rotar la torreta hacia la derecha
  rotateTorretaRight(rotationSpeed) {
    this.torreta.rotateRight(rotationSpeed);
  }

  // Rotar el cañón hacia arriba. Eje de rotación: Y
  rotateTorretaUp(rotationSpeed) {
    this.torreta.rotateCanonUp(rotationSpeed);
  }

  // Rotar el cañón hacia abajo. Eje de rotación: Y
  rotateTorretaDown(rotationSpeed) {
    this.torreta.rotateCanonDown(rotationSpeed);
  }
  
  rotateWheelsOnce(direccion) {
    this.ruedas.forEach(rueda => {
      rueda.rotation.y += direccion;  // Aplicar la rotación
    });
    this.wheelsRotated = true;  // Marcar como rotadas
  }

  // Función para resetear la rotación de las ruedas
  alignFrontWheels() {
    this.ruedas.forEach(rueda => {
      rueda.rotation.y = rueda.initialRotation.y;
    });
  }
  
  fireProjectile() {
    const direction = this.getDirection();
    this.torreta.fireProjectile(direction);
  }
}

export default Vehicle;
