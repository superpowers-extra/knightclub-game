class CharacterFadeOutBehavior extends Sup.Behavior {
  
  private isFadingOut = false;
  private opacity = 1;
  private direction = 1;
  
  awake() {
    const position = this.actor.getLocalPosition();
    if (position.x < Game.player.position.x) this.direction = -1;
    
    Sup.setTimeout(500, () => {
      this.actor.spriteRenderer.setHorizontalFlip(true);
      Sup.setTimeout(500, () => {
        this.actor.spriteRenderer.setHorizontalFlip(false);
        Sup.setTimeout(500, () => {
          this.actor.spriteRenderer.setHorizontalFlip(this.direction < 0);
          this.isFadingOut = true;
        });
      });
    });
  }

  update() {
    if (!this.isFadingOut) return;
    
    this.actor.moveLocalX(this.direction * 0.01);
    this.opacity = Sup.Math.lerp(this.opacity, 0, 0.05);
    this.actor.spriteRenderer.setOpacity(this.opacity);
    if (this.opacity < 0.01) {
      this.actor.destroy();
    }
  }
}
Sup.registerBehavior(CharacterFadeOutBehavior);
