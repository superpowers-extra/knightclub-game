namespace Game {
  export let language = "en";

  export let player: PlayerBehavior;
  export let camera: CameraBehavior;
  
  export let dialog: DialogBehavior;
  export let questManager: QuestManagerBehavior;

  export let quest = {
    mainObjectiveId: null as string,
    currentGoalId: null as string
  };

  export let teleporters: TeleporterBehavior[] = [];
  export let interactions: InteractionBehavior[] = [];

  export function start() {
    quest.mainObjectiveId = "nightTimeFun";
    quest.currentGoalId = "goToNightclub";

    enterPlace({ place: "Room 1", target: "Start", angle: null });
  }
  
  export function leavePlace(targetPlace: Place) {
    player.startAutoPilot(targetPlace.angle);

    Fade.start(Fade.Direction.Out, { duration: 150 }, () => { enterPlace(targetPlace); });
  }

  export function enterPlace(targetPlace: Place) {
    teleporters.length = 0;
    interactions.length = 0;

    Sup.loadScene(`Places/${targetPlace.place}/Prefab`);
    
    const hud = Sup.appendScene("HUD/Prefab")[0];
    hud.setLocalPosition(0, 1000, 0);
    
    camera.actor.addBehavior(PedestriansSpawnerBehavior);
    
    const playerActor = Sup.appendScene("Player/Prefab", Sup.getActor("Main"))[0];
    const targetPos = Sup.getActor("Targets").getChild(targetPlace.target).getLocalPosition();
    playerActor.setLocalPosition(targetPos);
    if (targetPlace.angle != null) player.startAutoPilot(targetPlace.angle);
    
    Fade.start(Fade.Direction.In, { duration: 150 }, () => { player.stopAutoPilot(); });
  }
  
  export function getText(id: string) {
    const text = Text[Game.language][id];
    if (text == null) return id;
    return text;
  }
}

const world = Sup.Cannon.getWorld();
world.gravity.set(0, -100, 0);
world.defaultContactMaterial.friction = 0.1;

const groundBody = new CANNON.Body();
groundBody.position.set(0, -0.5, 0);
groundBody.addShape(new CANNON.Box(new CANNON.Vec3(1000, 0.5, 1000)));
groundBody.material = world.defaultMaterial;
world.addBody(groundBody);
