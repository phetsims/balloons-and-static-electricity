// Copyright 2017-2021, University of Colorado Boulder

/**
 * Constants used throughout the simulation.
 *
 * @author Jesse Greenberg
 */

import Property from '../../../axon/js/Property.js';
import balloonsAndStaticElectricity from '../balloonsAndStaticElectricity.js';

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

export default BASEConstants;