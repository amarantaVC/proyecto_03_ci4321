import * as THREE from 'three';
import Canon from './Canon';

class Torreta {
  constructor() {
    this.torreta = new THREE.Group();

    const esferaGeometry = new THREE.SphereGeometry(1.3, 32, 32);
    const esferMaterial = new THREE.MeshBasicMaterial({ color: 0x800000 });
    const esfera = new THREE.Mesh(esferaGeometry, esferMaterial);
    
    // Posición del torreta en el centro y sobre el vehículo
    this.torreta.add(esfera);
    
    // Crear y agregar el cañón a la torreta
    const canon = new Canon().getCanon();
    canon.position.set(0, 0.75, 1.5); // Posicionar el cañon en el centro superior de la torreta
    this.torreta.add(canon);
    this.torreta.position.set(0, 1.75, 0);
  }

  getTorreta() {
    return this.torreta;
  }
}

export default Torreta;
