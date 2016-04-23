const playerMaterial = new CANNON.Material("playerMaterial");

const contactMaterial = new CANNON.ContactMaterial(playerMaterial, world.defaultMaterial, {
  friction: 0,
  restitution: 0,
  contactEquationStiffness: 1e8,
  contactEquationRelaxation: 3
});
world.addContactMaterial(contactMaterial);

type Interaction = { action: Function; };

class PlayerBehavior extends Sup.Behavior {
  position: Sup.Math.Vector3;
  private spriteActor: Sup.Actor;

  activeInteraction: Interaction;

  private interactionActor: Sup.Actor;

  autoPilotSpeed: CANNON.Vec3;
  private frozen = false;

  private direction = new Sup.Math.Vector3();
  private canJump = false;

  footstepPlayer: Sup.Audio.SoundPlayer;

  awake() {
    Game.player = this;
    this.spriteActor = this.actor.getChild("Sprite");
    this.spriteActor.spriteRenderer.setSprite(`Characters/${Game.playerPersonId}`);
    this.interactionActor = this.actor.getChild("Interaction");
    
    //this.footstepPlayer = new Sup.Audio.SoundPlayer("SFX/Footsteps", 0.5);
  }

  start() {
    this.position = this.actor.getLocalPosition();
    this.actor.cannonBody.body.position.copy(this.position as any);

    this.actor.cannonBody.body.material = playerMaterial;
    this.actor.cannonBody.body.addEventListener("collide", (event) => {
      // Only allow jumping if touching the floor
      if (event.contact.ni.y > 0.9) this.canJump = true;
    });
  }

  update() {
    // TEMPORARY CHEAT CODES
    if (Sup.Input.wasKeyJustPressed("NUMPAD0")) {
      Game.playerPersonId = "Horace";
      Game.canShapeShift = true;
      Game.quest.mainObjective = Game.Objectives.nightTimeFun;
      Game.quest.currentGoal = Game.Goals.getInsideNightclub;
      Game.currentPlace = "Town Entrance";
      Game.leavePlace("Nightclub Street", 0);
      return;
    } else if (Sup.Input.wasKeyJustPressed("NUMPAD1")) {
      Game.playerPersonId = "Nightclub/Bridge Operator";
      Game.canShapeShift = true;
      Game.quest.mainObjective = Game.Objectives.locateMyBody;
      Game.quest.currentGoal = Game.Goals.getSomeFreshAir;
      Game.currentPlace = "Nightclub";
      Game.leavePlace("Nightclub Street", 0);
      return;
    } else if (Sup.Input.wasKeyJustPressed("NUMPAD2")) {
      Game.playerPersonId = "Market/Charming Girl";
      Game.canShapeShift = true;
      Game.quest.mainObjective = Game.Objectives.locateMyBody;
      Game.quest.currentGoal = Game.Goals.charmCastleGuard;
      Game.currentPlace = "Nightclub Street";
      Game.leavePlace("Castle Bridge", 0);
      return;
    } else if (Sup.Input.wasKeyJustPressed("NUMPAD3")) {
      Game.playerPersonId = "Market/Charming Girl";
      Game.quest.mainObjective = Game.Objectives.locateMyBody;
      Game.quest.currentGoal = Game.Goals.findAnotherWayIntoTheCastle;
      Game.currentPlace = "Nightclub Street";
      Game.leavePlace("Market", 0);
      return;
    } else if (Sup.Input.wasKeyJustPressed("NUMPAD4")) {
      Game.playerPersonId = "Fitness Club/Musclor";
      Game.canShapeShift = true;
      Game.quest.mainObjective = Game.Objectives.locateMyBody;
      Game.quest.currentGoal = Game.Goals.throughSewers;
      Game.currentPlace = "Sewers";
      Game.leavePlace("Castle Courtyard", 0);
      return;
    } else if (Sup.Input.wasKeyJustPressed("NUMPAD5")) {
      Game.playerPersonId = "Castle Courtyard/Warden";
      Game.canShapeShift = true;
      Game.quest.mainObjective = Game.Objectives.intoTheDungeon;
      Game.quest.currentGoal = Game.Goals.freeHorace;
      Game.currentPlace = "Castle Courtyard";
      Game.leavePlace("Dungeon", 0);
      return;
    }
    
    this.spriteActor.setOrientation(Game.camera.orientation);
    
    if (this.autoPilotSpeed != null) {
      this.actor.cannonBody.body.position.vadd(this.autoPilotSpeed, this.actor.cannonBody.body.position);
      return;
    }
    
    if (this.activeInteraction != null) {
      if (this.wantInteract()) this.activeInteraction.action();
      return;
    }
    
    if (this.frozen) return;
    
    // Position & movement
    this.position.copy(this.actor.cannonBody.body.position);
    
    this.direction.x = 0;
    this.direction.z = 0;

    if (this.goLeft()) {
      this.direction.x = -1;
      this.spriteActor.spriteRenderer.setHorizontalFlip(true);
    } else if (this.goRight()) {
      this.direction.x = 1;
      this.spriteActor.spriteRenderer.setHorizontalFlip(false);
    }

    if (this.goUp()) { this.direction.z = -1; }
    else if (this.goDown()) { this.direction.z = 1; }

    if (this.direction.x !== 0 || this.direction.z !== 0) {
      contactMaterial.friction = 0;
      this.direction.normalize();
      this.actor.cannonBody.body.velocity.x = this.direction.x * PlayerBehavior.speed;
      this.actor.cannonBody.body.velocity.z = this.direction.z * PlayerBehavior.speed;
      this.spriteActor.spriteRenderer.setAnimation("Animation");
      
      /*if (!this.footstepPlayer.isPlaying()) {
        this.footstepPlayer.setPitch(Sup.Math.Random.float(-0.1, 0.1));
        this.footstepPlayer.play();
      }*/
    } else {
      contactMaterial.friction = 0.1;
      this.actor.cannonBody.body.velocity.x = 0;
      this.actor.cannonBody.body.velocity.z = 0;
      this.spriteActor.spriteRenderer.stopAnimation();
    }
    
    this.checkInteractions();
  }

