import * as THREE from 'three';

const totalFrames = 4;
let countdownValue = 3;
let countdownSprite = null;
let numberTextures = [];
let countdownInterval = null;

const loadNumberTextures = () => {
    const loader = new THREE.TextureLoader();

    return Promise.all(
        Array.from({ length: totalFrames }, (_, i) =>
            new Promise((resolve, reject) => {
                loader.load(
                    `/src/path/Ardentryst_Numbers/Ardentryst-${i}c.png`,
                    (texture) => {
                        texture.minFilter = THREE.LinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        texture.needsUpdate = true;
                        numberTextures[i] = texture;
                        resolve(texture);
                    },
                    undefined,
                    (error) => reject(error)
                );
            })
        )
    );
};

function createCountdownSprite(scene) {
    if (countdownSprite) return; 

    const material = new THREE.SpriteMaterial({ 
        map: numberTextures[countdownValue],
        transparent: true 
    });
    countdownSprite = new THREE.Sprite(material);
    countdownSprite.scale.set(1, 1, 1); 
    countdownSprite.position.set(0, 5.7, -4);
    scene.add(countdownSprite);
}

function fadeTransition(nextTexture) {
    
    const fadeDuration = 300;
    let elapsed = 0;
    
    const fadeStep = () => {
        if (!countdownSprite) return;
        
        elapsed += 16;
        const t = Math.min(elapsed / fadeDuration, 1);

        countdownSprite.material.opacity = 1 - t;

        if (t < 1) {
            requestAnimationFrame(fadeStep);
        } else if (nextTexture){
            countdownSprite.material.map = nextTexture;
            countdownSprite.material.needsUpdate = true;
            countdownSprite.material.opacity = 1;
        }
    };

    fadeStep();
}

function updateCountdownSprite(scene) {
    
    countdownValue--;

    if (countdownValue < 0) {
        if (countdownSprite) {
            scene.remove(countdownSprite);
            countdownSprite.material.dispose(); // Liberar memoria
            countdownSprite = null;
        }
        clearInterval(countdownInterval);
        countdownInterval = null;
        //console.log("¡Contador detenido!");
        return;
    }
    fadeTransition(numberTextures[countdownValue]);
    //console.log(`Actualizado a: ${countdownValue}`);
}

function startCountdown(scene) { 
    if (countdownInterval) return; 
    
    loadNumberTextures().then((numberTextures) => { 
        createCountdownSprite(scene); 
        countdownInterval = setInterval(() => { 
            updateCountdownSprite(scene, numberTextures); 
        }, 500); 
    }); 
}

export default startCountdown;