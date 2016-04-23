namespace Game {
  export let language = "en";

  export let player: PlayerBehavior;
  export let playerPersonId = "Horace";
  export let dropBodyLocation: {
    place: string;
    position: Sup.Math.Vector3;
  }
  export let canShapeShift = false;
  
  export let camera: CameraBehavior;
  export let currentPlace = "Start";
  
  export let dialog: DialogBehavior;
  export let questManager: QuestManagerBehavior;
  
  const musicVolume = 0.4;
  let music: Sup.Audio.SoundPlayer;

  export enum Objectives {
    nightTimeFun,
    locateMyBody,
    intoTheDungeon
  };
  
  export enum Goals {
    goToNightclub,
    getInsideNightclub,
    // danceItUp,
    getSomeFreshAir,

    goToTheCastle,
    lowerTheBridge,
    enterTheCastle,
    charmCastleGuard,
    findAnotherWayIntoTheCastle,
    throughSewers,
    
    breakOutOfJail,
    getTheWarden,
    freeHorace
  };
  
  export let quest = {
    mainObjective: null as Objectives,
    currentGoal: null as Goals
  };

  export let interactions: InteractionBehavior[] = [];

  export function start() {
    quest.mainObjective = null;
    quest.currentGoal = null;

    enterPlace("Town Entrance");
  }
  
  export function leavePlace(nextPlace: string, angle: number) {
    player.startAutoPilot(angle, nextPlace === "Market" && currentPlace === "Sewers");
    
    if (getMusic(nextPlace) !== getMusic(currentPlace)) {
      new Sup.Tween(Game.camera.actor, { volume: musicVolume })
        .to({ volume: 0 }, 250)
        .onUpdate((object) => { music.setVolume(object.volume); })
        .onComplete(() => { music.stop(); })
        .start();
    }
    
    Fade.start(Fade.Direction.Out, { duration: 300 }, () => { enterPlace(nextPlace); });
  }

  export function enterPlace(targetPlace: string) {
    interactions.length = 0;
    
    const oldPlace = currentPlace;
    currentPlace = targetPlace;
    
    Sup.loadScene(`Places/${currentPlace}/Scene`);
    
    const hud = Sup.appendScene("HUD/Prefab")[0];
    hud.setLocalPosition(0, 1000, 0);
    
    if (music == null || (getMusic(currentPlace) !== getMusic(oldPlace))) {
      music = Sup.Audio.playSound(getMusic(currentPlace), 0, { loop: true });
      new Sup.Tween(Game.camera.actor, { volume: 0 })
        .to({ volume: musicVolume }, 250)
        .onUpdate((object) => { music.setVolume(object.volume); })
        .start();
    }
    
    camera.actor.addBehavior(PedestriansSpawnerBehavior);
    
    if (quest.currentGoal === Goals.getInsideNightclub && dropBodyLocation != null && dropBodyLocation.place === currentPlace) {
      placeOldBody();
    }
    
    const playerActor = Sup.appendScene("Player/Prefab", Sup.getActor("Main"))[0];
    
    if (oldPlace === "Start") {
      playerActor.setLocalPosition(Sup.getActor("Start").getLocalPosition());
    } else {
      const target = Sup.getActor("Teleporters").getChild(oldPlace).getBehavior(TeleporterBehavior);
      const angle = target.angle + Math.PI;
      playerActor.setLocalPosition(target.position).moveLocal(Math.sin(angle) * target.depth * 0.5, 0, Math.cos(angle) * target.depth * 0.5);
      player.startAutoPilot(angle);
    }
    
    Fade.start(Fade.Direction.In, { duration: 300 }, () => { player.stopAutoPilot(); });
  }
  
  export function getText(id: string, language = Game.language): string {
    const parts = id.split(".");

    let value = Text[language];
    for (const part of parts) {
      if (value == null) break;
      value = value[part];
    }

    if (value == null && language !== "en") value = getText(id, "en");
    if (value == null) value = id;

    return value;
  }
  
  export function getTextIds(baseId: string): string[] {
    const res = getText(baseId);
    if (typeof res === "string") return [ baseId ];

    const list = [];
    for (let i = 0; i < res.length; i++) list.push(`${baseId}.${i}`);
    return list;
  }
  
  export function placeOldBody() {
    const oldBodyActor = new Sup.Actor("Old Body");
    oldBodyActor.setLocalPosition(dropBodyLocation.position);
    const spriteActor = new Sup.Actor("Sprite", oldBodyActor);
    new Sup.SpriteRenderer(spriteActor, "Characters/Horace");
    oldBodyActor.addBehavior(OldBodyBehavior);
  }
  
  export function getMusic(place: string) {
    const asset = Sup.get(`Musics/${place}`, Sup.Sound, { ignoreMissing: true });
    if (asset != null) return asset;
    else return Sup.get(`Musics/Main`, Sup.Sound);
  }
  
  export function stopMusic() {
    music.stop();
  }
}

const world = Sup.Cannon.getWorld();
world.gravity.set(0, -100, 0);

const groundBody = new CANNON.Body();
groundBody.position.set(0, -0.5, 0);
groundBody.addShape(new CANNON.Box(new CANNON.Vec3(1000, 0.5, 1000)));
groundBody.material = world.defaultMaterial;
world.addBody(groundBody);
