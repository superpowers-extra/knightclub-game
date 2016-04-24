class FinalHoraceBehavior extends SingleLineBehavior {
  
  tryShapeShift() {
    Game.player.freeze();
    Game.player.actor.cannonBody.body.velocity.setZero();

    Sup.Audio.playSound(`SFX/Shapeshift/${Sup.Math.Random.sample(Sup.get("SFX/Shapeshift", Sup.Folder).children)}`, 0.8);
    Fade.start(Fade.Direction.Out, { duration: 300 }, () => {
      Game.stopMusic();
      Sup.Audio.playSound(`SFX/Screams/${Sup.Math.Random.sample(Sup.get("SFX/Screams", Sup.Folder).children)}`, 0.8);
      
      Sup.loadScene("End Screen/Scene");
    });

    return false;
  }
}
Sup.registerBehavior(FinalHoraceBehavior);
