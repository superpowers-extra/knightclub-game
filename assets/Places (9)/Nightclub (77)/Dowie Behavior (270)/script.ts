class DowieBehavior extends CharacterBehavior {
  action() {
    if (this.activeLines == null) {
      if (Game.playerPersonId !== "Fitness Club/Chiome") {
        this.activeLines = [
          [ Game.playerPersonId, "nightclub.arentYouThatGuy" ],
          [ "Nightclub/Dowie", "nightclub.dowie" ]
        ];
      } else {
        this.spriteActor.spriteRenderer.setAnimation("Smile");
        this.activeLines = [
          [ Game.playerPersonId, "nightclub.supDowie" ],
          [ "Nightclub/Dowie", "nightclub.supChiome" ],
          [ Game.playerPersonId, "nightclub.supDowie2" ],
          [ "Nightclub/Dowie", "nightclub.supChiome2" ]
        ];
      }
    }
    
    super.action();
  }
  
  finish() {
    this.spriteActor.spriteRenderer.setAnimation("Animation");
    super.finish();
  }
}
Sup.registerBehavior(DowieBehavior);