  private checkInteractions() {
    this.interactionActor.setVisible(false);
    
    let closestInteractionDistance = Infinity;
    let closestInteraction: InteractionBehavior;
    
    const flipped = this.spriteActor.spriteRenderer.getHorizontalFlip();

    for (const interaction of Game.interactions) {
      if (interaction.isAreaTrigger) {
        const localZ = this.position.z - interaction.position.z;
        const localX = this.position.x - interaction.position.x;
        
        const rotZ = Math.cos(-interaction.angle) * localZ - Math.sin(-interaction.angle) * localX;
        const rotX = Math.sin(-interaction.angle) * localZ + Math.cos(-interaction.angle) * localX;
        
        if (Math.abs(rotZ) < interaction.depth / 2 && Math.abs(rotX) < interaction.width / 2) {
          this.startInteraction(interaction);
          return;
        }

      } else {      
        if (Math.abs(interaction.position.z - this.position.z) < PlayerBehavior.minInteractionDistance / 2) {
          if (interaction.position.x > this.position.x && flipped) continue;
          if (interaction.position.x < this.position.x && !flipped) continue;
        }

        const distance = this.position.distanceTo(interaction.position);
        if (distance <= PlayerBehavior.minInteractionDistance && distance < closestInteractionDistance) {
          closestInteractionDistance = distance;
          closestInteraction = interaction;
        }
      }
    }
    
    if (closestInteraction != null) {
      if (Game.canShapeShift && this.wantShapeShift()) {
        if (closestInteraction.tryShapeShift()) this.shapeShift(closestInteraction);
        
      } else if (this.wantInteract()) {
        this.startInteraction(closestInteraction);

      } else {
        this.interactionActor.setPosition(closestInteraction.position).moveLocalY(0.1);
        this.interactionActor.setVisible(true);  
      }
    }
  }

