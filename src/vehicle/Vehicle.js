import * as THREE from 'three';
import Torreta from './Torreta';
import Wheel from './Wheel';

class Vehicle {
  constructor() {
    this.vehicle = new THREE.Group();

    // Cuerpo del tanque (un rectángulo)
    const cuerpoGeometry  = new THREE.BoxGeometry(6, 1.5, 3);
    const cuerpoMaterial  = new THREE.MeshBasicMaterial({ color: 0x800080 });
    const cuerpo  = new THREE.Mesh(cuerpoGeometry, cuerpoMaterial);
    cuerpo.position.set(0, 1, 0);
    
    // Añadimos el cuerpo al vehículo
    this.vehicle.add(cuerpo);

    // Crear y agregar las ruedas al vehículo
    const ruedas = [];
    const numRuedas = 4;

    // Crear 4 ruedas, ajustando las posiciones
    
    // Añadir cada rueda al vehículo
    for (let i = 0; i < numRuedas/2; i++) {
      const xPos = -2.25 + (i * 1.5);  // Distribuir las ruedas a lo largo del eje X (eje longitudinal del tanque)

      // Agregar una rueda en el lado derecho
      const ruedaDerecha = new Wheel(xPos, 0.5, 1.5).getWheel();  // Rueda derecha (cerca de la cámara)
      //ruedaDerecha.rotation.z = Math.PI / 2;  // Rotar la rueda para que esté alineada correctamente
      ruedaDerecha.rotation.y = Math.PI / 2;  // Rotar la rueda para que esté alineada correctamente
      
      ruedas.push(ruedaDerecha);

      // Agregar una rueda en el lado izquierdo
      const ruedaIzquierda = new Wheel(xPos, 0.5, -1.5).getWheel();  // Rueda izquierda (lejos de la cámara)
      //ruedaIzquierda.rotation.z = Math.PI / 2;  // Rotar la rueda para que esté alineada correctamente
      ruedaIzquierda.rotation.y = Math.PI / 2;  // Rotar la rueda para que esté alineada correctamente
      ruedas.push(ruedaIzquierda);
    }

    // Añadir cada rueda al vehículo
    ruedas.forEach(rueda => this.vehicle.add(rueda));

    // Crear y agregar la torreta al vehículo
    const torreta = new Torreta();
    this.vehicle.add(torreta.getTorreta());
    
    this.vehicle.position.set(0, 1.5, 0);
    /*  */
    this.vehicle.rotation.z = Math.PI / 2;

  }

  getVehicle() {
    return this.vehicle;
  }

  
}

export default Vehicle;
