class BridgeButtonBehavior extends CharacterBehavior {
  lowered = false;
  isMoving = false;

  bridgePart1: Sup.Actor;
  bridgePart2: Sup.Actor;
  
  tryShapeShift() { return false; }

  awake() {
    super.awake();
    
    this.bridgePart1 = Sup.getActor("Scenery").getChild("Bridge Part 1");
    this.bridgePart2 = Sup.getActor("Scenery").getChild("Bridge Part 2");
    
    if (Game.quest.mainObjective !== Game.Objectives.getMyBodyBack || Game.quest.currentGoal > Game.Goals.lowerTheBridge) {
      this.setBridgeLowered(true);
    }
  }

  start() {
    if (Game.quest.currentGoal === Game.Goals.goToTheCastle) {
      Game.player.startInteraction(this);
    }
  }

  action() {
    if (this.activeLines == null) {
      if (Game.quest.currentGoal === Game.Goals.goToTheCastle) {
        this.activeLines = [
          [ "Horace", "castleBridge.lowerTheBridge" ]
        ];
      } else if (Game.quest.currentGoal < Game.Goals.lowerTheBridge) {
        this.activeLines = [
          [ "Horace", "castleBridge.button.notQualified" ]
        ];
      } else if (Game.quest.currentGoal === Game.Goals.lowerTheBridge) {
        if (Game.playerPersonId === "Nightclub/Bridge Operator") {
          Sup.Audio.playSound("SFX/Bridge/Button");
          this.activeLines = [
            [ "Horace", "castleBridge.button.letsDoThis" ]
          ];
        } else {
          this.activeLines = [
            [ "Horace", "castleBridge.button.findBridgeOperator" ]
          ];
        }
      } else {
        Sup.Audio.playSound("SFX/Bridge/Button");
        this.activeLines = [
          [ "Horace", "castleBridge.button.thisIsFun" ]
        ]
      }
    }
    
    super.action();
  }

  finish() {
    if (Game.quest.currentGoal === Game.Goals.goToTheCastle) {
      Game.questManager.setCurrentGoal(Game.Goals.lowerTheBridge);
    } else if (Game.playerPersonId === "Nightclub/Bridge Operator" || Game.quest.currentGoal > Game.Goals.lowerTheBridge) {
      /*if (Game.quest.currentGoal === Game.Goals.lowerTheBridge) {
        this.moveBridge(true);
      } else {*/
      if (!this.isMoving) this.moveBridge(!this.lowered);
      // }
    }
    
    this.activeLines = null;
    super.finish();
  }

  moveBridge(lower: boolean) {
    if (lower === this.lowered) return;
    
    this.isMoving = true;
    if (!lower) this.setBridgeLowered(false);
    
    Sup.Audio.playSound("SFX/Bridge/Lower");
    new Sup.Tween(this.actor, { angle: lower ? BridgeButtonBehavior.liftedBridgeAngle : BridgeButtonBehavior.loweredBridgeAngle })
      .to({ angle: lower ? BridgeButtonBehavior.loweredBridgeAngle : BridgeButtonBehavior.liftedBridgeAngle }, 2000)
      .easing(TWEEN.Easing.Bounce.Out)
      .onUpdate((state) => {
        this.bridgePart1.setLocalEulerX(state.angle);
        this.bridgePart2.setLocalEulerX(state.angle);
      })
      .onComplete(() => {
        if (lower) this.setBridgeLowered(true);
        this.isMoving = false;

        if (Game.quest.currentGoal === Game.Goals.lowerTheBridge) {
          Game.questManager.setCurrentGoal(Game.Goals.enterTheCastle);
        }
      })
      .start();
  }

  setBridgeLowered(lowered: boolean) {
    this.lowered = lowered;

    Sup.getActor("Physics").getChild("Bridge").cannonBody.body.position.y = lowered ? -5 : 1;
    this.bridgePart1.setLocalEulerX(lowered ? BridgeButtonBehavior.loweredBridgeAngle : BridgeButtonBehavior.liftedBridgeAngle);
    this.bridgePart2.setLocalEulerX(lowered ? BridgeButtonBehavior.loweredBridgeAngle : BridgeButtonBehavior.liftedBridgeAngle);
  }
}
Sup.registerBehavior(BridgeButtonBehavior);

namespace BridgeButtonBehavior {
  export const loweredBridgeAngle = -Math.PI / 2;
  export const liftedBridgeAngle = -Math.PI / 4;
}
