const pedestrianSpriteNames = Sup.get("Objects/Characters/Pedestrians/Sprites", Sup.Folder).children;

class PedestriansSpawnerBehavior extends Sup.Behavior {
  
  nextPedestrianTimeout: number;
  
  awake() {
    if (Sup.getActor("Pedestrian Waypoints") == null) {
      this.destroy();
      return;
    }
    this.scheduleNextPedestrian();
  }

  onDestroy() {
    if (this.nextPedestrianTimeout != null) Sup.clearTimeout(this.nextPedestrianTimeout);
  }
  
  scheduleNextPedestrian() {
    const delay = Sup.Math.Random.integer(6, 15) * 1000;
    this.nextPedestrianTimeout = Sup.setTimeout(delay, () => {
      const pedestrianActor = Sup.appendScene("Objects/Characters/Pedestrians/Prefab")[0];
      const position = Game.teleporters[0].position;
      pedestrianActor.setLocalPosition(position);

      let spritePath: string;
      while (spritePath == null || spritePath === PlayerBehavior.spritePath)
        spritePath = `Objects/Characters/Pedestrians/Sprites/${Sup.Math.Random.sample(pedestrianSpriteNames)}`;
      pedestrianActor.getChild("Sprite").spriteRenderer.setSprite(spritePath);
      
      this.scheduleNextPedestrian();
    });
  }
}
Sup.registerBehavior(PedestriansSpawnerBehavior);
