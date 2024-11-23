import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import showTitle from './showTitle.js';

import startCountdown from './countdownSprite.js';

const messageGameOver = 'Game Over';
const gameTitle = 'Tanky Sparkle Wars';
const fontPath = '/src/font/JSON/Janda_Manatee_Solid_Regular.json';

function createWelcomeScreen(scene, camera) { 
    const loader = new FontLoader();
    const font = loader.load(fontPath,
    
        function ( font ) {
            showScren(scene, font, camera);
        },
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
    //console.log(camera.position);
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    overlay.position.copy(cameraPosition);
    overlay.position.add(direction.multiplyScalar(1))

    scene.add(overlay);

    showTitle(scene, gameTitle, font, overlay.position);

    setTimeout(() => {
        scene.remove(overlay);
        startCountdown(scene);
    }, 3000);
};

export default createWelcomeScreen;
