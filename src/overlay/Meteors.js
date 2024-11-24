import * as THREE from 'three';

const meteorNames = [
    "meteorBrown_big1.png",
    "meteorBrown_big2.png",
    "meteorBrown_big3.png",
    "meteorBrown_big4.png",
    "meteorBrown_med1.png",
    "meteorBrown_med3.png",
    "meteorBrown_small1.png",
    "meteorBrown_small2.png",
    "meteorBrown_tiny1.png",
    "meteorBrown_tiny2.png"
];

class MeteorManager {
    constructor(scene) {
        this.scene = scene;
        this.textureLoader = new THREE.TextureLoader();
        this.atlasTexture = null;
        this.spriteData = null;

        this.loadAtlas();
    }

    loadAtlas() {
        // Cargar la textura del atlas
        this.atlasTexture = this.textureLoader.load('/src/path/atlas/meteors.png', (texture) => {
            // Cargar JSON con las coordenadas de los sprites
            fetch('/src/path/atlas/meteors.json')
                .then(response => response.json())
                .then(data => {
                    this.spriteData = data; // Guardar datos del JSON
                })
                .catch(error => console.error('Error al cargar el JSON:', error));
        }, undefined, (error) => {
            console.error('Error al cargar la textura:', error);
        });
    }

    createMeteor(position) {
        if (!this.spriteData) return;
    
        // Seleccionar un nombre de meteoro aleatorio
        const randomMeteorName = meteorNames[Math.floor(Math.random() * meteorNames.length)];
        
        // Obtener los datos del frame correspondiente al meteoro seleccionado
        const frameData = this.spriteData.frames[randomMeteorName].frame;
    
        // Crear una textura para el meteorito usando el atlas
        const meteorTexture = new THREE.Texture(this.atlasTexture.image);
        
        // Configurar las coordenadas UV basadas en el frame
        const uOffset = frameData.x / this.atlasTexture.image.width;
        const vOffset = 1 - (frameData.y + frameData.h) / this.atlasTexture.image.height;
        const uRepeat = frameData.w / this.atlasTexture.image.width;
        const vRepeat = frameData.h / this.atlasTexture.image.height;
    
        meteorTexture.repeat.set(uRepeat, vRepeat);
        meteorTexture.offset.set(uOffset, vOffset);
        meteorTexture.needsUpdate = true;
        const meteorMaterial = new THREE.SpriteMaterial({
            map: meteorTexture,
            color: 0xffffff,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
            depthTest: true,
            depthWrite: false
        });
    
        const meteorSprite = new THREE.Sprite(meteorMaterial);
        
        meteorSprite.position.copy(position);

        // Escalar el sprite según el tamaño del frame
        meteorSprite.scale.set(frameData.w / 80, frameData.h / 80, 1);
    
        return meteorSprite;
    }
}

export default MeteorManager;