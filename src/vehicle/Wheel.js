import * as THREE from 'three';

class Wheel {
  constructor(x, y, z) {
    const ruedaGeometry = new THREE.CylinderGeometry(0.6, 0.6, 4, 32);
    const ruedaMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });

    this.rueda = new THREE.Mesh(ruedaGeometry, ruedaMaterial);
    
    // Rotar la rueda para que esté en la posición correcta (cilindros se crean verticales)
    this.rueda.rotation.z = Math.PI / 2;

    // Posición del torreta en el centro y sobre el vehículo
    this.rueda.position.set(0, 0.75, 0);

    // Colocar la rueda en la posición dada
    this.rueda.position.set(x, y, z);

  }

  getWheel() {
    return this.rueda;
  }
}

export default Wheel;
