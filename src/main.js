import * as THREE from 'three';
import Vehicle from './vehicle/Vehicle.js';
import Obstacle from './obstacles/obstacle1.js';

let scene, camera, renderer, vehicle;
let currentView = 'thirdPerson'; // Vista actual: "thirdPerson" o "topDown"

// Variables para la rotación de la torreta
let rotateTorretaLeft = false;
let rotateTorretaRight = false;
let rotateCannonUp = false;
let rotateCannonDown = false;

function init() {
  // Crear la escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0d9ff); // Color cielo

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

  // Crear obstáculos
  const obstacle1 = new Obstacle('cube').getObstacle();
  obstacle1.position.set(0, 0.5, -5);
  scene.add(obstacle1);

  const obstacle2 = new Obstacle('rectangle').getObstacle();
  //obstacle2.position.set(10, 0.5, -20);
  //indica que se tiene 10 en x, 0.5 en y y -20 en z
  obstacle2.position.set(10, 0.5, -20);
  scene.add(obstacle2);

  const obstacle3 = new Obstacle('sphere').getObstacle();
  obstacle3.position.set(5, 3, 15);
  scene.add(obstacle3);

  // Suelo
  const texture = new THREE.TextureLoader().load('../src/assets/grass_2.png');
  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);


  // Movimiento del vehículo
  const speed = 0.1;
  const rotationSpeed = 0.05;

  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      // Movimientos del vehículo
      case 'ArrowUp':
        vehicle.moveForward(speed);
        break;
      case 'ArrowDown':
        vehicle.moveBackward(speed);
        break;
      case 'ArrowLeft':
        vehicle.rotateLeft(rotationSpeed);
        break;
      case 'ArrowRight':
        vehicle.rotateRight(rotationSpeed);
        break;
      case '1':  // Cambiar a vista en tercera persona
        currentView = 'thirdPerson';
        break;
      case '2':  // Cambiar a vista aérea
        currentView = 'topDown';
        break;
      case '3':  // Cambiar a vista lateral
        currentView = 'sideView';
        break;
      // Rotación de torreta y cañón
      case 'a':  // Rotar torreta a la izquierda
        rotateTorretaLeft = true;
        break;
      case 'd':  // Rotar torreta a la derecha
        rotateTorretaRight = true;
        break;
      case 'w':  // Subir cañon
        rotateCannonUp = true;
        break;
      case 's':  // Bajar cañon
        rotateCannonDown = true;
        break;
    }
  });

  // Listener para detener la rotación de la torreta/cañón cuando se sueltan las teclas
  document.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'a':
        rotateTorretaLeft = false;
        break;
      case 'd':
        rotateTorretaRight = false;
        break;
      case 'w':
        rotateCannonUp = false;
        break;
      case 's':
        rotateCannonDown = false;
        break;
      case ' ':  // Disparar
        //console.log("Disparar");
        vehicle.fireProjectile(scene);
        break;	
    }
  });

  // Animación
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  updateCameraPosition();
  updateVehicleControls();
  
  renderer.render(scene, camera);
}

function updateCameraPosition() {
  const vehiclePosition = vehicle.getVehicle().position;

  if (currentView === 'thirdPerson') {
    // Vista en tercera persona (detrás y arriba del vehículo)
    camera.position.set(
      vehiclePosition.x - 10 * Math.sin(vehicle.getVehicle().rotation.y),
      vehiclePosition.y + 5,
      vehiclePosition.z - 10 * Math.cos(vehicle.getVehicle().rotation.y)
    );
    camera.lookAt(vehiclePosition);
  } else if (currentView === 'topDown') {
    // Vista aérea (directamente sobre el vehículo)
    camera.position.set(vehiclePosition.x, vehiclePosition.y + 20, vehiclePosition.z);
    camera.lookAt(vehiclePosition);
  }
  else if (currentView === 'sideView') {
    // Vista lateral (lado derecho del vehículo)
    // se utiliza la posicion del vehiculo y se le suma 10 en x y 5 en y y se le suma 10 en z
    //para que la camara se posicione en el lado derecho del vehiculo
    camera.position.set(
      vehiclePosition.x + 10 * Math.cos(vehicle.getVehicle().rotation.y),
      vehiclePosition.y + 5,
      vehiclePosition.z + 10 * Math.sin(vehicle.getVehicle().rotation.y)
    );
    camera.lookAt(vehiclePosition);
  }
}

function updateVehicleControls() {
  const rotationSpeed = 0.02;
  
  // Controlar la rotación de la torreta
  if (rotateTorretaLeft) {
    vehicle.rotateTorretaLeft(rotationSpeed);
  }
  if (rotateTorretaRight) {
    vehicle.rotateTorretaRight(rotationSpeed);
  }
  if (rotateCannonUp) {
    vehicle.rotateTorretaUp(rotationSpeed);
  }
  if (rotateCannonDown) {
    vehicle.rotateTorretaDown(rotationSpeed);
  }
}

init();

// Ajuste de pantalla cuando se redimensiona el navegador
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
