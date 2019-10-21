// Copyright 2017-2019, University of Colorado Boulder

/**
 * Constants used throughout the simulation.
 * 
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const Property = require( 'AXON/Property' );

  const BASEConstants = {
    backgroundColorProperty: new Property( 'rgb( 151, 208, 255 )' ),
    msScaleFactor: 1000, // to convert seconds to milliseconds, used throughout the view
    MAX_BALLOON_CHARGE: 57, // max number of charges the balloon can have
    COULOMBS_LAW_CONSTANT: 10000, // used when calculating force, value chosen so sim looks like Java version

    // in view coordinates, to match the layout of charge images before using node.rasterized(), because
    // node.toImage() automatically added some padding, see
    // https://github.com/phetsims/balloons-and-static-electricity/issues/434
    IMAGE_PADDING: 1,

    // scale for image charges so they look less pixelated after being rasterized
    IMAGE_SCALE: 2
  };

  balloonsAndStaticElectricity.register( 'BASEConstants', BASEConstants );

  return BASEConstants;
} );