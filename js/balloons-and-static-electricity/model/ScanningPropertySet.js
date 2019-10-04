// Copyright 2019, University of Colorado Boulder

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

      // @public - is the finger over one of these objects?
      this.yellowBalloonDetectedProperty = new BooleanProperty( false );
      this.sweaterDetectedProperty = new BooleanProperty( false );
      this.wallDetectedProperty = new BooleanProperty( false );
    }
  }

  return balloonsAndStaticElectricity.register( 'ScanningPropertySet', ScanningPropertySet );
} );
