// Copyright 2018-2020, University of Colorado Boulder

/**
 * BalloonRubbingSoundGenerator is used to produces a sound effect for when a balloon is rubbing on the something.  It
 * is meant to be somewhat realistic as opposed to "cartoonish", so it uses a filtered noise generator.
 *
 * @author John Blanco
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import merge from '../../../../phet-core/js/merge.js';
import NoiseGenerator from '../../../../tambo/js/sound-generators/NoiseGenerator.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const CENTER_FREQUENCY = 900; // Hz
const FREQUENCY_CHANGE_WITH_DIRECTION = 100; // Hz
const UPDATE_PERIOD = 100; // ms
const SMOOTHED_SPEED_TAPER_RATE = 0.01; // model units per second, empirically determined
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
      centerFrequency: CENTER_FREQUENCY,
      qFactor: 2,

      // {number} - The amount of sound produced by this sound generator varies based on what's going on with the input
      //            properties, and this value sets the maximum.
      maxOutputLevel: 0.8

    }, options );

    super( options );

    // property that moves up instantly with the drag velocity but tapers off more slowly
    const smoothedSpeedProperty = new NumberProperty( 0 );

    // Watch for sudden increases in the drag speed and bump up the smoothed speed when they occur.
    dragVelocityProperty.link( dragVelocity => {
      const dragSpeed = dragVelocity.magnitude;
      if ( dragSpeed > smoothedSpeedProperty.value ) {
        smoothedSpeedProperty.set( dragSpeed );
      }
    } );

    // Use a timer to make the smoothed speed taper off more slowly than the drag velocity property tends to.
    let previousTime = phet.joist.elapsedTime;
    stepTimer.setInterval( () => {
      const dt = phet.joist.elapsedTime - previousTime;
      if ( smoothedSpeedProperty.value > 0 ) {
        smoothedSpeedProperty.set(
          Math.max( smoothedSpeedProperty.value - dt * SMOOTHED_SPEED_TAPER_RATE, dragVelocityProperty.value.magnitude )
        );
      }
      previousTime = phet.joist.elapsedTime;
    }, UPDATE_PERIOD );

    // Use the smoothed speed and the on-sweater information to set the volume and pitch of the output.
    Property.multilink(
      [ smoothedSpeedProperty, onSweaterProperty, touchingWallProperty ],
      ( smoothedDragSpeed, onSweater, touchingWall ) => {
        if ( smoothedDragSpeed > 0 && ( onSweater || touchingWall ) ){

          // Start the production of the sound if needed.
          if ( !this.isPlaying ) {
            this.start();
          }

          // Set the output level.
          this.setOutputLevel( MAP_DRAG_SPEED_TO_OUTPUT_LEVEL( smoothedDragSpeed ) * options.maxOutputLevel );

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
          this.setBandpassFilterCenterFrequency( CENTER_FREQUENCY + sign * FREQUENCY_CHANGE_WITH_DIRECTION );
        }
        else if ( ( smoothedDragSpeed === 0 || !( onSweater || touchingWall ) ) && this.isPlaying ) {

          // The smoothed speed has dropped to zero, turn off sound production.
          this.stop();
        }
      }
    );
  }
}

balloonsAndStaticElectricity.register( 'BalloonRubbingSoundGenerator', BalloonRubbingSoundGenerator );

export default BalloonRubbingSoundGenerator;