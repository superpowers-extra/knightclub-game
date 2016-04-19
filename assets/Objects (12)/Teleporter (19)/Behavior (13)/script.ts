class TeleporterBehavior extends InteractionBehavior {
  isAreaTrigger = true;
  
  action() {
    Game.leavePlace(this.actor.getName(), this.angle);
  }
}
Sup.registerBehavior(TeleporterBehavior);
