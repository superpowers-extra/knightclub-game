class SingleLineBehavior extends CharacterBehavior {
  lineId: string;
  noShapeShiftLineId: string;
  
  awake() {
    super.awake();
    
    this.resetActiveLines();
  }

  resetActiveLines() {
    const dialog = this.lineId.split(";");
    this.activeLines = [];
    for (let i = 0; i < dialog.length; i++) {
      const lineGroup = dialog[i];
      if (lineGroup.length === 0) continue;
      const textIds = Game.getTextIds(lineGroup);
      for (const textId of textIds) this.activeLines.push([ (i % 2) === 0 ? this.personId : Game.playerPersonId, Game.getText(textId) ]);
    }
  }

  tryShapeShift() {
    if (this.noShapeShiftLineId == null) return true;
    
    const oldActiveLines = this.activeLines;
    this.activeLines = [ [ this.personId, this.noShapeShiftLineId ] ];
    super.action();
    
    return false;
  }

  finish() {
    this.resetActiveLines();
    super.finish();
  }
}
Sup.registerBehavior(SingleLineBehavior);
