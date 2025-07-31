// Copyright 2019-2021, University of Colorado Boulder

/**
 * Set of Properties that indicate that a finger is over an something while a user is scanning for elements in the view.
 *
 * @author Jesse Greenberg
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

class ScanningPropertySet {
  constructor() {

    // @public - is the finger over one of these objects?
    this.yellowBalloonDetectedProperty = new BooleanProperty( false );
    this.sweaterDetectedProperty = new BooleanProperty( false );
    this.wallDetectedProperty = new BooleanProperty( false );
  }
}

balloonsAndStaticElectricity.register( 'ScanningPropertySet', ScanningPropertySet );
export default ScanningPropertySet;