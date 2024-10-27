// main.js
import * as THREE from 'three';
import Vehicle from './vehicle/Vehicle.js';
//import Obstacle from './obstacles/obstacle.js';
import Skybox from './skybox/skybox.js'; // Importar el nuevo módulo
import Controls from './controls/controls.js'; // Importar el módulo de controles
import Projectile from './projectile/Projectile.js';///projectile/Projectile.js'; // Importar el módulo de proyectiles

let scene, camera, renderer, vehicle;
let currentView = 'thirdPerson'; // Vista actual: "thirdPerson" o "topDown"
let projectiles = []; 

function init() {
  // Crear la escena
  scene = new THREE.Scene();

  // Crear el skybox
  new Skybox(scene, '../src/assets/cielo.png'); // Llamar al skybox

  // Crear la cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(10, 10, 10);
  camera.lookAt(scene.position);
  
  // Configurar el renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true; // Activar las sombras
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Luz direccional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  directionalLight.castShadow = true;

  // Ajustar el área y resolución de las sombras
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 100;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;
  directionalLight.shadow.camera.far = 300;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;

  scene.add(directionalLight);

  // Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Crear el vehículo
  vehicle = new Vehicle(scene);
  scene.add(vehicle.getVehicle());

  // Suelo
  const texture = new THREE.TextureLoader().load('../src/assets/grass_2.png');
  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // Inicializar los controles
  const controls = new Controls(vehicle, updateView, shootProjectile);

  // Animación
  animate(controls);

}

function shootProjectile() {
  // Posición inicial del proyectil
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
    if (projectile.getPosition().y <= 0) {
      scene.remove(projectile.getProjectile());
      console.log('Projectile removed', projectile.getPosition());
      projectiles.splice(index, 1); // Remove projectile if it hits the ground
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

  if (currentView === 'thirdPerson') {
    camera.position.set(
      vehiclePosition.x - 10 * Math.sin(vehicle.getVehicle().rotation.y),
      vehiclePosition.y + 5,
      vehiclePosition.z - 10 * Math.cos(vehicle.getVehicle().rotation.y)
    );
    camera.lookAt(vehiclePosition);
  } else if (currentView === 'topDown') {
    camera.position.set(vehiclePosition.x, vehiclePosition.y + 20, vehiclePosition.z);
    camera.lookAt(vehiclePosition);
  } else if (currentView === 'sideView') {
    camera.position.set(
      vehiclePosition.x + 10 * Math.cos(vehicle.getVehicle().rotation.y),
      vehiclePosition.y + 5,
      vehiclePosition.z + 10 * Math.sin(vehicle.getVehicle().rotation.y)
    );
    camera.lookAt(vehiclePosition);
  }
}

init();

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
