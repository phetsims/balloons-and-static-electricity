// Copyright 2018-2020, University of Colorado Boulder

/**
 * BalloonRubbingSoundGenerator is used to produces a sound effect for when a balloon is rubbing on the something.  It
 * is meant to be somewhat realistic as opposed to "cartoonish", so it uses a filtered noise generator.
 *
 * @author John Blanco
 */

import Property from '../../../../axon/js/Property.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import NoiseGenerator from '../../../../tambo/js/sound-generators/NoiseGenerator.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const DEFAULT_CENTER_FREQUENCY = 800; // Hz
const FREQUENCY_CHANGE_WITH_DIRECTION = 100; // Hz
const UPDATE_PERIOD = 100; // ms
const SMOOTHED_VELOCITY_TAPER_RATE = 0.01; // model units per second, empirically determined
const MAP_DRAG_SPEED_TO_OUTPUT_LEVEL = new LinearFunction( 0, 2, 0, 1, true );

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
      maxOutputLevel: 0.8

    }, options );

    super( options );

    // property that moves up instantly with the drag velocity but tapers off more slowly
    const smoothedDragVelocityProperty = new Vector2Property( Vector2.ZERO );

    // Watch for sudden increases in the drag velocity and bump up the smoothed velocity when they occur.
    dragVelocityProperty.link( dragVelocity => {
      if ( dragVelocity.magnitude > smoothedDragVelocityProperty.value.magnitude ) {
        smoothedDragVelocityProperty.set( dragVelocityProperty.value );
      }
    } );

    // Use a timer to make the smoothed velocity taper off more slowly than the drag velocity property tends to.
    let previousTime = phet.joist.elapsedTime;
    stepTimer.setInterval( () => {
      const dt = phet.joist.elapsedTime - previousTime;
      if ( smoothedDragVelocityProperty.value.magnitude > 0 ) {
        const smoothedVelocityMagnitude = Math.max(
          smoothedDragVelocityProperty.value.magnitude - dt * SMOOTHED_VELOCITY_TAPER_RATE,
          dragVelocityProperty.value.magnitude
        );
        smoothedDragVelocityProperty.set( smoothedDragVelocityProperty.value.withMagnitude( smoothedVelocityMagnitude ) );
      }
      previousTime = phet.joist.elapsedTime;
    }, UPDATE_PERIOD );

    // Use the smoothed velocity with the on-sweater and on-wall information to set the volume and pitch of the output.
    Property.multilink(
      [ smoothedDragVelocityProperty, onSweaterProperty, touchingWallProperty ],
      ( smoothedDragVelocity, onSweater, touchingWall ) => {

        // Test whether the balloon is being dragged over the sweater or against the wall.
        if ( ( smoothedDragVelocity.magnitude > 0 && onSweater ) ||
             ( Math.abs( smoothedDragVelocity.y ) > 0 && Math.abs( smoothedDragVelocity.x ) === 0 && touchingWall ) ) {

          // Start the production of the sound if needed.
          if ( !this.isPlaying ) {
            this.start();
          }

          // Set the output level.
          this.setOutputLevel( MAP_DRAG_SPEED_TO_OUTPUT_LEVEL( smoothedDragVelocity.magnitude ) * options.maxOutputLevel );

          // Set the pitch based on the direction in which the balloon is being dragged.
          const dragVelocity = dragVelocityProperty.value;
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
}

// statics
BalloonRubbingSoundGenerator.DEFAULT_CENTER_FREQUENCY = DEFAULT_CENTER_FREQUENCY;

balloonsAndStaticElectricity.register( 'BalloonRubbingSoundGenerator', BalloonRubbingSoundGenerator );

export default BalloonRubbingSoundGenerator;