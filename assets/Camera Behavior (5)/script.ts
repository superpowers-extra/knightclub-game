declare var document;

const tmpActor = new Sup.Actor("composer");
const renderer = (tmpActor as any).__inner.gameInstance.threeRenderer;
tmpActor.destroy();
const composer = new THREE.EffectComposer(renderer);
const clearPass = new THREE.ClearPass();

const effect = new THREE.ShaderPass(PostEffects.Scanline);
effect.renderToScreen = true;

class CameraBehavior extends Sup.Behavior {
  private initialOrientation: Sup.Math.Quaternion;
  orientation: Sup.Math.Quaternion;

  private nightclubTimer = 30;

  private initialPosition: Sup.Math.Vector3;
  private position: Sup.Math.Vector3;
  followForward = false;
  
  awake() {
    Game.camera = this;
    this.initialOrientation = this.actor.getLocalOrientation();
    this.orientation = this.initialOrientation.clone();
    
    this.initialPosition = this.actor.getLocalPosition();
    this.position = this.initialPosition.clone();
  }

  start() {
    // the camera component
    const camera = (this.actor.camera as any).__inner;
    const scene    = (this.actor as any).__inner.gameInstance.threeScene;
    
		// Clear the canvas with Shader
    composer.passes.length = 0;
		composer.addPass(clearPass);
		composer.addPass(new THREE.RenderPass(scene, camera.threeCamera));
    
    const oldRender = camera.render;
    camera.render = function() {
      oldRender.apply(this, arguments);
      const dim = { x: 0, y: 0, z: 0, w: 0 };
      this.actor.gameInstance.threeRenderer.getViewport(dim);
      composer.setSize(dim.z, dim.w);
      composer.render();
    };
    
		composer.addPass(effect);

    if (Game.quest.mainObjective == null || Game.quest.currentGoal < Game.Goals.getSomeFreshAir)  {
      // Night
      effect.uniforms["nightTime"].value = 1;
    } else if (Game.quest.currentGoal >= Game.Goals.findAnotherWayIntoTheCastle && Game.quest.currentGoal <= Game.Goals.throughSewers) {
      // Night
      effect.uniforms["nightTime"].value = 0.3;
    } else {
      // Day
      effect.uniforms["nightTime"].value = 0;
    }
  }

  update() {
    // Slerp camera orientation towards player
    this.actor.lookAt(Game.player.position);
    const targetOrientation = this.actor.getLocalOrientation();
    targetOrientation.slerp(this.initialOrientation, 0.8);

    this.orientation.slerp(targetOrientation, 0.04);
    this.actor.setLocalOrientation(this.orientation);
    
    if (this.followForward) {
      const targetZ = Game.player.position.z + 13;
      this.position.z = Math.min(Sup.Math.lerp(this.position.z, targetZ, 0.02), this.initialPosition.z);
      this.actor.setLocalPosition(this.position);
    }
    
    if (Game.currentPlace === "Nightclub") {
      this.nightclubTimer--;
      
      if (this.nightclubTimer === 0) {
        effect.uniforms["nightTime"].value = Sup.Math.Random.float(0, 1);
        this.nightclubTimer = Sup.Math.Random.integer(5, 30);
      }
    }
  }
}
Sup.registerBehavior(CameraBehavior);
