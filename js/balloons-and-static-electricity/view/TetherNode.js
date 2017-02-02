// Copyright 2017, University of Colorado Boulder

/**
 * node that looks like a tether that holds the balloon to the ground (the use of the word 'string' has been avoided
 * for (hopefully) obvious reasons
 *
 @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var TandemPath = require( 'TANDEM/scenery/nodes/TandemPath' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param  {BalloonModel} balloonModel
   * @param  {Vector2} anchorPoint
   * @param  {Vector2} tetherPointOffset
   * @param  {Tandem} tandem
   * @constructor
   */
  function TetherNode( balloonModel, anchorPoint, tetherPointOffset, tandem ) {
    var self = this;

    TandemPath.call( this, null, {
      stroke: '#000000',
      lineWidth: 1,
      pickable: false,
      tandem: tandem
    } );

    balloonModel.locationProperty.link( function( location ) {
      self.shape = new Shape()
        .moveToPoint( anchorPoint )
        .lineToPoint( location.plus( tetherPointOffset ) );
    } );
  }

  balloonsAndStaticElectricity.register( 'TetherNode', TetherNode );

  return inherit( TandemPath, TetherNode );
} );
