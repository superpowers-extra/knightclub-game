class HaloBehavior extends Sup.Behavior {
  nightclubTimer = 30;

  awake() {
    this.pulse();
  }

  update() {
    this.nightclubTimer--;
      
    if (this.nightclubTimer === 0) {
      this.pulse();
      this.nightclubTimer = Sup.Math.Random.integer(5, 30);
    }
  }

  pulse() {
    this.actor.spriteRenderer.setColor(Sup.Math.Random.float(0.5, 1), Sup.Math.Random.float(0.5, 1), Sup.Math.Random.float(0.5, 1))
  }
}
Sup.registerBehavior(HaloBehavior);
