import * as THREE from 'three';
import Torreta from './Torreta';
import Wheel from './Wheel';

class Vehicle {
  constructor() {
    this.vehicle = new THREE.Group();

    // Crear la geometría del cuerpo del tanque usando BufferGeometry
    const cuerpoGeometry = new THREE.BufferGeometry();

    // Definir los vértices de la caja (8 vértices para una caja)
    const vertices = new Float32Array([
      -3, -0.75, -1.5,  // Vértice 0
       3, -0.75, -1.5,  // Vértice 1
       3,  0.75, -1.5,  // Vértice 2
      -3,  0.75, -1.5,  // Vértice 3
      -3, -0.75,  1.5,  // Vértice 4
       3, -0.75,  1.5,  // Vértice 5
       3,  0.75,  1.5,  // Vértice 6
      -3,  0.75,  1.5   // Vértice 7
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
    const ruedas = [];
    const numRuedas = 4;
    
    // Añadir cada rueda al vehículo
    for (let i = 0; i < numRuedas; i++) {
      const xPos = -2.25 + (i * 1.5);  // Distribuir las ruedas a lo largo del eje X (eje longitudinal del tanque)

      // Agregar una rueda en el lado derecho
      const rueda = new Wheel(xPos, 0.5, 0).getWheel();  // Rueda derecha (cerca de la cámara)
      rueda.rotation.y = Math.PI / 2;  // Rotar la rueda para que esté alineada correctamente
      
      ruedas.push(rueda);
    }

    // Añadir cada rueda al vehículo
    ruedas.forEach(rueda => this.vehicle.add(rueda));

    // Crear y agregar la torreta al vehículo
    const torreta = new Torreta();
    this.vehicle.add(torreta.getTorreta());
    
    this.vehicle.position.set(0, 1.5, 0);
    
    //this.vehicle.rotation.z = Math.PI / 2;

  }

  getVehicle() {
    return this.vehicle;
  }

  moveForward(speed) {
    this.vehicle.position.z -= speed;
  }

  moveBackward(speed) {
    this.vehicle.position.z += speed;
  }

  rotateLeft(rotationSpeed) {
    this.vehicle.rotation.y += rotationSpeed;
  }

  rotateRight(rotationSpeed) {
    this.vehicle.rotation.y -= rotationSpeed;
  }
  
}

export default Vehicle;
