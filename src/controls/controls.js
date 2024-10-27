// Controls.js

class Controls {
    constructor(vehicle, updateView, shootProjectile) {
      this.vehicle = vehicle;
      this.updateView = updateView;
      this.shootProjectile = shootProjectile; 
  
      this.rotateTorretaLeft = false;
      this.rotateTorretaRight = false;
      this.rotateCannonUp = false;
      this.rotateCannonDown = false;
  
      // Inicializar los event listeners
      this.initEventListeners();
    }
  
    initEventListeners() {
      document.addEventListener('keydown', (event) => {
        this.handleKeyDown(event);
      });
  
      document.addEventListener('keyup', (event) => {
        this.handleKeyUp(event);
      });
    }
  
    handleKeyDown(event) {
      const speed = 0.1;
      const rotationSpeed = 0.05;
  
      switch (event.key) {
        case 'ArrowUp':
          this.vehicle.moveForward(speed);
          break;
        case 'ArrowDown':
          this.vehicle.moveBackward(speed);
          break;
        case 'ArrowLeft':
          this.vehicle.rotateLeft(rotationSpeed);
          break;
        case 'ArrowRight':
          this.vehicle.rotateRight(rotationSpeed);
          break;
        case '1':  // Cambiar a vista en tercera persona
          this.updateView('thirdPerson');
          break;
        case '2':  // Cambiar a vista aérea
          this.updateView('topDown');
          break;
        case '3':  // Cambiar a vista lateral
          this.updateView('sideView');
          break;
        case 'a':  // Rotar torreta a la izquierda
          this.rotateTorretaLeft = true;
          break;
        case 'd':  // Rotar torreta a la derecha
          this.rotateTorretaRight = true;
          break;
        case 'w':  // Subir cañón
          this.rotateCannonUp = true;
          break;
        case 's':  // Bajar cañón
          this.rotateCannonDown = true;
          break;
        case ' ':  // Disparar
          //this.vehicle.fireProjectile();
          this.shootProjectile()
          break;
      }
    }
  
    handleKeyUp(event) {
      switch (event.key) {
        case 'a':
          this.rotateTorretaLeft = false;
          break;
        case 'd':
          this.rotateTorretaRight = false;
          break;
        case 'w':
          this.rotateCannonUp = false;
          break;
        case 's':
          this.rotateCannonDown = false;
          break;
      }
    }
  
    updateVehicleControls() {
      const rotationSpeed = 0.06;
  
      if (this.rotateTorretaLeft) {
        this.vehicle.rotateTorretaLeft(rotationSpeed);
      }
      if (this.rotateTorretaRight) {
        this.vehicle.rotateTorretaRight(rotationSpeed);
      }
      if (this.rotateCannonUp) {
        this.vehicle.rotateTorretaUp(rotationSpeed);
      }
      if (this.rotateCannonDown) {
        this.vehicle.rotateTorretaDown(rotationSpeed);
      }
    }
  }
  
  export default Controls;
  