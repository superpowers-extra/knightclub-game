class MainMenuBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    if (Sup.Input.wasKeyJustPressed("LEFT")) this.setLanguage("en");
    if (Sup.Input.wasKeyJustPressed("RIGHT")) this.setLanguage("fr");
    
    if (Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("X")) Game.start();
  }
  
  setLanguage(lang: string) {
    Game.language = lang;
    Sup.getActor("Selection").setLocalPosition(Sup.getActor(lang).getLocalPosition().toVector2());
  }
}
Sup.registerBehavior(MainMenuBehavior);
