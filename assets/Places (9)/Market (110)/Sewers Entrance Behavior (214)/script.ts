class SewersEntranceBehavior extends CharacterBehavior {
  
  static opened = false;
  
  hasCollision = false;
  
  awake() {
    if (Game.quest.currentGoal >= Game.Goals.findAnotherWayIntoTheCastle) {
      Sup.getActor("Scenery").getChild("Stand").destroy();
      Sup.getActor("Physics").getChild("Stand").destroy();
      Sup.getActor("Fish Guy").destroy();
      Sup.getActor("Fish Girl").destroy();
    }
    
    if (SewersEntranceBehavior.opened) {
      this.open();
      this.destroy();
      return;
    }
    
    super.awake();
  }

  action() {
    if (this.activeLines == null) {
      if (Game.playerPersonId === "Fitness Club/Musclor") {
        this.activeLines = [
          [ Game.playerPersonId, "market.sewers.open" ],
          [ Game.playerPersonId, "market.sewers.windy" ],
        ];
        Sup.Audio.playSound("SFX/Sewers/Bending Bars");
      } else if (Game.quest.currentGoal === Game.Goals.findAnotherWayIntoTheCastle) {
        this.activeLines = [
          [ Game.playerPersonId, "market.sewers.sign" ],
          [ Game.playerPersonId, "market.sewers.wontOpen" ]
        ];
      } else {
        this.activeLines = [ [ Game.playerPersonId, "market.sewers.wontOpen" ] ];
      }
    }
    
    if (Game.playerPersonId === "Fitness Club/Musclor" && this.activeLineIndex === 0 && Game.dialog.actor.getVisible() && Game.dialog.animatedText.isTextFullyDisplayed()) {
      SewersEntranceBehavior.opened = true;
      this.open();
      Sup.Audio.playSound("SFX/Sewers/Crack Pants");
    }
    
    super.action();
  }

  finish() {
    super.finish();
    this.activeLines = null;

    if (Game.quest.currentGoal === Game.Goals.findAnotherWayIntoTheCastle) {
      Game.questManager.setCurrentGoal(Game.Goals.throughSewers);
    }
    if (Game.playerPersonId === "Fitness Club/Musclor") {
      this.destroy();
    }
  }

  tryShapeShift() { return false; }

  private open() {
    this.actor.getChild("Model").modelRenderer.setModel("Places/Market/Map/Door Open");
    this.actor.getChild("Physics").destroy();
  }
}
Sup.registerBehavior(SewersEntranceBehavior);
