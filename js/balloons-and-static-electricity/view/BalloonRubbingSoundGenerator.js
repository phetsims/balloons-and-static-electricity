// Copyright 2021-2022, University of Colorado Boulder

/**
 * BalloonRubbingSoundGenerator is used to produces a sound effect for when a balloon is rubbing on the something.  It
 * is meant to be somewhat realistic as opposed to "cartoonish", so it uses a filtered noise generator.
 *
 * @author John Blanco
 */

import Multilink from '../../../../axon/js/Multilink.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import NoiseGenerator from '../../../../tambo/js/sound-generators/NoiseGenerator.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const DEFAULT_CENTER_FREQUENCY = 800; // Hz
const FREQUENCY_CHANGE_WITH_DIRECTION = 100; // Hz
const SMOOTHED_VELOCITY_TAPER_RATE = 1; // model units per second, empirically determined
const MAX_TAPER_TIME = 0.2; // in seconds
const MAX_SMOOTHED_SPEED = SMOOTHED_VELOCITY_TAPER_RATE * MAX_TAPER_TIME;
const MAP_SMOOTHED_SPEED_TO_OUTPUT_LEVEL = new LinearFunction( 0, MAX_SMOOTHED_SPEED, 0, 1, true );

class BalloonRubbingSoundGenerator extends NoiseGenerator {

  /**
   * {Property.<number>} dragVelocityProperty - velocity of the balloon drag
   * {Property.<boolean>} onSweaterProperty - whether the balloon is on the sweater
   * {Property.<boolean>} touchingWallProperty - whether the balloon is touching the wall
   * {Object} [options]
   */
  constructor( dragVelocityProperty, onSweaterProperty, touchingWallProperty, options ) {

    options = merge( {
      noiseType: 'brown',
      centerFrequency: DEFAULT_CENTER_FREQUENCY,
      qFactor: 2,

      // {number} - The amount of sound produced by this sound generator varies based on what's going on with the input
      //            properties, and this value sets the maximum.
      maxOutputLevel: 0.3

    }, options );

    super( options );

    // @private - A Property that moves up instantly with the drag velocity but tapers off more slowly, used to prevent
    // the sound generator from doing a bunch of stops and starts during drag operations.  This is also clamped so that
    // it doesn't get so large that it takes a long time to taper off.
    this.clampedSmoothedDragVelocityProperty = new Vector2Property( Vector2.ZERO );

    // a vector that is reused when evaluating drag velocity changes, used to reduce memory allocations.
    const clampedDragVelocity = new Vector2( 0, 0 );

    // Watch for sudden increases in the drag velocity and bump up the smoothed velocity when they occur.  Limit the
    // max so that the sound generator doesn't end up running to too long.
    dragVelocityProperty.link( dragVelocity => {
      clampedDragVelocity.set( dragVelocity );
      if ( clampedDragVelocity.magnitude > MAX_SMOOTHED_SPEED ) {
        clampedDragVelocity.setMagnitude( MAX_SMOOTHED_SPEED );
      }
      if ( clampedDragVelocity.magnitude > this.clampedSmoothedDragVelocityProperty.value.magnitude ) {
        this.clampedSmoothedDragVelocityProperty.set( clampedDragVelocity );
      }
    } );

    // Use the smoothed velocity with the on-sweater and on-wall information to set the volume and pitch of the output.
    Multilink.multilink(
      [ dragVelocityProperty, this.clampedSmoothedDragVelocityProperty, onSweaterProperty, touchingWallProperty ],
      ( dragVelocity, smoothedDragVelocity, onSweater, touchingWall ) => {

        // Test whether the balloon is being dragged over the sweater or against the wall.
        if ( ( smoothedDragVelocity.magnitude > 0 && onSweater ) ||
             ( Math.abs( smoothedDragVelocity.y ) > 0 && Math.abs( smoothedDragVelocity.x ) === 0 && touchingWall ) ) {

          // Start the production of the sound if it's not already playing.
          if ( !this.isPlaying ) {
            this.start();
          }

          // Set the output level based on the drag speed.
          this.setOutputLevel(
            MAP_SMOOTHED_SPEED_TO_OUTPUT_LEVEL.evaluate( smoothedDragVelocity.magnitude ) * options.maxOutputLevel
          );

          // Set the pitch based on the direction in which the balloon is being dragged.
          let sign = 1;
          if ( Math.abs( dragVelocity.x ) > Math.abs( dragVelocity.y ) ) {
            if ( dragVelocity.x < 0 ) {
              sign = -1;
            }
          }
          else if ( dragVelocity.y < 0 ) {
            sign = -1;
          }
          this.setBandpassFilterCenterFrequency( options.centerFrequency + sign * FREQUENCY_CHANGE_WITH_DIRECTION );
        }
        else if ( ( smoothedDragVelocity.magnitude === 0 || !( onSweater || touchingWall ) ) && this.isPlaying ) {

          // The smoothed velocity has dropped to zero, turn off sound production.
          this.stop();
        }
      }
    );
  }

  /**
   * @param {number} dt - time change in seconds
   * @public
   */
  step( dt ) {
    if ( this.clampedSmoothedDragVelocityProperty.value.magnitude > 0 ) {
      const taperedMagnitude = Math.max(
        this.clampedSmoothedDragVelocityProperty.value.magnitude - dt * SMOOTHED_VELOCITY_TAPER_RATE,
        0
      );
      this.clampedSmoothedDragVelocityProperty.set(
        this.clampedSmoothedDragVelocityProperty.value.withMagnitude( taperedMagnitude )
      );
    }
  }
}

// statics
BalloonRubbingSoundGenerator.DEFAULT_CENTER_FREQUENCY = DEFAULT_CENTER_FREQUENCY;

balloonsAndStaticElectricity.register( 'BalloonRubbingSoundGenerator', BalloonRubbingSoundGenerator );

export default BalloonRubbingSoundGenerator;