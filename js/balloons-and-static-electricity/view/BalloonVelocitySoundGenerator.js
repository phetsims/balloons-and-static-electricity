// Copyright 2021-2022, University of Colorado Boulder

/**
 * BalloonVelocitySoundGenerator is used to produce a sound that corresponds to the drifting velocity of the balloon.
 * It does NOT produce sound when the balloon is being dragged by the user.
 *
 * @author John Blanco
 */

import Multilink from '../../../../axon/js/Multilink.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import merge from '../../../../phet-core/js/merge.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import carrier000_wav from '../../../sounds/carrier000_wav.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const MIN_PLAYBACK_RATE_CHANGE = 0.03;
const MIN_OUTPUT_LEVEL_CHANGE = 0.05;

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
        basisSound: carrier000_wav,

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
    const outputUpdaterMultilink = Multilink.multilink(
      [ balloonVelocityProperty, touchingWallProperty ],
      ( balloonVelocity, onSweater, touchingWall ) => {
        const speed = balloonVelocity.magnitude;
        if ( speed > 0 && !touchingWall ) {

          const targetPlaybackRate = mapSpeedToPlaybackRate.evaluate( speed );
          const targetOutputLevel = mapSpeedToOutputLevel.evaluate( speed, 0.1 ) * options.maxOutputLevel;

          if ( !this.isPlaying ) {

            // Before starting playback, set the playback rate immediately, otherwise a sort of "chirp" sound can occur.
            this.setPlaybackRate( targetPlaybackRate, 0 );

            // Also set the output level immediately.
            this.setOutputLevel( targetOutputLevel, 0 );

            // Start the sound playing.
            this.play();
          }
          else {

            // Set the playback rate if the difference is above the threshold.  The thresholding is done because setting
            // it too frequently can cause performance issues that result in crackling sounds, see
            // https://github.com/phetsims/balloons-and-static-electricity/issues/527.
            if ( Math.abs( targetPlaybackRate - this.playbackRate ) >= MIN_PLAYBACK_RATE_CHANGE ) {

              // Set the playback rate.  This uses a relatively long time constant to make the changes sound smooth.
              this.setPlaybackRate( targetPlaybackRate, 0.5 );
            }

            // Same story as above for the output level, i.e. don't change it too frequently.
            if ( Math.abs( targetOutputLevel - this.outputLevel ) >= MIN_OUTPUT_LEVEL_CHANGE ) {
              this.setOutputLevel( targetOutputLevel );
            }
          }
        }
        else if ( ( speed === 0 || touchingWall ) && this.isPlaying ) {
          this.stop();
          this.setOutputLevel( 0 );
        }
      }
    );

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

// function for mapping the speed of the balloon to the playback rate of the carrier sound, empirically determined
const mapSpeedToPlaybackRate = new LinearFunction( 0, 3, 0.5, 2, true );

// function for mapping the speed of the balloon to the output level
const mapSpeedToOutputLevel = new LinearFunction( 0, 3, 0.2, 1, false );

balloonsAndStaticElectricity.register( 'BalloonVelocitySoundGenerator', BalloonVelocitySoundGenerator );
export default BalloonVelocitySoundGenerator;