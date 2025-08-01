// Copyright 2019-2025, University of Colorado Boulder

/**
 * Set of Properties that indicate that a finger is over something while a user is scanning for elements in the view.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

export default class ScanningPropertySet {

  // is the finger over one of these objects?
  public readonly yellowBalloonDetectedProperty: BooleanProperty;
  public readonly sweaterDetectedProperty: BooleanProperty;
  public readonly wallDetectedProperty: BooleanProperty;

  public constructor() {

    this.yellowBalloonDetectedProperty = new BooleanProperty( false );
    this.sweaterDetectedProperty = new BooleanProperty( false );
    this.wallDetectedProperty = new BooleanProperty( false );
  }
}

balloonsAndStaticElectricity.register( 'ScanningPropertySet', ScanningPropertySet );