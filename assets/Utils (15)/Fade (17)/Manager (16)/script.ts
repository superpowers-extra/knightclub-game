namespace Fade {
  let fadeSpriteRndr: Sup.SpriteRenderer;
  let fadeDirection = null;
  let tween: Sup.Tween;

  export enum Direction { In, Out };
  export let isFading = false;

  export function start(direction: Direction, options?: { duration?: number; delay?: number; }, callback?: Function) {
    if (options == null) options = {};
    if (options.duration == null) options.duration = 300;
    if (options.delay == null) options.delay = 0;
    
    let [ startOpacity, endOpacity ] = direction === Direction.In ? [ 1, 0 ] : [ 0, 1 ];

    if (fadeSpriteRndr != null) {
      if (fadeDirection == direction) return;
      
      startOpacity = fadeSpriteRndr.getOpacity();
    } else {
      fadeSpriteRndr = new Sup.SpriteRenderer(new Sup.Actor("Black Screen", Sup.getActor("Camera")), "Utils/Fade/Black Screen");
      fadeSpriteRndr.setOpacity(startOpacity).actor.setLocalZ(-1).setLocalScale(10);
    }

    fadeDirection = direction;
    isFading = true;

    if (tween != null) tween.stop();
    tween = new Sup.Tween(fadeSpriteRndr.actor, { opacity: startOpacity })
      .delay(options.delay)
      .to({ opacity: endOpacity }, options.duration).easing(TWEEN.Easing.Cubic.In)
      .onUpdate((object) => { fadeSpriteRndr.setOpacity(object.opacity); })
      .onComplete(() => { Sup.setTimeout(50, () => { end(); if (callback != null) callback(); }) })
      .start();
  }

  function end() {
    fadeSpriteRndr.actor.destroy();
    fadeSpriteRndr = null;
    fadeDirection = null;
    isFading = false;
    tween = null;
  }
}