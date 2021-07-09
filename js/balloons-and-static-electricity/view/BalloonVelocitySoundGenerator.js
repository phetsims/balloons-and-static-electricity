// Copyright 2021, University of Colorado Boulder

/**
 * BalloonVelocitySoundGenerator is used to produce a sound that corresponds to the drifting velocity of the balloon.
 * It does NOT produce sound when the balloon is being dragged by the user.
 *
 * @author John Blanco
 */

import Property from '../../../../axon/js/Property.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import merge from '../../../../phet-core/js/merge.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import driftVelocityLoopSound from '../../../sounds/carrier-000_wav.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// function for mapping the speed of the balloon to the playback rate of the carrier sound, empirically determined
const mapSpeedToPlaybackRate = new LinearFunction( 0, 3, 0.5, 2, true );
const mapSpeedToOutputLevel = new LinearFunction( 0, 3, 0.2, 1, false );

class BalloonVelocitySoundGenerator extends SoundClip {

  /**
   * {Property.<number>} balloonVelocityProperty - velocity of the balloon when drifting (i.e. when it is not being
   *                                               dragged by a user).
   * {Property.<boolean>} touchingWallProperty - whether the balloon is touching the wall
   * {Object} [options]
   */
  constructor( balloonVelocityProperty, touchingWallProperty, options ) {

    options = merge(
      {
        loop: true,

        // {WrappedAudioBuffer} - sound to use as the basis for the drifting velocity
        basisSound: driftVelocityLoopSound,

        // {number) The output level is set as a function of the speed at which the balloon is moving.  This value
        // specifies the maximum value.  It will generally be between 0 and 1.
        maxOutputLevel: 0.5
      },
      options
    );

    // options checking
    assert && assert(
      !options.initialOutputLevel,
      'initialOutputLevel should not be specified for this sound generator, use maxOutputLevel instead'
    );

    // Start the initial output level at zero so that the sound will fade in smoothly the first time it is played.
    options.initialOutputLevel = 0;

    super( options.basisSound, options );

    // Monitor the balloon velocity and modify the output sound as changes occur.  If the balloon is on the sweater or
    // the wall, no sound should be produced.
    const outputUpdaterMultilink = Property.multilink(
      [ balloonVelocityProperty, touchingWallProperty ],
      ( balloonVelocity, onSweater, touchingWall ) => {
        const speed = balloonVelocity.magnitude;
        if ( speed > 0 && !touchingWall ) {
          if ( !this.isPlaying ) {

            // Before starting playback, set the playback rate immediately, otherwise there can be a bit of the "chirp"
            // sound.
            this.setPlaybackRate( mapSpeedToPlaybackRate( speed, 0 ) );

            // Start the sound playing.
            this.play();
          }
          else {

            // Set the playback rate.  This will use the nominal time constant, which should lead to a reasonably smooth
            // transition of the rate as the velocity changes.
            this.setPlaybackRate( mapSpeedToPlaybackRate( speed ) );
          }

          // Set the output level based on the velocity.
          this.setOutputLevel( mapSpeedToOutputLevel( speed, 0.1 ) * options.maxOutputLevel );
        }
        else if ( ( speed === 0 || touchingWall ) && this.isPlaying ) {
          this.stop();
          this.setOutputLevel( 0 );
        }
      } );

    this.disposeBalloonVelocitySoundGenerator = () => {
      outputUpdaterMultilink.dispose();
    };
  }

  /**
   * release memory references
   * @public
   */
  dispose() {
    this.disposeBalloonVelocitySoundGenerator();
    super.dispose();
  }
}

balloonsAndStaticElectricity.register( 'BalloonVelocitySoundGenerator', BalloonVelocitySoundGenerator );

export default BalloonVelocitySoundGenerator;