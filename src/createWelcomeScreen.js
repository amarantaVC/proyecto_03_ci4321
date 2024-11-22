import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const messageWecolme = 'Bienvenido al Juego';
const messageCountdown = '3';
const fontPath = '/src/font/JSON/Happy_School_Regular.json';

function createWelcomeScreen(scene, camera) { 
    const loader = new FontLoader();
    const font = loader.load(fontPath,
    
        // onLoad callback
        function ( font ) {
            showCountdown(scene, font, camera);
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

function showCountdown(scene, font, camera) {
    // Pantalla negra
    const overlayGeometry = new THREE.PlaneGeometry(7, 7);
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

    setTimeout(() => {
        scene.remove(overlay);
        showWelcomeMessage(scene, font);
    }, 3000);
};

function showWelcomeMessage(scene, font) {
    const textGeometry = new TextGeometry(messageWecolme, {
        font: font,
        size: 1,
        height: 0.1,
    });

    const textMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x800080,
        opacity: 0.5,
        side: THREE.DoubleSide
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-6, 0, -5);
    scene.add(textMesh);

    setTimeout(() => {
        scene.remove(textMesh); 
    }, 2000);
};

export default createWelcomeScreen;
