import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const messageWecolme = 'Bienvenido al Juego';
let messageCountdown = 3;
let countdownMesh; // Variable para almacenar el mesh del contador
const messageGo = 'GO!';
const messageGameOver = 'Game Over';
const gameTitle = 'Tanky Sparkle Wars';
const fontPath = '/src/font/JSON/Janda_Manatee_Solid_Regular.json';

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
        showWelcomeMessage(scene, font);
    }, 6000);
};

function showGameTitle(scene, font, position) {
    const titleGeometry = new TextGeometry(gameTitle, {
        font: font,
        size: 0.15,
        height: 0.01,
    });

    // Centrar el título del juego
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
        counterTimer(scene, font, position);
    }, 2000);
};

function counterTimer(scene, font, position) {
    const textGeometry = new TextGeometry(messageCountdown.toString(), {
        font: font,
        size: 0.2,
        height: 0.05,
    });

    textGeometry.computeBoundingBox();
    const countWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

    const textMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff0000,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide
    });

    countdownMesh = new THREE.Mesh(textGeometry, textMaterial);
    
    countdownMesh.rotation.y = Math.PI;
    countdownMesh.position.set(countWidth / 2, 5.7, position.z);
    scene.add(countdownMesh);

    // Iniciar el conteo regresivo
    startCountdown(scene, font, position);
}

function startCountdown(scene, font, position) {
    const countdownInterval = setInterval(() => {
        messageCountdown--;
        if (messageCountdown < 0) {
            clearInterval(countdownInterval);
            scene.remove(countdownMesh);
            showGoMessage(scene, font, position);
            return;
        }
        updateCountdownText(font);
    }, 1000);
}

function updateCountdownText(font) {
    if (!countdownMesh) return;

    const textGeometry = new TextGeometry(messageCountdown.toString(), {
        font: font,
        size: 0.2,
        height: 0.05,
    });

    countdownMesh.geometry.dispose(); // Liberar la geometría anterior
    countdownMesh.geometry = textGeometry; // Asignar la nueva geometría al mesh

    const countWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    countdownMesh.position.set(-countWidth / 2, countdownMesh.position.y, countdownMesh.position.z);
}

function showGoMessage(scene, font, position) {
    const textGeometry = new TextGeometry(messageGo, {
        font: font,
        size: 0.2,
        height: 0.05,
    });

    textGeometry.computeBoundingBox();
    const goWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

    const textMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff0000,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide
    });

    const messageGoMesh = new THREE.Mesh(textGeometry, textMaterial);
    
    messageGoMesh.rotation.y = Math.PI;
    messageGoMesh.position.set(goWidth / 2, 5.7, position.z);
    scene.add(messageGoMesh);

    setTimeout(() => {
        scene.remove(messageGoMesh);
    }, 2000);
}

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
    
    // Centrar el texto
    textGeometry.computeBoundingBox();
    const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    
    textMesh.position.set(7, 0, -4);
    textMesh.rotation.y = Math.PI;
    scene.add(textMesh);

    setTimeout(() => {
        scene.remove(textMesh); 
    }, 2000);
};

export default createWelcomeScreen;
