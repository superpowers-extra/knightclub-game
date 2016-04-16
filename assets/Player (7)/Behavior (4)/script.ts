const playerMaterial = new CANNON.Material("playerMaterial");
world.addContactMaterial(new CANNON.ContactMaterial(playerMaterial, world.defaultMaterial, {
  friction: 0,
  restitution: 0,
  contactEquationStiffness: 1e8,
  contactEquationRelaxation: 3
}));

class PlayerBehavior extends Sup.Behavior {
  position: Sup.Math.Vector3;
  spriteActor: Sup.Actor;

  activeInteraction: InteractionBehavior;

  private interactionActor: Sup.Actor;

  private autoPilotSpeed: Sup.Math.Vector2;
  private isShapeShifting = false;

  private direction = new Sup.Math.Vector3();
  private canJump = false;

  awake() {
    Game.player = this;
    this.spriteActor = this.actor.getChild("Sprite");
    this.spriteActor.spriteRenderer.setSprite(PlayerBehavior.spritePath);
    this.interactionActor = this.actor.getChild("Interaction");
  }

  start() {
    this.position = this.actor.getLocalPosition();
    this.actor.cannonBody.body.position.set(this.position.x, 0, this.position.z);

    this.actor.cannonBody.body.material = playerMaterial;
    this.actor.cannonBody.body.addEventListener("collide", (event) => {
      // Only allow jumping if touching the floor
      if (event.contact.ni.y > 0.9) this.canJump = true;
    });
  }

  update() {
    if (this.autoPilotSpeed != null) {
      this.actor.cannonBody.body.position.x += this.autoPilotSpeed.x;
      this.actor.cannonBody.body.position.z += this.autoPilotSpeed.y;
      return;
    }
    
    if (this.activeInteraction != null) {
      if (this.interact()) this.activeInteraction.action();
      return;
    }
    
    if (this.isShapeShifting) return;
    
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
      this.direction.normalize();
      this.actor.cannonBody.body.velocity.x = this.direction.x * PlayerBehavior.speed;
      this.actor.cannonBody.body.velocity.z = this.direction.z * PlayerBehavior.speed;
    } else {
      this.actor.cannonBody.body.velocity.x = 0;
      this.actor.cannonBody.body.velocity.z = 0;
    }
    
    // Teleporters
    this.checkTeleporters();
    
    // Interactions
    this.checkInteractions();
  }

  private checkTeleporters() {
    for (const teleporter of Game.teleporters) {
      const xCheck = Math.abs(teleporter.position.x - this.position.x) < teleporter.width / 2;
      const zCheck = Math.abs(teleporter.position.z - this.position.z) < teleporter.depth / 2;
      if (xCheck && zCheck) {
        Game.leavePlace(teleporter);
        return;
      }
    }
  }

  private checkInteractions() {
    let closestInteractionDistance = Infinity;
    let closestInteraction: InteractionBehavior;
    
    const flipped = this.spriteActor.spriteRenderer.getHorizontalFlip();
    for (const interaction of Game.interactions) {
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
    
    this.interactionActor.setVisible(false);
    if (closestInteraction != null) {
      if (this.shapeShift() && closestInteraction.canShapeShift) {
        this.isShapeShifting = true;
        this.actor.cannonBody.body.velocity.setZero();
        
        Fade.start(Fade.Direction.Out, { duration: 300 }, () => {
          // TODO: play scream sound
          
          const oldBodyActor = new Sup.Actor("Old Body");
          oldBodyActor.setLocalPosition(this.actor.cannonBody.body.position);
          new Sup.SpriteRenderer(oldBodyActor, PlayerBehavior.spritePath);
          oldBodyActor.spriteRenderer.setColor(0.8, 0.8, 0.8);
          
          PlayerBehavior.spritePath = closestInteraction.spritePath;
          this.actor.cannonBody.body.position.x = closestInteraction.position.x;
          this.actor.cannonBody.body.position.z = closestInteraction.position.z;
          this.position.copy(this.actor.cannonBody.body.position);
          this.spriteActor.spriteRenderer.setSprite(PlayerBehavior.spritePath);
          closestInteraction.actor.destroy();
          
          Fade.start(Fade.Direction.In, { duration: 300, delay: 200 }, () => {
            this.isShapeShifting = false;
            oldBodyActor.addBehavior(CharacterFadeOutBehavior);
          });
        });
        
      } else if (this.interact()) {
        this.activeInteraction = closestInteraction;
        closestInteraction.action();
        this.actor.cannonBody.body.velocity.setZero();

      } else {
        this.interactionActor.setPosition(closestInteraction.position).moveLocalY(0.1);
        this.interactionActor.setVisible(true);  
      }
    }
  }

  startAutoPilot(angle: number) {
    if (angle !== 90 && angle !== -90) this.spriteActor.spriteRenderer.setHorizontalFlip(angle > 90 || angle < -90);
    
    angle *= Math.PI / 180;
    this.autoPilotSpeed = new Sup.Math.Vector2(Math.cos(angle) * PlayerBehavior.autoPilotSpeed / 60, Math.sin(angle) * PlayerBehavior.autoPilotSpeed / 60);
    this.actor.cannonBody.body.sleep();
  }

  stopAutoPilot() {
    this.autoPilotSpeed = null;
    this.actor.cannonBody.body.wakeUp();
  }

  private goLeft()  { return Sup.Input.isKeyDown("LEFT"); }
  private goRight() { return Sup.Input.isKeyDown("RIGHT"); }
  private goUp()    { return Sup.Input.isKeyDown("UP"); }
  private goDown()  { return Sup.Input.isKeyDown("DOWN"); }
  private jump()    { return Sup.Input.wasKeyJustPressed("SPACE"); }
  private interact() { return Sup.Input.wasKeyJustPressed("X"); }
  private shapeShift() { return Sup.Input.wasKeyJustPressed("C"); }
}
Sup.registerBehavior(PlayerBehavior);

namespace PlayerBehavior {
  export let spritePath = "Player/Sprite";
  
  export const speed = 6;
  export const autoPilotSpeed = 3;
  
  export const minInteractionDistance = 1;
}
