import * as THREE from 'three';
import Canon from './Canon';

class Torreta {
  constructor() {
    this.torreta = new THREE.Group();

    // Crear la esfera con material de normales
    const esferaGeometry = new THREE.SphereGeometry(1.3, 32, 32); // Radio, segmentos horizontales, segmentos verticales
    const esferaMaterial = new THREE.MeshNormalMaterial(); // Material de normales (para visualizar las normales)
    const esfera = new THREE.Mesh(esferaGeometry, esferaMaterial);
    esfera.castShadow = true;  // Permitir que la esfera proyecte sombras
      

    // Añadir la esfera a la torreta
    this.torreta.add(esfera);

    // Crear y agregar el cañón a la torreta
    const canon = new Canon().getCanon();
    canon.position.set(1.5, 0.75, 0.2);
    this.torreta.add(canon);

    // Posicionar la torreta
    this.torreta.position.set(0, 1.75, 0);

    console.log('Torreta creada:', this.torreta);
  }

  getTorreta() {
    console.log('getTorreta llamado, devolviendo:', this.torreta);
    return this.torreta;
  }
}

export default Torreta;