  private shapeShift(character: InteractionBehavior) {
    this.frozen = true;
    this.actor.cannonBody.body.velocity.setZero();

    Sup.Audio.playSound(`SFX/Shapeshift/${Sup.Math.Random.sample(Sup.get("SFX/Shapeshift", Sup.Folder).children)}`, 0.8);
    Fade.start(Fade.Direction.Out, { duration: 150 }, () => {
      const previousPersonId = Game.playerPersonId;
      Game.playerPersonId = character.personId;
      
      if (previousPersonId === "Horace") {
        Game.dropBodyLocation = { place: Game.currentPlace, position: character.position };
        Game.placeOldBody();
      } else {
        const oldBodyActor = new Sup.Actor("Old Body");
        oldBodyActor.setLocalPosition(character.position);
        const spriteActor = new Sup.Actor("Sprite", oldBodyActor);
        new Sup.SpriteRenderer(spriteActor, `Characters/${previousPersonId}`);
        oldBodyActor.addBehavior(LostCharacterBehavior);
      }

      this.spriteActor.spriteRenderer.setSprite(`Characters/${Game.playerPersonId}`);
      character.actor.destroy();

      Sup.setTimeout(150, () => {
        if (Game.playerPersonId === "Fitness Club/Chiome") Sup.Audio.playSound(`SFX/Waf waf`);
        else Sup.Audio.playSound(`SFX/Screams/${Sup.Math.Random.sample(Sup.get("SFX/Screams", Sup.Folder).children)}`, 0.8);
      });
      Fade.start(Fade.Direction.In, { duration: 200, delay: 1000 }, () => { this.frozen = false; });
    });
  }

  startInteraction(interaction: Interaction) {
    this.activeInteraction = interaction;
    this.actor.cannonBody.body.velocity.setZero();
    this.actor.cannonBody.body.sleep();
    
    interaction.action();
  }

  finishInteraction() {
    this.activeInteraction = null;
    this.wakeUpBody();
  }

  startAutoPilot(angle: number, up = false) {
    if (up) this.autoPilotSpeed = new CANNON.Vec3(0, PlayerBehavior.autoPilotSpeed / 60, 0);
    else this.autoPilotSpeed = new CANNON.Vec3(Math.sin(angle) * PlayerBehavior.autoPilotSpeed / 60, 0, Math.cos(angle) * PlayerBehavior.autoPilotSpeed / 60);
    if (this.autoPilotSpeed.x < 0) this.spriteActor.spriteRenderer.setHorizontalFlip(true);
    this.actor.cannonBody.body.velocity.setZero();
    this.actor.cannonBody.body.sleep();
    this.spriteActor.spriteRenderer.setAnimation("Animation");
  }

  stopAutoPilot() {
    this.autoPilotSpeed = null;
    this.wakeUpBody();
    this.spriteActor.spriteRenderer.stopAnimation();
  }

  private wakeUpBody() {
    if (this.activeInteraction == null && this.autoPilotSpeed == null) this.actor.cannonBody.body.wakeUp();
  }

  private goLeft()  { return Sup.Input.isKeyDown("LEFT"); }
  private goRight() { return Sup.Input.isKeyDown("RIGHT"); }
  private goUp()    { return Sup.Input.isKeyDown("UP"); }
  private goDown()  { return Sup.Input.isKeyDown("DOWN"); }
  private jump()    { return Sup.Input.wasKeyJustPressed("SPACE"); }
  private wantInteract() { return Sup.Input.wasKeyJustPressed("X"); }
  private wantShapeShift() { return Sup.Input.wasKeyJustPressed("C"); }
}
Sup.registerBehavior(PlayerBehavior);

namespace PlayerBehavior {
  export const speed = 6;
  export const autoPilotSpeed = 3;
  
  export const minInteractionDistance = 2;
}
