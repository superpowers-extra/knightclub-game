abstract class InteractionBehavior extends Sup.Behavior {
  
  // @hide
  position: Sup.Math.Vector3;
  personId: string;

  isAreaTrigger = false;
  width: number;
  depth: number;
  angle: number;
  
  awake() {
    Game.interactions.push(this);
    
    this.position = this.actor.getLocalPosition();
    if (this.isAreaTrigger) {
      this.width = this.actor.getLocalScaleX();
      this.depth = this.actor.getLocalScaleY();
      this.angle = this.actor.getLocalEulerY();
      this.actor.spriteRenderer.destroy();
    }
  }

  onDestroy() {
    const index = Game.interactions.indexOf(this);
    if (index !== -1) Game.interactions.splice(index, 1);
  }

  finish() {
    Game.player.finishInteraction();
  }

  abstract action();

  tryShapeShift() { return false; };
}
