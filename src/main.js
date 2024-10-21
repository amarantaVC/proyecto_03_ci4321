import * as THREE from 'three';
import Vehicle from './vehicle/Vehicle.js';

let scene, camera, renderer, vehicle;

function init() {
  // Crear la escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0d9ff); // Color cielo

  // Crear la cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);

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

  // Suelo
  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2; // Rotar para que quede horizontal
  scene.add(plane);


  // Movimiento del vehículo
  const speed = 0.1;
  const rotationSpeed = 0.05;

  // Listener del teclado
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
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
