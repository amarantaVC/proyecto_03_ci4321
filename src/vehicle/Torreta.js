import * as THREE from 'three';
import Canon from './Canon';

class Torreta {
  constructor() {
    //this.scene = scene;

    this.torreta = new THREE.Group();

    // Crear la esfera con material de normales
    const esferaGeometry = new THREE.SphereGeometry(1.3, 32, 32); // Radio, segmentos horizontales, segmentos verticales
    const esferaMaterial = new THREE.MeshNormalMaterial(); // Material de normales (para visualizar las normales)
    const esfera = new THREE.Mesh(esferaGeometry, esferaMaterial);
    esfera.castShadow = true;  // Permitir que la esfera proyecte sombras
      

    // Añadir la esfera a la torreta
    this.torreta.add(esfera);

    // Crear y agregar el cañón a la torreta
    this.canon = new Canon(); // Pasa la escena para poder crear proyectiles
    const canonGroup = this.canon.getCanon();

    // Posicionar el grupo del cañón
    canonGroup.position.set(0, 0.45, 0);
     
    this.torreta.add(canonGroup);

    // Posición general de la torreta
    this.torreta.position.set(0, 1.75, 0);
  }

  getTorreta() {
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
  
  fireProjectile(){
    //console.log('Torreta dispara');
    this.canon.fireProjectile();
  }
}

export default Torreta;
