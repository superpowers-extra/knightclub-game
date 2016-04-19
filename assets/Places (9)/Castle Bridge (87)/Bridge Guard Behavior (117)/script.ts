class BridgeGuardBehavior extends CharacterBehavior {
  
  action() {
    if (this.activeLines == null) {
      if (Game.quest.currentGoal === Game.Goals.enterTheCastle) {
        this.activeLines = [
          [ this.personId, "castleBridge.guard.busy" ],
          [ "Horace", "castleBridge.guard.shouldCharm" ]
        ];
        
      } else if (Game.playerPersonId === "Market/Charming Girl") {
        Sup.Audio.playSound("SFX/Flirt");
        this.activeLines = [
          [ Game.playerPersonId, "castleBridge.guard.tryCharm" ],
          [ this.personId, "castleBridge.guard.charmFail" ],
          [ "Horace", "castleBridge.guard.otherWay" ]
        ];
        
      } else {
        this.activeLines = [
          [ Game.playerPersonId, "castleBridge.guard.tryCharmNope" ],
          [ this.personId, "castleBridge.guard.charmNope" ],
          [ Game.playerPersonId, "castleBridge.guard.tryCharmNope2" ],
          [ this.personId, "castleBridge.guard.charmNope2" ],
          [ "Horace", "castleBridge.guard.notHisType" ],
        ];
      }
    }
    
    super.action();
  }
  
  tryShapeShift() {
    this.activeLines = [
      [ this.personId, "castleBridge.guard.noShapeShift" ]
    ];
    Game.player.startInteraction(this);
    return false;
  }

  finish() {
    super.finish();
    this.activeLines = null;
    
    if (Game.quest.currentGoal === Game.Goals.enterTheCastle) {
      Game.questManager.setCurrentGoal(Game.Goals.charmCastleGuard);
      
    } else if (Game.quest.currentGoal === Game.Goals.charmCastleGuard && Game.playerPersonId === "Market/Charming Girl") {
      Game.questManager.setCurrentGoal(Game.Goals.findAnotherWayIntoTheCastle);
    }
  }
}
Sup.registerBehavior(BridgeGuardBehavior);
