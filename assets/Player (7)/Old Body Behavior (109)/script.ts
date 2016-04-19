class OldBodyBehavior extends CharacterBehavior {
  
  hasCollision = false;
  
  awake() {
    super.awake();
    this.activeLines = [ [ "Horace", "nightclubStreet.helloOldBody" ] ];
  }
}
Sup.registerBehavior(OldBodyBehavior);
