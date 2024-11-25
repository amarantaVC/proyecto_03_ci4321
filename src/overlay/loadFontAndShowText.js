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
            
            const vehiclePosition = vehicle.getVehicle().position.clone();
            textMesh.position.copy(vehiclePosition);
            
            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);
            textMesh.position.add(cameraDirection.multiplyScalar(-8));
            
            const cameraPosition = camera.position.clone();
            textMesh.lookAt(cameraPosition);

            scene.add(textMesh);
        },
        undefined,
        (error) => {
            console.error('Error al cargar la fuente:', error);
        }
    );
}

export default loadFontAndShowText;
