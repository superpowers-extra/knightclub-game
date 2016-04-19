class GoToNightClubBehavior extends InteractionBehavior {
  isAreaTrigger = true;
  
  awake() {
    if (Game.quest.currentGoal === Game.Goals.goToNightclub || Game.quest.currentGoal === Game.Goals.getInsideNightclub) {
      super.awake();
    } else {
      this.actor.destroy();
    }
  }

  action() {
    if (Game.player.autoPilotSpeed != null) return;
    
    if (!Game.dialog.actor.getVisible()) {
      Game.dialog.show(Game.playerPersonId, "nightclubStreet.dontWantToGoDowntown");
    } else if (!Game.dialog.animatedText.isTextFullyDisplayed()) {
      Game.dialog.animatedText.progressToNextStop();
    } else {
      Game.dialog.hide();
      Game.player.startAutoPilot(this.actor.getLocalEulerY());
      Sup.setTimeout(300, () => {
        Game.player.stopAutoPilot();
        this.finish();
      });
    }
  }
}
Sup.registerBehavior(GoToNightClubBehavior);
