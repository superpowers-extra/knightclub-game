class PedestriansBehavior extends CharacterBehavior {
  
  lineId = "welcome";
  private speed = Sup.Math.Random.float(0.02, 0.025);

  private waypoints = Sup.getActor("Pedestrian Waypoints").getChildren();
  private activeWaypoint = -1;
  private targetPosition: Sup.Math.Vector3;
  private movement: Sup.Math.Vector3;

  start() {
    super.start();
    this.name = this.spritePath.slice(this.spritePath.lastIndexOf("/") + 1);
    this.selectNextWaypoint();
    
    new Sup.Tween(this.actor, { opacity: 0 })
      .to({ opacity: 1 }, 500)
      .onUpdate((object) => { this.actor.getChild("Sprite").spriteRenderer.setOpacity(object.opacity); })
      .start();
  }

  update() {
    if (this.isSpeaking) return;
    
    if (this.position.distanceTo(this.targetPosition) <= this.speed) {
      this.position.copy(this.targetPosition);
      
      if (this.activeWaypoint === this.waypoints.length - 1) {
        new Sup.Tween(this.actor, { opacity: 1 })
          .to({ opacity: 0 }, 500)
          .onUpdate((object) => {
            this.actor.getChild("Sprite").spriteRenderer.setOpacity(object.opacity);
            this.actor.moveLocal(this.movement);
          })
          .onComplete(() => { this.actor.destroy(); })
          .start();
        this.destroy();
        return;
        
      } else {
        this.selectNextWaypoint();
      }
    } else {
      this.position.add(this.movement);
    }
    
    this.actor.setLocalPosition(this.position);
  }

  selectNextWaypoint() {
    this.activeWaypoint += 1;
    this.targetPosition = this.waypoints[this.activeWaypoint].getLocalPosition();
    this.movement = this.targetPosition.clone().subtract(this.position).normalize().multiplyScalar(this.speed);
  }
}
Sup.registerBehavior(PedestriansBehavior);
