class JailedHoraceBehavior extends CharacterBehavior {
  action() {
    this.activeLines = [
      [ Game.playerPersonId, "TODO" ]
    ];
    
    super.action();
  }
}
Sup.registerBehavior(JailedHoraceBehavior);
