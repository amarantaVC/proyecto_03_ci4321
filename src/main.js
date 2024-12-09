// main.js
import * as THREE from 'three';

import createWelcomeScreen from './overlay/createWelcomeScreen.js';
import Vehicle from './vehicle/Vehicle.js'; // Importar el módulo de vehículo
import Obstacle from './obstacles/obstacle.js'; // Importar el módulo de obstáculos
import Skybox from './skybox/skybox.js'; // Importar el módulo de skybox
import Controls from './controls/controls.js'; // Importar el módulo de controles
import Projectile from './projectile/Projectile.js'; // Importar el módulo de proyectiles
import EnergyBar from './overlay/barEnergy.js'; // Importar el módulo de la barra de energía
import MeteorManager from './overlay/Meteors.js'; // Importar el módulo de meteoritos
import loadFontAndShowText from './overlay/loadFontAndShowText.js';
import ParticleSystem from './particle/particleSystem.js';

const fontPath = '/src/font/JSON/Janda_Manatee_Solid_Regular.json';

// Atributos globales
let scene, camera, renderer, vehicle;
let currentView = 'thirdPerson'; // Vista actual: "thirdPerson" o "topDown"
let projectiles = []; 
let obstacles = [];
let meteors = [];
let energyBar;
let meteorManager;
let vehicleBox;
let gameState = 'running'; // Estados posibles: 'running', 'stopped'
let controls;
let meteorInterval; 
let meteorTimeout;
let particleSystem;

const clock = new THREE.Clock(); 
const radius = 10; // Radio de las partículas
const textureLoaderRock = new THREE.TextureLoader();
const rockTexture = textureLoaderRock.load('../src/assets/texture/Rock/3.jpg');

// Crear un elemento para mostrar el pitch del cañón
const pitchDisplay = document.createElement('div'); // Crear un elemento HTML tipo div para mostrar el pitch
pitchDisplay.style.position = 'absolute'; // Posición absoluta para que no afecte al resto de elementos
pitchDisplay.style.bottom = '20px'; // Posicionar en la parte superior izquierda
pitchDisplay.style.left = '20px'; // Posicionar en la parte superior izquierda
pitchDisplay.style.color = 'fuchsia'; // Color del texto
pitchDisplay.style.fontFamily = 'Arial, sans-serif';
pitchDisplay.style.zIndex = 150; // Asegurarse de que esté por encima del canvas, los 150 es para que esté por encima de todo
pitchDisplay.textContent = 'Pitch del cañón: 0°'; // Contenido inicial
pitchDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Fondo semi-transparente para mejor visibilidad
pitchDisplay.style.padding = '10px'; // Espaciado interno
pitchDisplay.style.borderRadius = '5px'; // Bordes redondeados
pitchDisplay.style.fontSize = '26px'; // Aumentar el tamaño de la letra (puedes ajustar este valor)
document.body.appendChild(pitchDisplay);

