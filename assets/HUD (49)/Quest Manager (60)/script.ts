class QuestManagerBehavior extends Sup.Behavior {
  private mainObjective: Sup.TextRenderer;
  private currentGoal: Sup.TextRenderer;
  
  awake() {
    Game.questManager = this;
    
    this.mainObjective = this.actor.getChild("Main Objective").textRenderer;
    this.currentGoal = this.actor.getChild("Current Goal").textRenderer;

    this.setup();
  }

  setMainObjective(mainObjectiveId: string, currentGoalId: string) {
    Game.quest.mainObjectiveId = mainObjectiveId;
    Game.quest.currentGoalId = currentGoalId;
    this.setup();
    this.currentGoal.setOpacity(0);
    this.animateMainObjective(() => { this.animateCurrentGoal(); });
    // TODO: Play sound
  }

  setCurrentGoal(currentGoalId: string) {
    Game.quest.currentGoalId = currentGoalId;
    this.animateCurrentGoal();
    // TODO: Play sound
  }

  private animateMainObjective(callback: Function) {
    new Sup.Tween(this.actor, { opacity: 0, x: 2 })
      .to({ opacity: 1, x: 0 }, 1000)
      .easing(TWEEN.Easing.Bounce.Out)
      .onUpdate((state) => {
        this.mainObjective.setOpacity(state.opacity).actor.setLocalX(state.x);
      }).onComplete(() => { if (callback != null) callback(); }).start();
  }

  private animateCurrentGoal(callback?: Function) {
    new Sup.Tween(this.actor, { opacity: 0, y: -2 })
      .to({ opacity: 1, y: -1 }, 1000)
      .easing(TWEEN.Easing.Quintic.Out)
      .onUpdate((state) => {
        this.currentGoal.setOpacity(state.opacity).actor.setLocalY(state.y);
      }).onComplete(() => { if (callback != null) callback(); }).start();
  }

  private setup() {
    const mainObjectiveText = Game.quest.mainObjectiveId != null ? Game.getText(Game.quest.mainObjectiveId) : "";
    this.mainObjective.setText(mainObjectiveText);

    const currentGoalText = Game.quest.currentGoalId != null ? Game.getText(Game.quest.currentGoalId) : "";
    this.currentGoal.setText(currentGoalText);
  }
}
Sup.registerBehavior(QuestManagerBehavior);
