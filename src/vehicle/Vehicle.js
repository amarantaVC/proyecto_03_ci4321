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
    cuerpoGeometry.computeVertexNormals();  // Calcular las normales de los vértices

    // Crear el material y la malla
    const cuerpoMaterial = new THREE.MeshPhongMaterial({ color: 0x800080, side: THREE.DoubleSide });
    const cuerpo = new THREE.Mesh(cuerpoGeometry, cuerpoMaterial);

    cuerpo.castShadow = true;  // Permitir que el cuerpo proyecte sombras
    cuerpo.receiveShadow = true;  // Permitir que el cuerpo reciba sombras

    // Posición inicial del cuerpo
    cuerpo.position.set(0, 1, 0);
    
    // Añadimos el cuerpo al vehículo
    this.vehicle.add(cuerpo);

    // Crear y agregar las ruedas al vehículo
    this.ruedas = [];
    const numRuedas = 4;
    
    // Añadir cada rueda al vehículo
    for (let i = 0; i < numRuedas; i++) {
      const zPos = -2 + (i * 1.35);  // Distribuir las ruedas a lo largo del eje Z

      // Agregar una rueda en el lado derecho
      const ruedaDerecha = new Wheel(1.5, 0, zPos).getWheel();
      ruedaDerecha.initialRotation = ruedaDerecha.rotation.clone(); // Guardar la rotación inicial
      this.ruedas.push(ruedaDerecha);

      // Agregar una rueda en el lado izquierdo
      const ruedaIzquierda = new Wheel(-1.5, 0, zPos).getWheel();
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
    this.rotateWheelsSmooth(Math.PI / 6);
  }

  // Rotar el vehículo hacia la derecha
  rotateRight(rotationSpeed) {
    this.vehicle.rotation.y -= rotationSpeed;
    this.rotateWheelsSmooth(-Math.PI / 6);
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
  
  rotateWheelsOnce(sentido) {
    this.ruedas.forEach(rueda => {
      rueda.rotation.x = rueda.initialRotation.x;
      rueda.rotation.y = sentido;
      rueda.rotation.z = rueda.initialRotation.z;
    });
  }

  rotateWheelsSmooth(sentido, duration = 100) {
    this.ruedas.forEach(rueda => {
      // Guardar las rotaciones iniciales
      const initialRotationX = rueda.initialRotation.x;
      const initialRotationY = rueda.rotation.y;
      const initialRotationZ = rueda.initialRotation.z;
  
      // Definir la rotación final en Y
      const targetRotationY = sentido;
  
      // Calcular el incremento de rotación en cada frame
      const rotationStepY = (targetRotationY - initialRotationY) / (duration / 16);
  
      // Función para animar la rotación suave en Y
      const rotateStep = () => {
    
        rueda.rotation.y += rotationStepY;
  
        if (Math.abs(rueda.rotation.y - targetRotationY) > Math.abs(rotationStepY)) {
          requestAnimationFrame(rotateStep);
        } else {
          rueda.rotation.y = targetRotationY;
        }
  
        rueda.rotation.x = initialRotationX;
        rueda.rotation.z = initialRotationZ;
      };
      rotateStep();
    });
  }

  // Función para resetear la rotación de las ruedas
  alignFrontWheels(duration = 100) { 
    this.ruedas.forEach(rueda => {
    
      const initialRotationY = rueda.rotation.y; 
      const targetRotationY = rueda.initialRotation.y;
  
      // Mantener los ejes X y Z constantes
      const initialRotationX = rueda.initialRotation.x;
      const initialRotationZ = rueda.initialRotation.z;
  
      // Función de interpolación lineal
      const smoothStep = (start, end, t) => start + (end - start) * t;
  
      const startTime = performance.now();
      
      // Función de animación que se ejecutará frame a frame
      const animateRotation = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
  
        // Interpolación suave para el eje Y
        rueda.rotation.y = smoothStep(initialRotationY, targetRotationY, progress);
  
        // Mantener los otros ejes constantes
        rueda.rotation.x = initialRotationX;
        rueda.rotation.z = initialRotationZ;
  
        if (progress < 1) {
          requestAnimationFrame(animateRotation);
        } else {
          rueda.rotation.y = targetRotationY;
        }
      };
      requestAnimationFrame(animateRotation);
    });
  }
  
  fireProjectile() {
    const direction = this.getDirection();
    this.torreta.fireProjectile(direction);
  }
}

export default Vehicle;
