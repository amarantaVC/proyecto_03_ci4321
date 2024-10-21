import * as THREE from 'three';
import Canon from './Canon';

class Torreta {
  constructor() {
    this.torreta = new THREE.Group();

    // Crear la esfera con material de normales
    const esferaGeometry = new THREE.SphereGeometry(1.3, 32, 32); // Radio, segmentos horizontales, segmentos verticales
    const esferaMaterial = new THREE.MeshNormalMaterial(); // Material de normales (para visualizar las normales)
    const esfera = new THREE.Mesh(esferaGeometry, esferaMaterial);

    // Añadir la esfera a la torreta
    this.torreta.add(esfera);

    // Crear y agregar el cañón a la torreta
    this.canon = new Canon();
    const canonGroup = this.canon.getCanon();

    // Posicionar el grupo del cañón
    canonGroup.position.set(0, 0.75, 0);
     
    this.torreta.add(canonGroup);

    // Posición general de la torreta

    this.torreta.position.set(0, 1.75, 0);

    console.log('Torreta creada:', this.torreta);
  }

  getTorreta() {
    console.log('getTorreta llamado, devolviendo:', this.torreta);
    return this.torreta;
  }

  rotateLeft(rotationSpeed) {
    this.torreta.rotation.y += rotationSpeed;
  }

  rotateRight(rotationSpeed) {
    this.torreta.rotation.y -= rotationSpeed;
  }

  rotateCanonUp(rotationSpeed) {
    this.canon.rotateUp(rotationSpeed);
  }
  
  rotateCanonDown(rotationSpeed) {
    this.canon.rotateDown(rotationSpeed);
  }
}

export default Torreta;
