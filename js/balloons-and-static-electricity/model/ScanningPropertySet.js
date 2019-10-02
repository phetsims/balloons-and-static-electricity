// Copyright 2018, University of Colorado Boulder

/**
 * Set of Properties that indicate that a finger is over an something while a user is scanning for elements in the view.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );

  class ScanningPropertySet {
    constructor() {

      // @public - is the finger over the yellow balloon?
      this.yellowBalloonDetectedProperty = new BooleanProperty( false );
    }
  }

  return balloonsAndStaticElectricity.register( 'ScanningPropertySet', ScanningPropertySet );
} );
