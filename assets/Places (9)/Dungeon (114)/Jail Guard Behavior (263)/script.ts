class JailGuardBehavior extends CharacterBehavior {
  action() {
    if (Game.playerPersonId === "Castle Courtyard/Warden") {
      this.activeLines = [
        [ "Dungeon/Jail Guard", "dungeon.guard.open.0" ],
        [ Game.playerPersonId,  "dungeon.guard.open.1" ],
        [ "Dungeon/Jail Guard", "dungeon.guard.open.2" ],
        [ Game.playerPersonId,  "dungeon.guard.open.3" ],
        [ "Dungeon/Jail Guard", "dungeon.guard.open.4" ],
        [ Game.playerPersonId,  "dungeon.guard.open.5" ],
        [ "Dungeon/Jail Guard", "dungeon.guard.open.6" ],
        [ Game.playerPersonId,  "dungeon.guard.open.7" ],
        [ "Dungeon/Jail Guard", "dungeon.guard.open.8" ],
        [ Game.playerPersonId,  "dungeon.guard.open.9" ],
      ];
    } else {
      this.activeLines = [
        [ Game.playerPersonId,  "dungeon.guard.nope.0" ],
        [ "Dungeon/Jail Guard", "dungeon.guard.nope.1" ],
        [ Game.playerPersonId,  "dungeon.guard.nope.2" ],
        [ "Dungeon/Jail Guard", "dungeon.guard.nope.3" ],
      ];
    }
    
    super.action();
  }
  
  finish() {
    super.finish();

    if (Game.playerPersonId === "Castle Courtyard/Warden") {
      Sup.getActor("Physics").getChild("Bars").destroy();

      // TODO: Play open animation on model instead?
      Sup.getActor("Scenery").getChild("Bars").destroy();
      
      // TODO: Play sound effect
    } else if (Game.quest.currentGoal === Game.Goals.breakOutOfJail) {
      Game.questManager.setCurrentGoal(Game.Goals.getTheWarden);
    }
  }
}
Sup.registerBehavior(JailGuardBehavior);
