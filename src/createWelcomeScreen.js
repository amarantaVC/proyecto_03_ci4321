import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import startCountdown from './countdownSprite.js';

let messageCountdown = 3;
let countdownMesh; // Variable para almacenar el mesh del contador
const messageGameOver = 'Game Over';
const gameTitle = 'Tanky Sparkle Wars';
const fontPath = '/src/font/JSON/Janda_Manatee_Solid_Regular.json';

function createWelcomeScreen(scene, camera) { 
    const loader = new FontLoader();
    const font = loader.load(fontPath,
    
        // onLoad callback
        function ( font ) {
            showScren(scene, font, camera);
        },
    
        // onProgress callback
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
    
        // onError callback
        function ( err ) {
            console.log( 'An error happened' );
        }
    );
}

function showScren(scene, font, camera) {
    // Pantalla negra
    const overlayGeometry = new THREE.PlaneGeometry(10, 10);
    const overlayMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000, 
        transparent: true, 
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    
    const cameraPosition = camera.position.clone(); // Copiar posición de la cámara
    console.log(camera.position);
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    overlay.position.copy(cameraPosition);
    overlay.position.add(direction.multiplyScalar(1))

    scene.add(overlay);

    showGameTitle(scene, font, overlay.position);

    setTimeout(() => {
        scene.remove(overlay);
        showGameTitle(scene, font, cameraPosition);
    }, 3000);
};

function showGameTitle(scene, font, position) {
    const titleGeometry = new TextGeometry(gameTitle, {
        font: font,
        size: 0.15,
        height: 0.01,
    });

    titleGeometry.computeBoundingBox();
    const titleWidth = titleGeometry.boundingBox.max.x - titleGeometry.boundingBox.min.x;

    const titleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x800080,
        opacity: 1,
        transparent: true,
        side: THREE.DoubleSide
    });

    const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
    titleMesh.rotation.y = Math.PI;
    // Posicionar el título centrado en la pantalla y por encima del mensaje de bienvenida
    titleMesh.position.set(titleWidth / 2, 5.7, position.z);

    scene.add(titleMesh);

    setTimeout(() => {
        scene.remove(titleMesh);
        //counterTimer(scene, font, position);
        startCountdown(scene);
    }, 3001);
};

export default createWelcomeScreen;
