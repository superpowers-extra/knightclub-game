class PlayerBehavior extends Sup.Behavior {
  position: Sup.Math.Vector3;
  
  awake() {
    Game.player = this;
    this.position = this.actor.getLocalPosition();
  }

  update() {
    // TODO: Use Cannon.js
    if (Sup.Input.isKeyDown("RIGHT")) {
      this.position.x += PlayerBehavior.speed;
    }
    if (Sup.Input.isKeyDown("LEFT")) {
      this.position.x -= PlayerBehavior.speed;
    }
    if (Sup.Input.isKeyDown("UP")) {
      this.position.z -= PlayerBehavior.speed;
    }
    
    if (Sup.Input.isKeyDown("DOWN")) {
      this.position.z += PlayerBehavior.speed;
    }
    
    this.actor.setLocalPosition(this.position);
  }
}
Sup.registerBehavior(PlayerBehavior);

namespace PlayerBehavior {
  export const speed = 0.08;
}
