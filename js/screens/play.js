game.PlayScreen = me.ScreenObject.extend({
  init: function () {
    me.audio.play("theme", true);
    // lower audio volume on firefox browser
    var vol = me.device.ua.contains("Firefox") ? 0.3 : 0.5;
    me.audio.setVolume(vol);
    this._super(me.ScreenObject, 'init');
  },

  onResetEvent: function () {
    me.game.reset();
    me.audio.stop("theme");
    if (!game.data.muted) {
      me.audio.play("theme", true);
    }

    me.input.bindKey(me.input.KEY.SPACE, "fly", true);

    /**
     *
     * @param bandwidth
     */

    game.doppler.callback = function () {

      // simulate space bar key down
      me.input.triggerKeyEvent(me.input.KEY.SPACE, true);

      // key up after 200ms for next action
      setTimeout(function () {
        me.input.triggerKeyEvent(me.input.KEY.SPACE, false);
      }, 200);

    };

    game.data.score = 0;
    game.data.steps = 0;
    game.data.start = false;
    game.data.newHiscore = false;

    me.game.world.addChild(new BackgroundLayer('bg', 1));

    this.ground1 = me.pool.pull('ground', 0, me.video.renderer.getHeight() - 96);
    this.ground2 = me.pool.pull('ground', me.video.renderer.getWidth(),
      me.video.renderer.getHeight() - 96);
    me.game.world.addChild(this.ground1, 11);
    me.game.world.addChild(this.ground2, 11);

    this.HUD = new game.HUD.Container();
    me.game.world.addChild(this.HUD);

    this.bird = me.pool.pull("clumsy", 60, me.game.viewport.height / 2 - 100);
    me.game.world.addChild(this.bird, 10);

    //inputs
    me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.SPACE);

    this.getReady = new me.Sprite(
      me.video.renderer.getWidth() / 2 - 200,
      me.video.renderer.getHeight() / 2 - 100,
      me.loader.getImage('getready')
    );
    me.game.world.addChild(this.getReady, 11);

    var that = this;
    var fadeOut = new me.Tween(this.getReady).to({alpha: 0}, 2000)
      .easing(me.Tween.Easing.Linear.None)
      .onComplete(function () {
        game.data.start = true;
        me.game.world.addChild(new PipeGenerator(), 0);
        me.game.world.removeChild(that.getReady);
      }).start();
  },

  onDestroyEvent: function () {
    me.audio.stopTrack('theme');
    // free the stored instance
    this.HUD = null;
    this.bird = null;
    this.ground1 = null;
    this.ground2 = null;
    me.input.unbindKey(me.input.KEY.SPACE);
    me.input.unbindPointer(me.input.mouse.LEFT);

    // reset doppler command once game is over
    game.doppler.callback = null;

  }
});
