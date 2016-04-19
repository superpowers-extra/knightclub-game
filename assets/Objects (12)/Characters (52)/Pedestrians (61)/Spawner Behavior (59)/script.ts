const pedestrianPersonIds = Sup.get("Characters/Pedestrians", Sup.Folder).children;
let i = 0;
while (i < pedestrianPersonIds.length) {
  const personId = pedestrianPersonIds[i];
  if (personId.indexOf("Portrait") !== -1) {
    pedestrianPersonIds.splice(i, 1);
  } else {
    i++;
  }
}

class PedestriansSpawnerBehavior extends Sup.Behavior {
  
  nextPedestrianTimeout: number;
  
  awake() {
    if (Sup.getActor("Pedestrian Paths") == null) {
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
      const pedestrianActor = new Sup.Actor("Pedestrian");

      let personId: string;
      while (personId == null || personId === Game.playerPersonId)
        personId = `Pedestrians/${Sup.Math.Random.sample(pedestrianPersonIds)}`;
      
      const spriteActor = new Sup.Actor("Sprite", pedestrianActor);
      new Sup.SpriteRenderer(spriteActor, `Characters/${personId}`);
      pedestrianActor.addBehavior(PedestrianBehavior);
      
      this.scheduleNextPedestrian();
    });
  }
}
Sup.registerBehavior(PedestriansSpawnerBehavior);
