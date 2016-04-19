class QuestManagerBehavior extends Sup.Behavior {
  private mainObjective: Sup.TextRenderer;
  private currentGoal: Sup.TextRenderer;
  
  awake() {
    Game.questManager = this;
    
    this.mainObjective = this.actor.getChild("Main Objective").textRenderer;
    this.currentGoal = this.actor.getChild("Current Goal").textRenderer;

    this.setup();
  }

  setMainObjective(mainObjective: Game.Objectives, currentGoal: Game.Goals, callback?: Function) {
    Game.quest.mainObjective = mainObjective;
    Game.quest.currentGoal = currentGoal;
    this.setup();
    this.currentGoal.setOpacity(0);
    this.animateMainObjective(() => {
      this.animateCurrentGoal(() => {
         if (callback != null) callback();
      });
    });
    Sup.Audio.playSound("SFX/Quest/Objective");
  }

  setCurrentGoal(currentGoal: Game.Goals) {
    Game.quest.currentGoal = currentGoal;
    this.setup();
    this.animateCurrentGoal();
    Sup.Audio.playSound("SFX/Quest/Goal");
  }

  private animateMainObjective(callback: Function) {
    new Sup.Tween(this.actor, { opacity: 0, x: 2.5 })
      .to({ opacity: 1, x: 0.5 }, 1000)
      .easing(TWEEN.Easing.Bounce.Out)
      .onUpdate((state) => {
        this.mainObjective.setOpacity(state.opacity).actor.setLocalX(state.x);
      }).onComplete(() => { if (callback != null) callback(); }).start();
  }

  private animateCurrentGoal(callback?: Function) {
    new Sup.Tween(this.actor, { opacity: 0, y: -2.25 })
      .to({ opacity: 1, y: -1.25 }, 1000)
      .easing(TWEEN.Easing.Quintic.Out)
      .onUpdate((state) => {
        this.currentGoal.setOpacity(state.opacity).actor.setLocalY(state.y);
      }).onComplete(() => { if (callback != null) callback(); }).start();
  }

  private setup() {
    const mainObjectiveText = Game.quest.mainObjective != null ? Game.getText(`objectives.${Game.Objectives[Game.quest.mainObjective]}`) : "";
    this.mainObjective.setText(mainObjectiveText.toUpperCase());

    const currentGoalText = Game.quest.currentGoal != null ? Game.getText(`goals.${Game.Goals[Game.quest.currentGoal]}`) : "";
    this.currentGoal.setText(currentGoalText);
  }
}
Sup.registerBehavior(QuestManagerBehavior);
