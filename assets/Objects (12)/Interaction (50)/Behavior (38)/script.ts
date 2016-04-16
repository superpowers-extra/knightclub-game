abstract class InteractionBehavior extends Sup.Behavior {
  
  // @hide
  position: Sup.Math.Vector3;
  spritePath: string;
  canShapeShift = false;
  
  awake() {
    Game.interactions.push(this);
  }

  start() {
    this.position = this.actor.getLocalPosition();
    
    this.spritePath = this.actor.getChild("Sprite").spriteRenderer.getSprite().path;
    if (this.spritePath === PlayerBehavior.spritePath) this.actor.destroy();
  }

  onDestroy() {
    const index = Game.interactions.indexOf(this);
    if (index !== -1) Game.interactions.splice(index, 1);
  }

  finish() {
    Game.player.activeInteraction = null;
  }

  abstract action();
}
