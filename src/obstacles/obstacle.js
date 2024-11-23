import * as THREE from 'three';

class Obstacle {
  constructor(type) {
    this.obstacle = new THREE.Group();
    this.radius = 6;
    if (type === 'cube') {
      this.createCustomCube();
    } else if (type === 'rectangle') {
      this.createCustomRectangle();
    } else if (type === 'sphere') {
      this.createSphere(); // Esto está permitido solo para ciertos casos.
    }
  }

  createCustomCube() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      // Vértices del cubo
      -2.5, -2.5, -2.5, // 0
       2.5, -2.5, -2.5, // 1
       2.5,  2.5, -2.5, // 2
      -2.5,  2.5, -2.5, // 3
      -2.5, -2.5,  2.5, // 4
       2.5, -2.5,  2.5, // 5
       2.5,  2.5,  2.5, // 6
      -2.5,  2.5,  2.5  // 7
    ]);

    const indices = [
      0, 1, 2, 0, 2, 3, // Cara frontal
      4, 5, 6, 4, 6, 7, // Cara posterior
      0, 1, 5, 0, 5, 4, // Cara inferior
      3, 2, 6, 3, 6, 7, // Cara superior
      0, 3, 7, 0, 7, 4, // Cara izquierda
      1, 2, 6, 1, 6, 5  // Cara derecha
    ];

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();  // Asegúrate de calcular las normales

    // UV mapping para todas las caras del cubo
    const uvs = new Float32Array([
      // UVs para la cara frontal
      0, 0, 
      1, 0, 
      1, 1, 
      0, 1,

      // UVs para la cara posterior
      0, 0, 
      1, 0, 
      1, 1, 
      0, 1,

      // UVs para la cara inferior
      0, 0, 
      1, 0, 
      1, 1, 
      0, 1,

      // UVs para la cara superior
      0, 0, 
      1, 0, 
      1, 1, 
      0, 1,

      // UVs para la cara izquierda
      0, 0, 
      1, 0, 
      1, 1, 
      0, 1,

      // UVs para la cara derecha
      0, 0, 
      1, 0, 
      1, 1, 
      0, 1
    ]);

    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const textureLoader = new THREE.TextureLoader();
    
    // Cargar la textura y solo crear el material cuando la textura esté cargada
    textureLoader.load(
      '../../src/assets/image.png',
      (texture) => {
        // Crear el material una vez que la textura se haya cargado
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.obstacle.add(cube);
      },
      undefined, // En progreso (puedes omitir esto)
      (error) => {
        console.error('Error al cargar la textura:', error);
      }
    );
}


  createCustomRectangle() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      // Vértices del rectángulo
      -5, -2.5, -2.5, // 0
       5, -2.5, -2.5, // 1
       5,  2.5, -2.5, // 2
      -5,  2.5, -2.5, // 3
      -5, -2.5,  2.5, // 4
       5, -2.5,  2.5, // 5
       5,  2.5,  2.5, // 6
      -5,  2.5,  2.5  // 7
    ]);

    const indices = [
      0, 1, 2, 0, 2, 3, // Cara frontal
      4, 5, 6, 4, 6, 7, // Cara posterior
      0, 1, 5, 0, 5, 4, // Cara inferior
      3, 2, 6, 3, 6, 7, // Cara superior
      0, 3, 7, 0, 7, 4, // Cara izquierda
      1, 2, 6, 1, 6, 5  // Cara derecha
    ];

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();  // Asegúrate de calcular las normales

    // UV mapping para todas las caras
    const uvs = new Float32Array([
      // UVs para la cara frontal
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // UVs para la cara posterior
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // UVs para la cara inferior
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // UVs para la cara superior
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // UVs para la cara izquierda
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // UVs para la cara derecha
      0, 0,
      1, 0,
      1, 1,
      0, 1
    ]);

    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../../src/assets/cobblestone_1.png');
    
    // Material que es visible desde ambos lados
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const rectangle = new THREE.Mesh(geometry, material);
    rectangle.castShadow = true;
    rectangle.receiveShadow = true;
    this.obstacle.add(rectangle);
}


  createSphere() {
    const geometry = new THREE.SphereBufferGeometry(3, 25, 25); // Esfera predefinida permitida solo para el tanque
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../../src/assets/sky.png'); // Cargar la textura
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    this.obstacle.add(sphere);
  }

  getObstacle() {
    return this.obstacle;
  }
}

export default Obstacle;