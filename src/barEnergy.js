import * as THREE from 'three';

class EnergyBar {
    constructor(scene) {
        this.scene = scene;
        this.hearts = [];
        this.maxHealth = 3;
        this.currentHealth = 3;
        this.barGroup = new THREE.Group();
        this.spriteData = null;
        this.initialPosition = new THREE.Vector3(0, 0, 0); // Ajustado para mover más a la derecha
        
        this.textureLoader = new THREE.TextureLoader();
        this.atlasTexture = this.textureLoader.load('/src/path/atlas/spritesheet.png', (texture) => {
            //console.log('Textura cargada correctamente');
            this.spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                color: 0xffffff,
                transparent: true,
                opacity: 1,
                side: THREE.DoubleSide,
                depthTest: true,
                depthWrite: false
            });
    
            // Cargar JSON con las coordenadas de los sprites
            fetch('/src/path/atlas/spritesheet.json')
                .then(response => response.json())
                .then(data => {
                    //console.log('JSON cargado:', data);
                    this.spriteData = data; // Guardar datos del JSON
                    this.createHearts(); // Crear corazones después de cargar JSON
                    this.scene.add(this.barGroup);
                    this.barGroup.position.copy(this.initialPosition);
                })
                .catch(error => console.error('Error al cargar el JSON:', error));
        }, undefined, (error) => {
            console.error('Error al cargar la textura:', error);
        });
    }

    createHearts() {
        for (let i = 0; i < this.maxHealth; i++) {
            const heart = this.createHeart(i*0.6, 0, 0);
            this.barGroup.add(heart);
            this.hearts.push(heart);
        }
    }

    createHeart(x, y, z) {
        const sprite = new THREE.Sprite(this.spriteMaterial.clone());
        sprite.scale.set(0.5, 0.5, 0.5);
        sprite.position.set(x, y, z);
        
        // Usar el nombre del sprite para configurar la textura
        this.setHeartTexture(sprite, 'tile_0044.png'); 
        
        return sprite;
    }

    setHeartTexture(sprite, spriteName) {
        if (!this.spriteData || !this.spriteData.frames[spriteName]) {
            console.error(`Datos no encontrados para el sprite: ${spriteName}`);
            return;
        }
        
        const frame = this.spriteData.frames[spriteName].frame; // Coordenadas del sprite

        const atlasWidth = this.atlasTexture.image.width; // Ancho del atlas
        const atlasHeight = this.atlasTexture.image.height; // Alto del atlas
        
        // Posición del atlas en UV
        const uOffset = frame.x / atlasWidth;
        const vOffset = 1 - (frame.y + frame.h) / atlasHeight; // Ajustar eje Y
        const uRepeat = frame.w / atlasWidth;
        const vRepeat = frame.h / atlasHeight;
        
        console.log(`UV Offset: (${uOffset}, ${vOffset}), Repeat: (${uRepeat}, ${vRepeat})`);

        sprite.material.map.offset.set(uOffset, vOffset);
        sprite.material.map.repeat.set(uRepeat, vRepeat);
        sprite.material.map.needsUpdate = true;
    }    

    updateHealth(damage) {

        if (damage < 0) return; // No permitir daño negativo

        this.currentHealth = Math.max(0, Math.min(newHealth, this.maxHealth));
    
        for (let i = 0; i < this.maxHealth; i++) {
            if (i < this.currentHealth) {
                this.setHeartTexture(this.hearts[i], 'tile_0044.png'); // Corazón lleno
            } else {
                this.setHeartTexture(this.hearts[i], 'tile_0045.png'); // Corazón vacío (otro sprite)
            }
        }
    }

    updatePosition(position) {
        if (!this.spriteMaterial || !this.spriteData) return;
        this.barGroup.position.copy(position); 
        this.barGroup.lookAt(position);  
    }
}

export default EnergyBar;