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

function updateCountdownSprite() {
    const newValue = (countdownValue - 1 + totalFrames) % totalFrames;
    // Cambiar la textura del sprite actual
    countdownSprite.material.map = numberTextures[newValue];
    countdownSprite.material.needsUpdate = true;
    
    // Actualizar el valor del contador
    countdownValue = newValue;

    // Si llegamos a cero, detener el contador
    if (countdownValue < 0) {
        clearInterval(countdownInterval);
        
        return;
    }
}

function startCountdown(scene, position) {
    loadNumberTextures().then(() => {
        createCountdownSprite(scene, position);
    });

    setInterval(() => {
        updateCountdownSprite();
        //scene.remove(countdownSprite);
    }, 2000);
}

export default startCountdown;