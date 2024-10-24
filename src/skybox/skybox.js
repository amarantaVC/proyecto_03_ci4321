// Skybox.js
import * as THREE from 'three';

class Skybox {
  constructor(scene, texturePath) {
    this.scene = scene;
    this.texturePath = texturePath;
    this.skybox = this.createSkybox();
  }

  createSkybox() {
    const textureLoader = new THREE.TextureLoader();
    const skyTexture = textureLoader.load(this.texturePath);

    const skyboxGeometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
      // Cara frontal
      -500, -500,  500,  500, -500,  500,  500,  500,  500,
       500,  500,  500, -500,  500,  500, -500, -500,  500,

      // Cara trasera
      -500, -500, -500, -500,  500, -500,  500,  500, -500,
       500,  500, -500,  500, -500, -500, -500, -500, -500,

      // Cara superior
      -500,  500, -500, -500,  500,  500,  500,  500,  500,
       500,  500,  500,  500,  500, -500, -500,  500, -500,

      // Cara inferior
      -500, -500, -500,  500, -500, -500,  500, -500,  500,
       500, -500,  500, -500, -500,  500, -500, -500, -500,

      // Cara derecha
       500, -500, -500,  500,  500, -500,  500,  500,  500,
       500,  500,  500,  500, -500,  500,  500, -500, -500,

      // Cara izquierda
      -500, -500, -500, -500, -500,  500, -500,  500,  500,
      -500,  500,  500, -500,  500, -500, -500, -500, -500
    ]);

    const uvs = new Float32Array([
      // Frontal
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      1.0, 1.0, 0.0, 1.0, 0.0, 0.0,

      // Trasera
      0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 0.0, 0.0, 0.0,

      // Superior
      0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 0.0, 0.0, 0.0,

      // Inferior
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      1.0, 1.0, 0.0, 1.0, 0.0, 0.0,

      // Derecha
      0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 0.0, 0.0, 0.0,

      // Izquierda
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      1.0, 1.0, 0.0, 1.0, 0.0, 0.0
    ]);

    skyboxGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    skyboxGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const skyboxMaterial = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide // Renderizar la parte interna del cubo
    });

    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    this.scene.add(skybox);

    return skybox;
  }
}

export default Skybox;
