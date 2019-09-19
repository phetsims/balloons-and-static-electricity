// Copyright 2017-2018, University of Colorado Boulder

/**
 * A node that looks like a tether that holds the balloon to the ground. The use of the word 'string' has been avoided
 * in the name and the documentation for (hopefully) obvious reasons.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );

  /**
   * @param  {BalloonModel} balloonModel
   * @param  {Vector2} anchorPoint
   * @param  {Vector2} tetherPointOffset
   * @param  {Tandem} tandem
   * @constructor
   */
  function TetherNode( balloonModel, anchorPoint, tetherPointOffset, tandem ) {
    const self = this;

    Path.call( this, null, {
      stroke: '#000000',
      lineWidth: 1,
      pickable: false,
      tandem: tandem
    } );

    const anchorPointCopy = anchorPoint.copy();

    balloonModel.locationProperty.link( function( location ) {
      const attachmentPoint = location.plus( tetherPointOffset );
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
