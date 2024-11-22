import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const messageWecolme = 'Bienvenido al Juego';
const messageCountdown = '3';
const fontPath = '/src/font/JSON/Happy_School_Regular.json';

function createWelcomeScreen(scene, callback) { 
    console.log('createWelcomeScreen');

    const loader = new FontLoader();
    const font = loader.load(fontPath,
    
        // onLoad callback
        function ( font ) {
            // do something with the font
            console.log( font );
            const textGeometry = new TextGeometry(messageWecolme, {
                font: font,
                size: 1,
                height: 0.1,
            });

            const textMaterial = new THREE.MeshBasicMaterial({ 
                color: 800080, 
                side: THREE.DoubleSide
            
            });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(-1.5, 0, 0);
            const shapes = font.generateShapes( message, 100 );
            scene.add(textMesh);


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

export default createWelcomeScreen;
