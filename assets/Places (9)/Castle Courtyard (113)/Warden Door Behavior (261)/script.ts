class WardenDoorBehavior extends CharacterBehavior {
  
  awake() {
    super.awake();

    if (Game.quest.currentGoal === Game.Goals.throughSewers) {
      Game.questManager.setMainObjective(Game.Objectives.intoTheDungeon, Game.Goals.breakOutOfJail);
    }
  }
  
  action() {
    this.activeLines = [
      [ Game.playerPersonId, "TODO" ]
    ];
    
    super.action();
  }
}
Sup.registerBehavior(WardenDoorBehavior);
