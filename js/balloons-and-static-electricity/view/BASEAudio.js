// Copyright 2016-2017, University of Colorado Boulder

/**
 * Simple audio for balloons and static electricity for sounds when the balloon starts rubbing, picks up
 * a charge, and hits a boundary of the play area.
 *
 */

define( function( require ) {
  'use strict';

  // modules
  // var Sound = require( 'VIBE/Sound' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  // audio - removed until PhET creates sufficient audio files
  // var balloonDraggingDownOnSweater = require( 'audio!BALLOONS_AND_STATIC_ELECTRICITY/balloon-dragging-down-on-sweater' );
  // var balloonDraggingUpOnSweater = require( 'audio!BALLOONS_AND_STATIC_ELECTRICITY/balloon-dragging-up-on-sweater' );
  // var boundsBeep = require( 'audio!BALLOONS_AND_STATIC_ELECTRICITY/bounds-beep' );
  // var chargeTransferBeep = require( 'audio!BALLOONS_AND_STATIC_ELECTRICITY/charge-transfer-beep' );

  /**
   * @param {BASEModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function BASEAudio( model, tandem ) {

    // @private
    this.model = model;

    // TODO: add sounds for the other balloon
    // this.balloonDraggingUpSound = new Sound( balloonDraggingUpOnSweater );
    // this.balloonDraggingDownSound = new Sound( balloonDraggingDownOnSweater );
    // this.chargeTransferBeepSound = new Sound( chargeTransferBeep );
    // this.boundsBeepSound = new Sound( boundsBeep );

    // @private - audio queue for setting up a list of sounds to play in turn with a given duration
    this.audioQueue = new TimedQueue( 500 );

    // @private
    this.balloonStillTime = 0;
    this.soundBeingPlayed = null;

    // var self = this;
    this.model.balloons.forEach( function( balloon ) {

      // whenever the balloon picks up a charge, play the charge beep with a bit of a delay
      // so that it is clear what is happening when multiple charges are picked up at once
      balloon.chargeProperty.lazyLink( function( charge ) {
        // self.audioQueue.add( function() {
        //   self.chargeTransferBeepSound.play();
        // }, ( self.chargeTransferBeepSound.audioBuffer.duration / 5 ) * 1000 ); // conversion to ms
      } );
    } );
  }

  balloonsAndStaticElectricity.register( 'BASEAudio', BASEAudio );

  inherit( Object, BASEAudio, {

    // @public, step the audio view
    step: function( dt ) {

      var balloon = this.model.yellowBalloon;

      var soundToPlay;

      // update the sound for the balloon dragging
      if ( !balloon.onSweater() ) {

        // the balloon is not on the sweater, no sound should be playing
        soundToPlay = null;
      }
      else {
        if ( balloon.dragVelocityProperty.get().equals( Vector2.ZERO ) ) {

          // implement hysteresis for turning the sound on and off, otherwise it can start and stop too often
          this.balloonStillTime += dt;
          if ( this.balloonStillTime > 0.1 ) {
            soundToPlay = null;
          }
        }
        else {
          this.balloonStillTime = 0;

          // if moving up or to the right, play the moving up sound
          if ( balloon.dragVelocityProperty.get().x > 0 || balloon.dragVelocityProperty.get().y > 0 ) {
            // soundToPlay = this.balloonDraggingUpSound;
          }
          else {
            // soundToPlay = this.balloonDraggingDownSound;
          }
        }
      }

      // play a sound when a balloon hits a boundary object
      if ( balloon.getBoundaryObject() ) {
        // soundToPlay = this.boundsBeepSound;
      }

      // if the correct sound isn't currently being played, update it
      if ( this.soundBeingPlayed !== soundToPlay ) {
        if ( this.soundBeingPlayed ) {
          this.soundBeingPlayed.stop();
        }

        this.soundBeingPlayed = soundToPlay;

        if ( this.soundBeingPlayed ) {
          this.soundBeingPlayed.play();
        }
      }

      this.audioQueue.run();

    }
  } );


  /**
   * A timed queue that can be used to queue playing sounds.
   * TODO: move to phetcommon, tandem will be optional
   *
   * @param {number} defaultDelay - default delay for items in the queue
   */
  function TimedQueue( defaultDelay ) {

    // @private - track when we are running so we do not try to run the queue while it is already running
    this.running = false;

    // @private - the queue of items to be read, populated with objects like
    // { callback: {function}, delay: {number} };
    this.queue = [];

    // @private - current index in the queue
    this.index = 0;

    // @private - default delay of five seconds
    this.defaultDelay = defaultDelay || 5000;
  }

  balloonsAndStaticElectricity.register( 'TimedQueue', TimedQueue );

  inherit( Object, TimedQueue, {

    /**
     * Add a callback to this queue, with a delay
     *
     * @param {function} callBack - callback fired by this addition
     * @param {number} [delay]- optional delay for this item
     * @public
     */
    add: function( callBack, delay ) {
      var self = this;
      this.queue.push( {
        callBack: callBack,
        delay: delay || self.defaultDelay
      } );
    },

    /**
     * Run through items in the queue, starting at index
     * @param  {number} index
     * @public
     */
    run: function( index ) {
      if ( !this.running ) {
        this.index = index || 0;
        this.next();
      }
    },

    /**
     * Remove all items from the queue
     * @public
     */
    clear: function() {
      this.queue = [];
    },

    /**
     * Get the next item in the queue, then delaying after firing callback
     * @public
     */
    next: function() {

      this.running = true;
      var self = this;
      var i = this.index++;

      var active = this.queue[ i ];
      var next = this.queue[ this.index ];

      // return and set running flag to false if there are no items in the queue
      var endRun = function() {
        self.running = false;
        self.clear();
      };

      if ( !active ) {
        endRun();
        return;
      }

      // fire the callback function
      active.callBack();

      if ( next ) {
        setTimeout( function() {
          self.next();
        }, active.delay || self.defaultDelay );
      }
      else {
        endRun();
        return;
      }
    }
  } );

  return BASEAudio;

} );
