class IntroBehavior extends InteractionBehavior {
  private textIds: string[];
  private currentText = 0;
  
  awake() {
    if (Game.quest.mainObjective != null) {
      this.destroy();
      return;
    }
    
    super.awake();
    this.textIds = Game.getTextIds("townEntrance.intro");
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

        Game.questManager.setMainObjective(Game.Objectives.nightTimeFun, Game.Goals.goToNightclub);
        return;
      }
    }
    
    Game.dialog.show("Horace", this.textIds[this.currentText]);
  }
}
Sup.registerBehavior(IntroBehavior);
