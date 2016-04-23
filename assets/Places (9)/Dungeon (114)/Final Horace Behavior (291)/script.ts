class FinalHoraceBehavior extends SingleLineBehavior {
  
  tryShapeShift() {
    (Game.player as any).frozen = true;
    Game.player.actor.cannonBody.body.velocity.setZero();

    Sup.Audio.playSound(`SFX/Shapeshift/${Sup.Math.Random.sample(Sup.get("SFX/Shapeshift", Sup.Folder).children)}`, 0.8);
    Sup.setTimeout(300, () => {
      Sup.Audio.playSound(`SFX/Screams/${Sup.Math.Random.sample(Sup.get("SFX/Screams", Sup.Folder).children)}`, 0.8);
    });
    
    Fade.start(Fade.Direction.Out, { duration: 300 }, () => {
      Game.stopMusic();
      Sup.loadScene("End Screen/Scene");

      Sup.setTimeout(500, () => {
        Sup.Audio.playSound("Musics/Nightclub", 1, { loop: true });
      });
    });

    return false;
  }
}
Sup.registerBehavior(FinalHoraceBehavior);
