import * as THREE from 'three';

class Obstacle {
  constructor(type) {
    this.obstacle = new THREE.Group();

    if (type === 'cube') {
      this.createCube();
    } else if (type === 'sphere') {
      this.createSphere();
    }
  }

  createCube() {
    const geometry = new THREE.BoxBufferGeometry(5, 5, 5); // Cubo de 5x5x5
    const textureLoader = new THREE.TextureLoader();
    
    // Cargar la textura (asegúrate de que la ruta sea correcta)
    const texture = textureLoader.load('../../src/assets/image.png', (texture) => {
      // Cuando la textura se ha cargado, puedes hacer algo aquí si es necesario
      console.log('Textura cargada:', texture);
    }, undefined, (error) => {
      console.error('Error al cargar la textura:', error);
    });

    const material = new THREE.MeshStandardMaterial({ map: texture }); // Aplicar la textura
    const cube = new THREE.Mesh(geometry, material);
    this.obstacle.add(cube);
  }

  createSphere() {
    
    const geometry = new THREE.SphereBufferGeometry(2, 25, 0.5); // Esfera de radio 0.5
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../../src/assets/sky.png'); // Cargar la textura
    const material = new THREE.MeshStandardMaterial({ map: texture }); // Aplicar la textura
    const sphere = new THREE.Mesh(geometry, material);
    this.obstacle.add(sphere);
  }

  getObstacle() {
    return this.obstacle;
  }
}

export default Obstacle;
