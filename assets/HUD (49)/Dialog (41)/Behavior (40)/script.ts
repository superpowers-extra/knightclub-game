class DialogBehavior extends Sup.Behavior {
  animatedText: AnimatedTextBehavior;

  private speaker = "";
  private portraitRenderer: Sup.SpriteRenderer;
  
  awake() {
    Game.dialog = this;

    this.portraitRenderer = this.actor.getChild("Portrait").spriteRenderer;
    this.animatedText = this.actor.getChild("Text").getBehavior(AnimatedTextBehavior);
  }
  
  show(speakerId: string, textId: string) {
    this.actor.setVisible(true);
    
    let speakerNameId = speakerId.slice(speakerId.lastIndexOf("/") + 1);
    if (Text[Game.language].characters[speakerNameId] == null) speakerNameId = "Some alien";
    this.speaker = Game.getText(`characters.${speakerNameId}`);
    const portrait = Sup.get(`Characters/${speakerId}`, Sup.Sprite, { ignoreMissing: true });
    this.portraitRenderer.setSprite(portrait);

    this.animatedText.setText(`${this.speaker.toUpperCase()}: ${Game.getText(textId)}`, this.speaker.length + 2);
  }

  hide() {
    this.actor.setVisible(false);
    this.animatedText.clear();
  }
}
Sup.registerBehavior(DialogBehavior);
