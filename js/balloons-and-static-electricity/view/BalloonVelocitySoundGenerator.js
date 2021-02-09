// Copyright 2018-2020, University of Colorado Boulder

/**
 * BalloonVelocitySoundGenerator is used to produce a sound that corresponds to the drifting velocity of the balloon.
 * It does NOT produce sound when the balloon is being dragged by the user.
 *
 * @author John Blanco
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import merge from '../../../../phet-core/js/merge.js';
import NoiseGenerator from '../../../../tambo/js/sound-generators/NoiseGenerator.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const INITIAL_CENTER_FREQUENCY = 500;

// function for mapping the speed of the balloon to the center frequency of the filter
const mapSpeedToFrequency = new LinearFunction( 0, 2, INITIAL_CENTER_FREQUENCY, INITIAL_CENTER_FREQUENCY * 2, true );

class BalloonVelocitySoundGenerator extends NoiseGenerator {

  /**
   * {Property.<number>} balloonVelocityProperty - velocity of the balloon when drifting (i.e. when it is not being
   * dragged by a user).
   * {Object} [options]
   */
  constructor( balloonVelocityProperty, options ) {

    options = merge( {
        noiseType: 'pink',
        centerFrequency: INITIAL_CENTER_FREQUENCY,
        qFactor: 200,

        // The output level has to be far higher than normal, since so much of the noise energy ends up getting filtered
        // out.
        initialOutputLevel: 15.0
      },
      options
    );

    super( options );

    // monitor the molecule oscillation amplitude and update local state
    balloonVelocityProperty.lazyLink( velocity => {
      const speed = velocity.magnitude;
      if ( speed > 0 ) {
        if ( !this.isPlaying ){
          this.start();
        }
        this.setBandpassFilterCenterFrequency( mapSpeedToFrequency( speed ) );
      }
      else if ( speed === 0 && this.isPlaying ) {
        this.stop();
      }
    } );
  }
}

balloonsAndStaticElectricity.register( 'BalloonVelocitySoundGenerator', BalloonVelocitySoundGenerator );

export default BalloonVelocitySoundGenerator;