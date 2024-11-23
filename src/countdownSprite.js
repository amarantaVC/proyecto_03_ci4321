import * as THREE from 'three';

const totalFrames = 4;
let countdownValue = 3;
let countdownSprite;
let numberTextures = [];
let countdownInterval;

const loadNumberTextures = () => {
    const loader = new THREE.TextureLoader();
    const promises = [];

    for (let i = 0; i < totalFrames; i++) {
        promises.push(new Promise((resolve) => {
            loader.load(`/src/path/Ardentryst_Numbers/Ardentryst-${i}c.png`, (texture) => {
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.needsUpdate = true;
                numberTextures[i] = texture;
                resolve();
            });
        }));
    }
    return Promise.all(promises);
};

function createCountdownSprite(scene) {
    const material = new THREE.SpriteMaterial({ 
        map: numberTextures[countdownValue],
        transparent: true 
    });
    countdownSprite = new THREE.Sprite(material);
    countdownSprite.scale.set(1, 1, 1); 
    countdownSprite.position.set(0, 5.7, -4);
    scene.add(countdownSprite);
}

// Actualizar el sprite del contador
function updateCountdownSprite(scene) {
    if (countdownValue <= 0) {
        // Detener el contador y eliminar el sprite
        clearInterval(countdownInterval);
        scene.remove(countdownSprite);
        countdownSprite = null;
        console.log("¡Contador detenido!");
        return;
    }

    countdownValue--; // Reducir el valor del contador

    // Actualizar la textura del sprite
    countdownSprite.material.map = numberTextures[countdownValue];
    countdownSprite.material.needsUpdate = true;
    console.log(`Actualizado a: ${countdownValue}`);
}

function startCountdown(scene) { 
    loadNumberTextures().then((numberTextures) => { 
        createCountdownSprite(scene, numberTextures); 
        countdownInterval = setInterval(() => { 
            updateCountdownSprite(scene, numberTextures); 
        },500); 
    }); 
}

export default startCountdown;