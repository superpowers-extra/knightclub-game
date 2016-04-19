class NightclubBehavior extends InteractionBehavior {
  private textIds: string[];
  private currentText = 0;

  awake() {
    if (Game.quest.currentGoal !== Game.Goals.getInsideNightclub) {
      this.destroy();
      return;
    }
    
    super.awake();
    this.textIds = Game.getTextIds("nightclub.letsGoHome");
  }

  start() {
    Game.player.startInteraction(this);
  }

  action() {
    if (this.currentText >= this.textIds.length) return;
    
    if (!Game.dialog.animatedText.isTextFullyDisplayed()) {
      Game.dialog.animatedText.progressToNextStop();
      return;
    }
    
    if (!Game.dialog.actor.getVisible()) {
      this.currentText = 0;
    } else {
      this.currentText++;
      
      if (this.currentText >= this.textIds.length) {
        Game.dialog.hide();
        this.finish();
        this.destroy();

        Game.questManager.setCurrentGoal(Game.Goals.getSomeFreshAir);
        return;
      }
    }
    
    Game.dialog.show("Horace", this.textIds[this.currentText]);
  }
}
Sup.registerBehavior(NightclubBehavior);
