// main.js
import * as THREE from 'three';

import createWelcomeScreen from './createWelcomeScreen.js';
import Vehicle from './vehicle/Vehicle.js'; // Importar el módulo de vehículo
import Obstacle from './obstacles/obstacle.js'; // Importar el módulo de obstáculos
import Skybox from './skybox/skybox.js'; // Importar el módulo de skybox
import Controls from './controls/controls.js'; // Importar el módulo de controles
import Projectile from './projectile/Projectile.js'; // Importar el módulo de proyectiles
import EnergyBar from './barEnergy.js';

// Atributos globales
let scene, camera, renderer, vehicle;
let currentView = 'thirdPerson'; // Vista actual: "thirdPerson" o "topDown"
let projectiles = []; 
let obstacles = [];
let energyBar;

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
  directionalLight.position.set(15, 20, 20);
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

  
  // Crear obstáculos
  const obstacle1 = new Obstacle('cube').getObstacle();
  obstacle1.position.set(-15, 2, 25);
  obstacles.push(obstacle1);
  scene.add(obstacle1);

  const obstacle2 = new Obstacle('rectangle').getObstacle();
  obstacle2.position.set(10, 2, 20);
  obstacle2.rotation.z = Math.PI/2 ;
  obstacles.push(obstacle2);
  scene.add(obstacle2);

  const obstacle3 = new Obstacle('sphere').getObstacle();
  obstacle3.position.set(1, 3, 30);
  obstacles.push(obstacle3);
  scene.add(obstacle3);

  // Suelo
  const texture = new THREE.TextureLoader().load('../src/assets/grass_2.png');
  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // Crear la pantalla de bienvenida 
  createWelcomeScreen(scene, camera);
  
  // Inicializar los controles
  const controls = new Controls(vehicle, updateView, shootProjectile);

  // Animación
  animate(controls);
  
}

function checkCollision(projectile) {
  const projectileSphere = new THREE.Sphere(projectile.getPosition(), projectile.radius);
  
  for (const obstacle of obstacles) {
    const obstacleSphere = new THREE.Sphere(obstacle.position.clone(), obstacle.radius);

    if (projectileSphere.intersectsSphere(obstacleSphere)) {
        //console.log('Colisión detectada con:', obstacle);
        scene.remove(projectile.getProjectile());
        scene.remove(obstacle);

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
}

function animate(controls) {
  requestAnimationFrame(() => animate(controls));
 
  projectiles.forEach((projectile, index) => {
    checkCollision (projectile); // Verificar colisiones
    if (projectile.getPosition().y <= 0) {
      scene.remove(projectile.getProjectile());
      projectiles.splice(index, 1); // Eliminar proyectil
    }
  });
 
  updateCameraPosition();
  controls.updateVehicleControls();
  
  renderer.render(scene, camera);
}

function updateView(view) {
  currentView = view; // Actualizar la vista actual
}

function updateCameraPosition() {
  const vehiclePosition = vehicle.getVehicle().position;

  const offsetDistance = 10;
  const heightOffset = 5;
  let positionCamera;
  let cameraDirection = new THREE.Vector3();

  if (currentView === 'thirdPerson') {
    
    camera.position.set(
      vehiclePosition.x - offsetDistance * Math.sin(vehicle.getVehicle().rotation.y),
      vehiclePosition.y + heightOffset + 1,
      vehiclePosition.z - offsetDistance * Math.cos(vehicle.getVehicle().rotation.y)
    );
    camera.lookAt(vehiclePosition);
    
    
    positionCamera = camera.position.clone();
    const positionEnergyBar = positionCamera.add(new THREE.Vector3(-6, 0.5, 6))
    energyBar.updatePosition(positionEnergyBar);
    console.log(positionEnergyBar);

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
  //energyBar.updatePosition(camera);
}

init();

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
