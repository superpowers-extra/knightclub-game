class CharacterBehavior extends InteractionBehavior {
  
  name: string;
  lineId: string;
  
  canShapeShift = true;
  isSpeaking = false;
  
  action() {
    if (!this.isSpeaking) {
      this.isSpeaking = true;
      Game.dialog.show(this.name, Game.getText(this.lineId));
    } else {
      this.isSpeaking = false;
      Game.dialog.hide();
      this.finish();
    }
  }
}
Sup.registerBehavior(CharacterBehavior);
