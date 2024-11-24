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

  createMaterialWithTextures(texturePath, normalMapPath, roughnessMapPath, aoMapPath, displacementMapPath) {
    const textureLoader = new THREE.TextureLoader();

    // Cargar la textura principal
    const texture = textureLoader.load(texturePath);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    // Cargar el mapa de normales
    const normalMap = textureLoader.load(normalMapPath);
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(1, 1);

    // Cargar el mapa de rugosidad
    const roughnessMap = textureLoader.load(roughnessMapPath);
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.repeat.set(1, 1);

    // Cargar el mapa de oclusión ambiental
    const aoMap = textureLoader.load(aoMapPath);
    aoMap.wrapS = THREE.RepeatWrapping;
    aoMap.wrapT = THREE.RepeatWrapping;
    aoMap.repeat.set(1, 1);

    // Cargar el mapa de desplazamiento
    const displacementMap = textureLoader.load(displacementMapPath);
    displacementMap.wrapS = THREE.RepeatWrapping;
    displacementMap.wrapT = THREE.RepeatWrapping;
    displacementMap.repeat.set(1, 1);

    // Crear el material que es visible desde ambos lados
    return new THREE.MeshStandardMaterial({
      map: texture,
      normalMap: normalMap,
      roughnessMap: roughnessMap,
      aoMap: aoMap,
      displacementMap: displacementMap,
      displacementScale: 0, // Ajusta la escala del desplazamiento según sea necesario
      normalScale: new THREE.Vector2(1, 1), // Ajusta la escala del mapa de normales
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
  }

  createCustomCube() {
    // Crear la geometría del cubo
    const geometry = new THREE.BoxGeometry(5, 5, 5); // Dimensiones del cubo

    // Crear el material usando el método genérico
    const material = this.createMaterialWithTextures(
      '../../src/assets/texture/Bricks097/Bricks097_1K-JPG_Color.jpg',
      '../../src/assets/texture/Bricks097/Bricks097_1K-JPG_NormalGL.jpg',
      '../../src/assets/texture/Bricks097/Bricks097_1K-JPG_Roughness.jpg',
      '../../src/assets/texture/Bricks097/Bricks097_1K-JPG_AmbientOcclusion.jpg',
      '../../src/assets/texture/Bricks097/Bricks097_1K-JPG_Displacement.jpg'
    );

    // Crear la malla con la geometría y el material
    const cube = new THREE.Mesh(geometry, material);
    
    cube.castShadow = true;   // Permitir que el cubo proyecte sombras
    cube.receiveShadow = true; // Permitir que el cubo reciba sombras

    // Añadir la malla al obstáculo
    this.obstacle.add(cube);
  }

  createCustomRectangle() {
    // Crear la geometría personalizada con las dimensiones deseadas
    const geometry = new THREE.BoxGeometry(10, 5, 5); // Dimensiones basadas en los vértices proporcionados donde trabajamos con UV mapping 

    // Crear el material usando el método genérico
    const material = this.createMaterialWithTextures(
      '../../src/assets/texture/Ground078/Ground078_1K-JPG_Color.jpg',
      '../../src/assets/texture/Ground078/Ground078_1K-JPG_NormalGL.jpg',
      '../../src/assets/texture/Ground078/Ground078_1K-JPG_Roughness.jpg',
      '../../src/assets/texture/Ground078/Ground078_1K-JPG_AmbientOcclusion.jpg',
      '../../src/assets/texture/Ground078/Ground078_1K-JPG_Displacement.jpg'
    );

    // Crear la malla con la geometría y el material
    const rectangle = new THREE.Mesh(geometry, material);
    
    rectangle.castShadow = true;   // Permitir que el rectángulo proyecte sombras
    rectangle.receiveShadow = true; // Permitir que el rectángulo reciba sombras

    // Añadir la malla al obstáculo
    this.obstacle.add(rectangle);
  }

  createSphere() {
    const geometry = new THREE.SphereBufferGeometry(3, 25, 25); // Esfera predefinida permitida solo para el tanque
     
     const material = this.createMaterialWithTextures(
       '../../src/assets/texture/PaintedMetal017/PaintedMetal017_1K-JPG_Color.jpg', 
       '../../src/assets/texture/PaintedMetal017/PaintedMetal017_1K-JPG_NormalGL.jpg', 
       '../../src/assets/texture/PaintedMetal017/PaintedMetal017_1K-JPG_Roughness.jpg', 
       '../../src/assets/texture/PaintedMetal017/PaintedMetal017_1K-JPG_AmbientOcclusion.jpg', 
       '../../src/assets/texture/PaintedMetal017/PaintedMetal017_1K-JPG_Displacement.jpg'
     );
    
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