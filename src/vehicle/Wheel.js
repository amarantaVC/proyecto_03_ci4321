import * as THREE from 'three';

class Wheel {
  constructor(x, y, z) {
    this.wheel = new THREE.Group();

    // Crear el cilindro que representa la llanta
    const cauchoGeometry = new THREE.CylinderGeometry(0.6, 0.6, 1, 32);
    const cauchoMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const caucho = new THREE.Mesh(cauchoGeometry, cauchoMaterial);

    this.wheel.add(caucho);

    // Crear el cilindro que representa el rin
    const rinGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.35, 32);
    const rinMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });
    const rin = new THREE.Mesh(rinGeometry, rinMaterial);

    this.wheel.add(rin);

    // Rotar la caucho para que esté en la posición correcta (cilindros se crean verticales)
    this.wheel.rotation.z = Math.PI / 2;

    // Colocar la caucho en la posición dada
    this.wheel.position.set(x, y, z);

  }

  getWheel() {
    return this.wheel;
  }
}

export default Wheel;
