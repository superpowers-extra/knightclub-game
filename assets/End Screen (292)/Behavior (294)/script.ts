class EndScreenBehavior extends Sup.Behavior {
  private music: Sup.Audio.SoundPlayer;
  
  awake() {
    Fade.start(Fade.Direction.In, { duration: 300, delay: 1000 }, () => {
      this.music = Sup.Audio.playSound("Musics/Nightclub", Game.musicVolume, { loop: true });
    });
  }

  update() {
    if (this.music == null) return;
    
    if (Sup.Input.wasKeyJustPressed("X") || Sup.Input.wasKeyJustPressed("RETURN")) {
      this.music.stop();
      Sup.loadScene("Title/Scene");
    }
  }
}
Sup.registerBehavior(EndScreenBehavior);
