class BodyJailedBehavior extends InteractionBehavior {
  private textIds: string[];
  private currentText = 0;
  
  private coach: Sup.Actor;
  private prisoner: Sup.Actor;
  private waypoints: Sup.Actor[];
  private waypointIndex = 0;

  private coachPosition: Sup.Math.Vector3;
  private targetPosition: Sup.Math.Vector3;
  private direction: Sup.Math.Vector3;
  private movement: Sup.Math.Vector3;

  private coachSpeed = 0.1;
  private coachSound: Sup.Audio.SoundPlayer;

  awake() {
    this.coach = Sup.getActor("Coach");
    this.prisoner = this.coach.getChild("Prisoner");
    if (Game.quest.currentGoal !== Game.Goals.getSomeFreshAir) {
      this.coach.destroy();
      this.destroy();
      return;
    }
    
    this.waypoints = Sup.getActor("Coach Path").getChildren();
    this.coachPosition = this.coach.getLocalPosition();
    
    super.awake();
    this.textIds = Game.getTextIds("nightclubStreet.jailed");
    
  }

  start() {
    Game.player.startInteraction(this);
  }

  setupNextWaypoint() {
    const waypoint = this.waypoints[this.waypointIndex];
    this.targetPosition = waypoint.getLocalPosition();
    this.direction = this.targetPosition.clone().subtract(this.coachPosition).normalize();
    this.movement = this.direction.clone().multiplyScalar(this.coachSpeed);
    this.waypointIndex++;
  }

  update() {
    if (this.coach != null) this.prisoner.setOrientation(Game.camera.orientation);

    if (this.targetPosition == null) return;
    
    if (this.coachPosition.distanceTo(this.targetPosition) > this.coachSpeed) {
      this.coachPosition.add(this.movement);
    } else {
      this.coachPosition.copy(this.targetPosition);
      
      if (this.waypointIndex < this.waypoints.length) this.setupNextWaypoint();
      else {
        this.targetPosition = null;
        
        new Sup.Tween(this.actor, { volume: 0.3 })
          .to({ volume: 0 }, 500)
          .onUpdate((object) => { this.coachSound.setVolume(object.volume); })
          .onComplete(() => { this.coachSound.stop(); })
          .start();
        
        this.coach.destroy();
        this.coach = null;
        if (!Game.dialog.actor.getVisible()) {
          this.finish();
          this.destroy();
        }
        return;
      }
    }
    
    this.coach.setLocalPosition(this.coachPosition);
    this.coach.lookAt(this.targetPosition);
    this.coach.rotateLocalEulerY(Math.PI);
  }
  
  action() {
    if (this.currentText >= this.textIds.length) return;
    
    if (!Game.dialog.animatedText.isTextFullyDisplayed()) {
      Game.dialog.animatedText.progressToNextStop();
      return;
    }
    
    if (!Game.dialog.actor.getVisible()) {
      this.currentText = 0;
    } else {
      this.currentText++;
      
      if (this.currentText === 2) {
        this.coachSound = Sup.Audio.playSound("SFX/Police", 0.3);
        this.setupNextWaypoint();
      }
      
      if (this.currentText >= this.textIds.length) {
        Game.dialog.hide();
        Game.questManager.setMainObjective(Game.Objectives.locateMyBody, Game.Goals.goToTheCastle);
        
        if (this.coach == null) {
          this.finish();
          this.destroy();
        }

        return;
      }
    }
    
    Game.dialog.show("Horace", this.textIds[this.currentText]);
  }
}
Sup.registerBehavior(BodyJailedBehavior);
