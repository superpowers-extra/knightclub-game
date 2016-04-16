class DialogBehavior extends Sup.Behavior {
  animatedText: AnimatedTextBehavior;

  private speaker = "";
  private portraitRenderer: Sup.SpriteRenderer;
  
  awake() {
    Game.dialog = this;

    this.portraitRenderer = this.actor.getChild("Portrait").spriteRenderer;
    this.animatedText = this.actor.getChild("Text").getBehavior(AnimatedTextBehavior);
  }
  
  show(speakerId: string, text: string) {
    this.actor.setVisible(true);
    Game.questManager.setMainObjective("a", "b");
    
    this.speaker = Game.getText(speakerId);
    const portrait = Sup.get(`HUD/Portraits/${speakerId}`, Sup.Sprite, { ignoreMissing: true });
    this.portraitRenderer.setSprite(portrait);

    this.animatedText.setText(`${this.speaker.toUpperCase()}: ${text}`, this.speaker.length + 2);
  }

  hide() {
    this.actor.setVisible(false);
    this.animatedText.clear();
  }
}
Sup.registerBehavior(DialogBehavior);
