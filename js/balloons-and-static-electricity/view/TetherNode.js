// Copyright 2017-2020, University of Colorado Boulder

/**
 * A node that looks like a tether that holds the balloon to the ground. The use of the word 'string' has been avoided
 * in the name and the documentation for (hopefully) obvious reasons.
 *
 * @author John Blanco
 */

import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

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

  balloonModel.positionProperty.link( function( position ) {
    const attachmentPoint = position.plus( tetherPointOffset );
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

inherit( Path, TetherNode );
export default TetherNode;