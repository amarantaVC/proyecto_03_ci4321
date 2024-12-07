import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';;
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

function loadFontAndShowText(scene, vehicle, camera, text, fontPath) {
    const loader = new FontLoader();

    loader.load(
        fontPath,
        (font) => {
            // Crear geometría para el texto
            const textGeometry = new TextGeometry(text, {
                font: font,
                size: 0.5, // Tamaño del texto
                height: 0.1, // Profundidad del texto
                curveSegments: 12, // Curvatura de los bordes
                bevelEnabled: true, // Habilitar bisel
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });

            // Material para el texto
            const textMaterial = new THREE.MeshStandardMaterial({
                color: 0xff00ff,
                metalness: 0.3,
                roughness: 0.4,
                opacity: 1,
                transparent: true,
                side: THREE.DoubleSide
            });

            const textMesh = new THREE.Mesh(textGeometry, textMaterial); 
            const direction = new THREE.Vector3(); // Vector para almacenar la dirección
            camera.getWorldDirection(direction); // Obtener dirección de la cámara
            textMesh.position.copy(camera.position).add(direction.multiplyScalar(3));
            // Camara vea al texto
            // posicionar en el centro de y
            //textMesh.position.x = 1;
            //textMesh.position.y = 3;

           // textMesh.position.z -= 3;

            textMesh.lookAt(camera.position);
            scene.add(textMesh);

            console.log('Posición de la cámara:', camera.position);
            console.log('Posición del texto:', textMesh.position);

        },
        undefined,
        (error) => {
            console.error('Error al cargar la fuente:', error);
        }
    );
}

export default loadFontAndShowText;
