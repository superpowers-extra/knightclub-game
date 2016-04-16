interface Place {
  place: string;
  target: string;
  angle: number;
}

class TeleporterBehavior extends Sup.Behavior implements Place {
  place: string;
  target: string;
  angle: number;

  width = 1;
  depth = 1;

  // @hide
  position: Sup.Math.Vector3;

  awake() {
    Game.teleporters.push(this);
    this.position = this.actor.getLocalPosition();
    
    // DEBUG
    const markerActor = new Sup.Actor("Marker", this.actor);
    new Sup.SpriteRenderer(markerActor, "Objects/Teleporter/Marker");
    markerActor.moveY(0.1);
    markerActor.setLocalEulerX(Math.PI / 2);
    markerActor.setLocalScale(this.width, this.depth, 1);
  }
}
Sup.registerBehavior(TeleporterBehavior);
