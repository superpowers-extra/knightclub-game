class CharacterBehavior extends InteractionBehavior {
  protected activeLines: [string, string][];
  protected activeLineIndex = 0;

  protected hasCollision = true;

  protected spriteActor: Sup.Actor;
  
  awake() {
    this.spriteActor = this.actor.getChild("Sprite");
    if (this.spriteActor != null) this.personId = this.spriteActor.spriteRenderer.getSprite().path.slice("Characters/".length);
    if (this.personId === Game.playerPersonId) {
      this.actor.destroy();
      return;
    }
    
    super.awake();
    if (!this.hasCollision) return;
    
    if (this.actor.cannonBody == null) {
      new Sup.Cannon.Body(this.actor, {
        fixedRotation: true,
        positionOffset: { x: 0, y: 0.3, z: 0 },
        orientationOffset: { x: 90, y: 0, z: 0 },
        shape: "cylinder", radius: 0.3, height: 0.6
      });
    } else {
      Sup.log(`There's already a cannon body on ${this.actor.getName()}`);
    }
  }

  update() {
    if (this.spriteActor != null) this.spriteActor.setOrientation(Game.camera.orientation);
  }

  action() {
    if (this.activeLines == null) {
      Sup.log(`The Character ${this.actor.getName()} doesn't have any lines to say!`);
      this.finish();
      return;
    }
    
    if (this.spriteActor != null)  this.spriteActor.spriteRenderer.setHorizontalFlip(Game.player.position.x < this.position.x);
    
    if (!Game.dialog.actor.getVisible()) {
      this.activeLineIndex = 0;
    } else if (!Game.dialog.animatedText.isTextFullyDisplayed()) {
      Game.dialog.animatedText.progressToNextStop();
      return;
    } else {
      this.activeLineIndex++;
      
      if (this.activeLineIndex === this.activeLines.length) {
        Game.dialog.hide();
        this.finish();
        return;
      }
    }
    
    const [ speakerId, lineId ] = this.activeLines[this.activeLineIndex];
    Game.dialog.show(speakerId, lineId);
  }

  tryShapeShift() { return true; }
}
Sup.registerBehavior(CharacterBehavior);
