class BouncerBehavior extends CharacterBehavior {
  granted = false;
  
  action() {
    if (this.activeLines == null) {
      this.granted = false;
  
      if (Game.playerPersonId === "Horace") {
        this.activeLines = [ [ this.personId, "nightclubStreet.entrance.deniedHorace" ] ];
        if (!Game.canShapeShift) {
          this.activeLines.push([ "Horace", "nightclubStreet.entrance.shapeShiftTutorial" ]);
          this.activeLines.push([ "Horace", "nightclubStreet.entrance.shapeShiftTutorial2" ]);
        }
        
      } else if (BouncerBehavior.beautifulPeopleIds.indexOf(Game.playerPersonId) === -1) {
        if (Game.playerPersonId === "Nightclub Street/Coincoin") {
          this.activeLines = [
            [ this.personId, "nightclubStreet.entrance.deniedDuck" ],
            [ Game.playerPersonId, "nightclubStreet.entrance.deniedRude" ],
          ];
        } else {
          this.activeLines = [ [ this.personId, "nightclubStreet.entrance.deniedGeneric" ] ];
        }
      } else {
        this.activeLines = [ [ this.personId, Sup.Math.Random.sample(Game.getTextIds("nightclubStreet.entrance.granted")) ] ];
        this.granted = true;
      }
    }
    
    super.action();
  }

  tryShapeShift() {
    this.activeLines = [
      [ this.personId, "nightclubStreet.entrance.noShapeShift" ],
      [ "Horace", "nightclubStreet.entrance.findSomeoneElse" ]
    ];
    Game.player.startInteraction(this);
    return false;
  }

  finish() {
    super.finish();
    this.activeLines = null;
    
    if (this.granted) {
      Sup.getActor("Scenery").getChild("Door").getBehavior(NightclubDoorBehavior).open();
      Sup.Audio.playSound("SFX/Nightclub Door");
    }
    
    if (!Game.canShapeShift) {
      Game.canShapeShift = true;
      Game.questManager.setCurrentGoal(Game.Goals.getInsideNightclub);
    }
  }
}
Sup.registerBehavior(BouncerBehavior);

namespace BouncerBehavior {
  export const beautifulPeopleIds = [
    "Nightclub Street/Beauty 1",
    "Nightclub Street/Beauty 2",
    "Nightclub/Bridge Operator",
    "Fitness Club/Chiome"
  ];
}
