class LostCharacterBehavior extends CharacterBehavior {
  
  private previousLineId: string;
  
  awake() {
    super.awake(); 
    this.selectLineId();
  }

  finish() {
    super.finish();
    this.selectLineId();
  }

  selectLineId() {
    let lineId: string;
    while (lineId == null || lineId === this.previousLineId)
      lineId = Sup.Math.Random.sample(Game.getTextIds("pedestriansLost"));
    
    this.activeLines = [ [ this.personId, lineId ] ];
    this.previousLineId = lineId;
  }
}
Sup.registerBehavior(LostCharacterBehavior);
