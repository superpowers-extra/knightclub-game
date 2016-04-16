class CameraBehavior extends Sup.Behavior {
  initialOrientation: Sup.Math.Quaternion;
  orientation: Sup.Math.Quaternion;
  
  awake() {
    Game.camera = this;
    this.initialOrientation = this.actor.getLocalOrientation();
    this.orientation = this.initialOrientation.clone();
  }

  update() {
    // Slerp camera orientation towards player
    this.actor.lookAt(Game.player.position);
    const targetOrientation = this.actor.getLocalOrientation();
    targetOrientation.slerp(this.initialOrientation, 0.8);

    this.orientation.slerp(targetOrientation, 0.02);
    this.actor.setLocalOrientation(this.orientation);

    // Make all characters billboard
    Game.player.actor.setOrientation(this.orientation).rotateLocalEulerY(Math.PI);
  }
}
Sup.registerBehavior(CameraBehavior);
