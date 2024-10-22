// CollisionDetector.js
import * as THREE from 'three';


export function checkCollisions(vehicle, obstacles) {
  const vehicleDimensions = vehicle.getDimensions();
  
  obstacles.forEach(obstacle => {
    const obstacleDimensions = obstacle.getDimensions();

    if (obstacleDimensions.type === 'cube') {
      if (checkCubeCollision(vehicleDimensions.position, vehicleDimensions.size, obstacleDimensions.position, obstacleDimensions.size)) {
        console.log('Colisión detectada entre el vehículo y un cubo');
      }
    } else if (obstacleDimensions.type === 'sphere') {
      if (checkSphereCollision(vehicleDimensions.position, vehicleDimensions.size.y / 2, obstacleDimensions.position, obstacleDimensions.radius)) {
        console.log('Colisión detectada entre el vehículo y una esfera');
      }
    }
  });
}

// Funciones de comprobación de colisiones
function checkCubeCollision(position1, size1, position2, size2) {
  const xOverlap = Math.abs(position1.x - position2.x) < (size1.x + size2.x) / 2;
  const yOverlap = Math.abs(position1.y - position2.y) < (size1.y + size2.y) / 2;
  const zOverlap = Math.abs(position1.z - position2.z) < (size1.z + size2.z) / 2;

  return xOverlap && yOverlap && zOverlap;
}

function checkSphereCollision(position1, radius1, position2, radius2) {
  const distanceSquared = (position1.x - position2.x) ** 2 + (position1.y - position2.y) ** 2 + (position1.z - position2.z) ** 2;
  const radiusSumSquared = (radius1 + radius2) ** 2;

  return distanceSquared < radiusSumSquared;
}
