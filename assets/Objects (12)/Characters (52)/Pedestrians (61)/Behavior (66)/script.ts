class PedestrianBehavior extends CharacterBehavior {
  
  hasCollision = false;
  waypointGroup: string;

  private speed = Sup.Math.Random.float(0.02, 0.025);
  private waypointPositions: Sup.Math.Vector3[] = [];
  private activeWaypoint = 0;
  private targetPosition: Sup.Math.Vector3;
  private movement: Sup.Math.Vector3;

  private previousLineId: string;

  awake() {
    if (this.waypointGroup != null && Game.quest.mainObjective != null) {
      this.actor.destroy();
      return;
    }
    
    super.awake();
    this.selectLineId();
    
    // Pick a random path
    let waypoints: Sup.Actor[];
    if (this.waypointGroup != null) {
      waypoints = Sup.getActor(this.waypointGroup).getChildren();
    } else {
      const paths = Sup.getActor("Pedestrian Paths").getChildren();
      waypoints = Sup.Math.Random.sample(paths).getChildren();
    }
    for (const waypoint of waypoints) this.waypointPositions.push(waypoint.getLocalPosition());
    
    if (this.waypointGroup == null) {
      this.position.copy(this.waypointPositions[0]);
    } else {
      this.position = this.actor.getLocalPosition();
      this.activeWaypoint = -1;
    }
    this.actor.setLocalPosition(this.position);
    this.selectNextWaypoint();
    
    new Sup.Tween(this.actor, { opacity: 0 })
      .to({ opacity: 1 }, 500)
      .onUpdate((object) => { this.actor.getChild("Sprite").spriteRenderer.setOpacity(object.opacity); })
      .start();

    this.spriteActor.spriteRenderer.setAnimation("Animation");
  }

  update() {
    super.update();
    
    if (Game.player.activeInteraction === this) return;
    
    if (this.position.distanceTo(this.targetPosition) <= this.speed) {
      this.position.copy(this.targetPosition);
      
      if (this.activeWaypoint === this.waypointPositions.length - 1) {
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
      this.spriteActor.spriteRenderer.setHorizontalFlip(this.movement.x < 0);
    }
    
    this.actor.setLocalPosition(this.position);
  }

  finish() {
    super.finish();
    this.selectLineId();
  }

  selectLineId() {
    let lineId: string;
    while (lineId == null || lineId === this.previousLineId)
      lineId = Sup.Math.Random.sample(Game.getTextIds("pedestrians"));
    
    this.activeLines = [ [ this.personId, lineId ] ];
    this.previousLineId = lineId;
  }

  selectNextWaypoint() {
    this.activeWaypoint += 1;
    this.targetPosition = this.waypointPositions[this.activeWaypoint];
    this.movement = this.targetPosition.clone().subtract(this.position).normalize().multiplyScalar(this.speed);
  }
}
Sup.registerBehavior(PedestrianBehavior);
