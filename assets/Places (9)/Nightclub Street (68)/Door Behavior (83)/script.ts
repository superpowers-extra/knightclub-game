class NightclubDoorBehavior extends Sup.Behavior {
  private isOpen = false;
  private position = this.actor.getLocalPosition();

  private body: CANNON.Body;
  
  awake() {
    this.actor.spriteRenderer.setAnimation("Animation").pauseAnimation();
    this.body = Sup.getActor("Physics").getChild("Nightclub Door").cannonBody.body;
  }

  update() {
    if (this.isOpen && Game.player.position.distanceTo(this.position) > 3.5) {
      this.close();
    }
  }
  
  open() {
    this.isOpen = true;
    this.actor.spriteRenderer.setAnimationFrameTime(1);
    this.body.position.y += 2;
  }

  close() {
    this.isOpen = false;
    this.actor.spriteRenderer.setAnimationFrameTime(0);
    this.body.position.y -= 2;
  }
}
Sup.registerBehavior(NightclubDoorBehavior);
