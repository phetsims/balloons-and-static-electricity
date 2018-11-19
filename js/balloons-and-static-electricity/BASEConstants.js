// Copyright 2017-2018, University of Colorado Boulder

/**
 * Constants used throughout the simulation.
 * 
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Property = require( 'AXON/Property' );

  var BASEConstants = {
    backgroundColorProperty: new Property( 'rgb( 151, 208, 255 )' ),
    msScaleFactor: 1000, // to convert seconds to miliseconds, used throughout the view
    MAX_BALLOON_CHARGE: 57, // max number of charges the balloon can have
    COULOMBS_LAW_CONSTANT: 10000 // used when calculating force, value chosen so sim looks like Java version
  };

  balloonsAndStaticElectricity.register( 'BASEConstants', BASEConstants );

  return BASEConstants;
} );