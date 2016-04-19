class OuthouseDoorBehavior extends CharacterBehavior {
  action() {
    this.activeLines = [
      [ Game.playerPersonId, "TODO" ]
    ];
    
    super.action();
  }
}
Sup.registerBehavior(OuthouseDoorBehavior);
