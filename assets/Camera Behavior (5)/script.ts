class CameraBehavior extends Sup.Behavior {
  initialOrientation: Sup.Math.Quaternion;
  orientation: Sup.Math.Quaternion;
  
  awake() {
    Game.camera = this;
    this.initialOrientation = this.actor.getLocalOrientation();
    this.orientation = this.initialOrientation.clone();
  }

  protected composer;
	effect: any;

  start() {
    /*// the camera component
    const camera = (this.actor.camera as any).__inner;
    const scene    = (this.actor as any).__inner.gameInstance.threeScene;
    const renderer = (this.actor as any).__inner.gameInstance.threeRenderer;
    const composer = new THREE.EffectComposer(renderer);
    const clearPass = new THREE.ClearPass();
		
		// Clear the canvas with Shader
		composer.addPass(clearPass);
		composer.addPass( new THREE.RenderPass( scene, camera.threeCamera ) );
    
    const oldRender = camera.render;
    camera.render = function() {
      oldRender.apply(this, arguments);
      let dim = {x:0,y:0,z:0,w:0};
      this.actor.gameInstance.threeRenderer.getViewport(dim);
      composer.setSize( dim.z, dim.w );
      composer.render();
    };

    this.composer = composer;

    this.effect = new THREE.ShaderPass(PostEffects.Scanline);
    this.effect.renderToScreen = true;
		this.composer.addPass(this.effect);*/
  }

  update() {
    // Slerp camera orientation towards player
    this.actor.lookAt(Game.player.position);
    const targetOrientation = this.actor.getLocalOrientation();
    targetOrientation.slerp(this.initialOrientation, 0.8);

    this.orientation.slerp(targetOrientation, 0.02);
    this.actor.setLocalOrientation(this.orientation);

    // Make all characters billboard
    Game.player.spriteActor.setOrientation(this.orientation); // .rotateLocalEulerY(Math.PI);
  }
}
Sup.registerBehavior(CameraBehavior);
