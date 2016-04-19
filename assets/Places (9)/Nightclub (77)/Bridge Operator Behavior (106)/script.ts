class BridgeOperatorBehavior extends CharacterBehavior {
  awake() {
    super.awake();

    if (Game.quest.currentGoal < Game.Goals.lowerTheBridge) {
      this.activeLines = [
        [ Game.playerPersonId, "nightclub.bridgeOperator.early.hi" ],
        [ this.personId, "nightclub.bridgeOperator.early.hi2" ],
        [ Game.playerPersonId, "nightclub.bridgeOperator.early.so" ],
        [ this.personId, "nightclub.bridgeOperator.early.yup" ],
      ];
    } else if (Game.quest.currentGoal === Game.Goals.lowerTheBridge) {
      this.activeLines = [
        [ Game.playerPersonId, "nightclub.bridgeOperator.areYou" ],
        [ this.personId, "nightclub.bridgeOperator.yes" ],
        [ Game.playerPersonId, "nightclub.bridgeOperator.cool" ],
        [ this.personId, "nightclub.bridgeOperator.whatever" ],
      ];
    } else {
      this.activeLines = [
        [ Game.playerPersonId, "nightclub.bridgeOperator.later.hi" ],
        [ this.personId, "nightclub.bridgeOperator.later.notYou" ],
        [ Game.playerPersonId, "nightclub.bridgeOperator.later.iWouldntKnow" ],
        [ "Horace", "nightclub.bridgeOperator.later.awkward" ],
      ];
    }
  }
}
Sup.registerBehavior(BridgeOperatorBehavior);
