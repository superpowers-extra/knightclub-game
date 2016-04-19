class RandomLineBehavior extends CharacterBehavior {
  lineId: string;
  
  action() {
    this.activeLines = [ [ this.personId, Sup.Math.Random.sample(Game.getTextIds(this.lineId)) ] ];
    super.action();
  }
}
Sup.registerBehavior(RandomLineBehavior);