function init() {
  // Crear la escena
  scene = new THREE.Scene();
  // Crear el skybox
  new Skybox(scene, '../src/assets/cielo.png');
  // Crear la cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(10, 10, 5);
  camera.position.z = 5;
  camera.lookAt(scene.position);
  
  // Configurar el renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true; // Activar las sombras
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Luz direccional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.intensity = 1.5;
  directionalLight.position.set(-10, 10, -10); // posicion de la
  directionalLight.castShadow = true;
  // Ajustar el área y resolución de las sombras
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 100;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;
  scene.add(directionalLight);

  // Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Crear la barra de energía
  energyBar = new EnergyBar(scene);
  
  // Crear el vehículo
  vehicle = new Vehicle(scene);
  scene.add(vehicle.getVehicle());
  vehicleBox = new THREE.Box3().setFromObject(vehicle.getVehicle());
  
  // Inicializar MeteorManager, pasado 6 segundos
  setTimeout(() => {
    starMeteorShower();
  }, 20000);

  // Inicializar el sistema de particulas
  particleSystem = new ParticleSystem(scene, rockTexture);

  // Crear obstáculos
  const obstacle1 = new Obstacle('cube').getObstacle();
  obstacle1.position.set(10, 2, 20);
  obstacles.push(obstacle1);
  scene.add(obstacle1);

  const obstacle2 = new Obstacle('rectangle').getObstacle();
  obstacle2.position.set(-15, 2, 25);
  obstacle2.rotation.z = Math.PI/2 ;
  obstacles.push(obstacle2);
  scene.add(obstacle2);
  
  const obstacle3 = new Obstacle('sphere').getObstacle();
  obstacle3.position.set(1, 3, 30);
  obstacles.push(obstacle3);
  scene.add(obstacle3);

  const obstacle4 = new Obstacle('sphere').getObstacle();
  obstacle4.position.set(35, 3, 10);
  obstacles.push(obstacle4);
  scene.add(obstacle4);

  const obstacle5 = new Obstacle('customSphere').getObstacle();
  obstacle5.position.set(36, 3, 30);
  obstacles.push(obstacle5);
  scene.add(obstacle5);

  const obstacle6 = new Obstacle('cube').getObstacle();
  obstacle6.position.set(-30, 2, 3);
  obstacles.push(obstacle6);
  scene.add(obstacle6);

  const obstacle7 = new Obstacle('rectangle').getObstacle();
  obstacle7.position.set(-45, 2, 25);
  obstacle7.rotation.z = Math.PI/2 ;
  obstacles.push(obstacle7);
  scene.add(obstacle7);

  // Suelo
  const textureLoader = new THREE.TextureLoader();
  
  const texture = textureLoader.load('../src/assets/texture/Ground075/Ground075_1K-JPG_Color.jpg');

  // Configurar la textura para que se repita en ambas direcciones
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1); // Repetir la textura una vez en cada dirección
  const normalMap = textureLoader.load('../../src/assets/texture/Ground075/Ground075_1K-JPG_NormalGL.jpg');
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(1, 1);

  // Cargar el mapa de rugosidad
  const roughnessMap = textureLoader.load('../../src/assets/texture/Ground075/Ground075_1K-JPG_Roughness.jpg');
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(1, 1);

  // Cargar el mapa de oclusión ambiental
  const aoMap = textureLoader.load('../../src/assets/texture/Ground075/Ground075_1K-JPG_AmbientOcclusion.jpg');
  aoMap.wrapS = THREE.RepeatWrapping;
  aoMap.wrapT = THREE.RepeatWrapping;
  aoMap.repeat.set(1, 1);

   // Cargar el mapa de desplazamiento
   const displacementMap = textureLoader.load('../../src/assets/texture/Ground075/Ground075_1K-JPG_Displacement.jpg');
   displacementMap.wrapS = THREE.RepeatWrapping;
   displacementMap.wrapT = THREE.RepeatWrapping;
   displacementMap.repeat.set(1, 1);


  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshStandardMaterial({ 
    map: texture, 
    transparent: true,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    aoMap: aoMap,
    displacementMap: displacementMap,
    displacementScale: 0, // Ajusta la escala del desplazamiento según sea necesario
    normalScale: new THREE.Vector2(3, 3), 
    roughness: 0.5,

    side: THREE.DoubleSide
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // Crear la pantalla de bienvenida 
  createWelcomeScreen(scene, camera);
  
  // Inicializar los controles
  controls = new Controls(vehicle, updateView, shootProjectile);

  // Animación
  animate(controls);
}

function starMeteorShower() {
  meteorManager = new MeteorManager(scene);
  meteorInterval = setInterval(() =>{
    // Posición inicial aleatoria en la parte superior de la escena
    const centerX = 0; 
    const centerZ = 0; 
    const range = 150; // Rango alrededor del centro
  
    const x = centerX + (Math.random() * range - range / 2);
    const y = 15; // Altura inicial
    const z = centerZ + (Math.random() * range - range / 2);
    
    const position = new THREE.Vector3(x, y, z);

    const meteorSprite = meteorManager.createMeteor(position);

    if (meteorSprite) {
      meteors.push(meteorSprite);
      scene.add(meteorSprite);
    } 
  }, 0.5);

  meteorTimeout = setTimeout(() => {
    clearInterval(meteorInterval);
  }, 30000);
}

function checkCollision(projectile) {
  const projectileSphere = new THREE.Sphere(projectile.getPosition(), projectile.radius);
  
  for (const obstacle of obstacles) {
    const obstacleSphere = new THREE.Sphere(obstacle.position.clone(), obstacle.radius);
    if (projectileSphere.intersectsSphere(obstacleSphere)) {
        console.log('Colisión detectada con:', obstacle);
        
        // Crear partículas en la posición del obstáculo
        particleSystem.emit(obstacle.position.clone(), radius);
        
        scene.remove(obstacle);
        obstacles.splice(obstacles.indexOf(obstacle), 1);
        
        scene.remove(projectile.getProjectile());
        projectiles.splice(projectiles.indexOf(projectile), 1);

        break; // Salir del bucle al detectar una colisión
    }
  }
}

function shootProjectile() {
  // Posición y dirección inicial del proyectil
  const startPosition = vehicle.getVehiclePosition();
  const direction = vehicle.getVehicleDirection();
  startPosition.add(direction.clone().multiplyScalar(2));

  // Crear y disparar el proyectil
  const projectile = new Projectile(scene);
  projectile.fireProjectile(startPosition, direction);
  projectiles.push(projectile);

  // Crear una luz de destello (flashLight)
  const flashLight = new THREE.SpotLight(0xffa500, 8, 45, Math.PI / 4, 0.5, 2);
  flashLight.position.copy(startPosition);
  flashLight.target.position.copy(startPosition.clone().add(direction));
  flashLight.castShadow = true;
  scene.add(flashLight);
  scene.add(flashLight.target);

  // Crear el RectAreaLight para simular el láser
  const laserWidth = 1; // Ancho del láser
  const laserHeight = 10; // Alto del láser (longitud)
  const laserLight = new THREE.RectAreaLight(0xff0000, 10, laserWidth, laserHeight); // Color rojo, intensidad

  // Posicionar y orientar el RectAreaLight
  laserLight.position.copy(startPosition);
  
  // Calcular la posición final hacia donde apunta el proyectil
  const targetPosition = startPosition.clone().add(direction.clone().multiplyScalar(10)); // Ajusta la distancia según sea necesario
  laserLight.lookAt(targetPosition); // Orientar hacia donde apunta el proyectil

  scene.add(laserLight);

  // Verificar colisiones con los obstáculos
  let hitObstacle = false;

  for (const obstacle of obstacles) {
      const obstacleSphere = new THREE.Sphere(obstacle.position.clone(), obstacle.radius);
      const projectileSphere = new THREE.Sphere(startPosition.clone(), projectile.radius);

      if (projectileSphere.intersectsSphere(obstacleSphere)) {
          hitObstacle = true;
          laserLight.position.copy(obstacle.position); // Posicionar el láser en la colisión
          break; // Salir al detectar una colisión
      }
  }

  if (!hitObstacle) {
      // Si no hubo colisión, mantener la posición original del láser
      laserLight.position.copy(startPosition);
      laserLight.lookAt(targetPosition); // Mantener orientación hacia el objetivo
  }

  // Duración del destello y del láser antes de eliminarlos
  setTimeout(() => {
      scene.remove(flashLight);
      scene.remove(flashLight.target);
      scene.remove(laserLight); // Eliminar el RectAreaLight después de un tiempo
  }, 200); // Duración en milisegundos
}


function animate(controls) {
  if (gameState === 'stopped') {
    console.log('Game stopped');
    return;
  }

  if (gameState !== 'running') {
    return;
  }

  requestAnimationFrame(() => animate(controls));

  if (energyBar.showHealth() <= 0) {
    loadFontAndShowText(scene, camera, "GAME OVER", fontPath);
    setTimeout(() => {
      gameState = 'stopped';
      return;
    }, 300);
  }
  
  if (obstacles.length === 0) {
    loadFontAndShowText(scene, camera, "YOU WIN!!", fontPath);
    setTimeout(() => {
      gameState = 'stopped';
      return;
    }, 300);
  }

  updateMeteorPositions();
  
  // Obtener y mostrar el pitch del cañón
  const canonPitch = vehicle.getTorreta().getCanonPitch();
  // Actualizar el contenido del elemento HTML con el pitch del cañón
  pitchDisplay.textContent = `Pitch del cañón: ${canonPitch.toFixed(2)}°`; // Mostrar el pitch con dos decimales

  // Actualizar el sistema de partículas
  const deltaTime = clock.getDelta(); // Tiempo transcurrido desde el último frame
  particleSystem.update(deltaTime); // Actualizar partículas

  projectiles.forEach((projectile, index) => {
    checkCollision (projectile); // Verificar colisiones
    if (projectile.getPosition().y <= 0) {
      scene.remove(projectile.getProjectile());
      projectiles.splice(index, 1);
    }
  });
 
  updateCameraPosition();
  controls.updateVehicleControls();
  renderer.render(scene, camera);
}

function updateMeteorPositions() {

  meteors.forEach((meteor, index) => {
    meteor.position.y -= 0.5;
    //console.log(meteor.position.y);
    if (meteor.position.y < -1) {
        scene.remove(meteor);
        meteors.splice(index, 1);
    } else{
      const meteorBox = new THREE.Box3().setFromObject(meteor);
      if (vehicleBox.intersectsBox(meteorBox)) { // Verificar colisión con el bounding box del vehículo
        //console.log('Colisión con meteorito');
        energyBar.updateHealth(); // Disminuir salud en caso de colisión
        scene.remove(meteor);
        meteors.splice(index, 1);
      }
    }
  });
}

function updateView(view) {
  currentView = view; // Actualizar la vista actual
}

function updateCameraPosition() {
  const vehiclePosition = vehicle.getVehicle().position;

  const offsetDistance = 10;
  const heightOffset = 5;

  if (currentView === 'thirdPerson') {
    
    camera.position.set(
      vehiclePosition.x - offsetDistance * Math.sin(vehicle.getVehicle().rotation.y),
      vehiclePosition.y + heightOffset + 1,
      vehiclePosition.z - offsetDistance * Math.cos(vehicle.getVehicle().rotation.y)
    );
    camera.lookAt(vehiclePosition);
  } else if (currentView === 'topDown') {
    camera.position.set(vehiclePosition.x, vehiclePosition.y + 20, vehiclePosition.z);
    camera.lookAt(vehiclePosition);
  } else if (currentView === 'sideView') {
    camera.position.set(
      vehiclePosition.x + offsetDistance * Math.cos(vehicle.getVehicle().rotation.y),
      vehiclePosition.y + heightOffset,
      vehiclePosition.z + offsetDistance * Math.sin(vehicle.getVehicle().rotation.y)
    );
    camera.lookAt(vehiclePosition);
  }

  // Calcular nueva posición para la barra de energía
  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);
  const positionEnergyBar = camera.position.clone()
      .add(cameraDirection.multiplyScalar(6))
      .add(new THREE.Vector3(-0.6, 2, 0));
  energyBar.updatePosition(positionEnergyBar);
}

init();

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});