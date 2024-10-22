import * as THREE from 'three';
import Vehicle from './vehicle/Vehicle.js';
import Obstacle from './obstacles/obstacle1.js';

let scene, camera, renderer, vehicle;

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

  // Luz direccional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Luz ambiental
  const ambientLight = new THREE.AmbientLight(0x404040); // Luz suave
  scene.add(ambientLight);

  // Crear el vehículo
  vehicle = new Vehicle();
  scene.add(vehicle.getVehicle());

  // Crear obstáculos
  const obstacle1 = new Obstacle('cube').getObstacle();
  obstacle1.position.set(0, 0.5, -5);
  scene.add(obstacle1);

  // Crear obstáculo 2
  const obstacle2 = new Obstacle('cube').getObstacle();

  //las coordenadas de los obstáculos son las siguientes: x, y, z (respectivamente)

  obstacle2.position.set(10, 0.5, -20);

  scene.add(obstacle2);

  const obstacle3 = new Obstacle('sphere').getObstacle();
  obstacle3.position.set(3, 3, 10);

  scene.add(obstacle3);
  /*

  // Crear un canvas y dibujar en él
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 512;  // Ajusta el tamaño como desees
  canvas.height = 512;

  // Hacer el fondo del canvas transparente
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas

  // Rellenar el canvas con un color
  ctx.fillStyle = 'green';
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Dibujar un rectángulo verde en toda la superficie
  */
  // Crear una textura a partir del canvas
  const texture =  new THREE.TextureLoader().load('../src/assets/grass_2.png'); // Cargar la textura
  // Suelo
  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshStandardMaterial({ map: texture, transparent: true }); // Aplicar la textura
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2; // Rotar para que quede horizontal
  scene.add(plane);

  // Movimiento del vehículo
  const speed = 0.1;
  const rotationSpeed = 0.05;

  // Variables para almacenar el estado de las teclas
  let isRotatingLeft = false;
  let isRotatingRight = false;

  // Listener del teclado
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
        isRotatingLeft = true;
        vehicle.rotateLeft(rotationSpeed);
        break;
      case 'ArrowRight':
        isRotatingRight = true;
        vehicle.rotateRight(rotationSpeed);
        break;
      // Movimientos de la torreta
      case 'a':  // Rotar torreta a la izquierda
        vehicle.rotateTorretaLeft(rotationSpeed);
        break;
      case 'd':  // Rotar torreta a la derecha
        vehicle.rotateTorretaRight(rotationSpeed);
        break;
      // Movimientos del cañón
      case 'w':  // Subir cañon
        vehicle.rotateTorretaUp(rotationSpeed);
        break;
      case 's':  // Bajar cañon
        vehicle.rotateTorretaDown(rotationSpeed);  // Aquí se llama correctamente la función
        break;
      case ' ':  // Disparar
        console.log("Disparar");
        break;	
    }
  });

  document.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        vehicle.resetWheelRotation()
        isRotatingLeft = false;
        
        break;
      case 'ArrowRight':
        vehicle.resetWheelRotation()
        isRotatingRight = false;
        break;
    }
  });

  // Animación
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
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
