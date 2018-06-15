// Copyright 2017, University of Colorado Boulder

/**
 * A node that looks like a tether that holds the balloon to the ground. The use of the word 'string' has been avoided
 * in the name and the documentation for (hopefully) obvious reasons.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
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

    Path.call( this, null, {
      stroke: '#000000',
      lineWidth: 1,
      pickable: false,
      tandem: tandem
    } );

    var anchorPointCopy = anchorPoint.copy();

    balloonModel.locationProperty.link( function( location ) {
      var attachmentPoint = location.plus( tetherPointOffset );
      self.shape = new Shape()
        .moveToPoint( anchorPointCopy )
        .quadraticCurveTo(
          attachmentPoint.x,
          ( anchorPointCopy.y + attachmentPoint.y ) / 2,
          attachmentPoint.x,
          attachmentPoint.y
        );
    } );
  }

  balloonsAndStaticElectricity.register( 'TetherNode', TetherNode );

  return inherit( Path, TetherNode );
} );
