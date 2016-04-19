class TitleBehavior extends Sup.Behavior {
  awake() {
    Fade.start(Fade.Direction.In, { duration: 500 });
  }

  update() {
    if (Sup.Input.wasKeyJustPressed("X") || Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")) {
      Fade.start(Fade.Direction.Out, { duration: 500 }, () => {
        // Sup.loadScene("Main Menu/Scene");
        Game.start();
      });
      
    }
  }
}
Sup.registerBehavior(TitleBehavior);
