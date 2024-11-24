import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';;
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

function loadFontAndShowText(scene, camera, text, fontPath) {
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
                color: 0xff0000,
                metalness: 0.3,
                roughness: 0.4
            });

            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // Posicionar el texto frente a la cámara
            const distanceFromCamera = 3; // Distancia desde la cámara
            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);

            const position = new THREE.Vector3()
                .copy(camera.position)
                .add(cameraDirection.multiplyScalar(distanceFromCamera));

            textMesh.position.set(position.x, 5, position.z);
            textMesh.lookAt(camera.position); // Orientar el texto hacia la cámara

            scene.add(textMesh); // Agregar texto a la escena
        },
        undefined,
        (error) => {
            console.error('Error al cargar la fuente:', error);
        }
    );
}

export default loadFontAndShowText;
