// Copyright 2013-2019, University of Colorado Boulder

/**
 * A single point change, which has a position.  The position is intended to never change.  Most charges in this
 * sim do not require observable Properties, so using this type for most of these can improve performance.
 * If the charge needs an observable dynamic position, please use MovablePointChargeModel.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const RADIUS = 8;

  //1,754 = 100/57 - to get relevant to original java model, where we have 100 sweater's charges (in this model only 57 )
  const CHARGE = -1.754;

  /**
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {Tandem} tandem
   * @param phetioState
   */
  function PointChargeModel( x, y, tandem, phetioState ) {

    // @public (read-only) - position of this charge
    this.position = new Vector2( x, y );

    // @public {boolean} - whether or not the charge has been moved from sweater to balloon
    this.movedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'movedProperty' ),
      phetioState: phetioState
    } );
  }

  balloonsAndStaticElectricity.register( 'PointChargeModel', PointChargeModel );

  inherit( Object, PointChargeModel, {

    /**
     * @public
     */
    reset: function() {
      this.movedProperty.reset();
    },

    /**
     * Get center of charge.
     *
     * @public
     * @returns {Vector2}
     */
    getCenter: function() {
      return new Vector2( this.position.x + this.radius, this.position.y + this.radius );
    }
  }, {

    // @public static properties
    RADIUS: RADIUS,
    CHARGE: CHARGE
  } );

  return PointChargeModel;
} );
