// Copyright 2017-2025, University of Colorado Boulder

/**
 * A node that looks like a tether that holds the balloon to the ground. The use of the word 'string' has been avoided
 * in the name and the documentation for (hopefully) obvious reasons.
 *
 * @author John Blanco
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

class TetherNode extends Path {

  /**
   * @param  {BalloonModel} balloonModel
   * @param  {Vector2} anchorPoint
   * @param  {Vector2} tetherPointOffset
   * @param  {Tandem} tandem
   */
  constructor( balloonModel, anchorPoint, tetherPointOffset, tandem ) {

    const anchorPointCopy = anchorPoint.copy();

    super( new DerivedProperty( [ balloonModel.positionProperty ], position => {
      const attachmentPoint = position.plus( tetherPointOffset );
      return new Shape()
        .moveToPoint( anchorPointCopy )
        .quadraticCurveTo(
          attachmentPoint.x,
          ( anchorPointCopy.y + attachmentPoint.y ) / 2,
          attachmentPoint.x,
          attachmentPoint.y
        );
    } ), {
      stroke: '#000000',
      lineWidth: 1,
      pickable: false,
      tandem: tandem
    } );
  }
}

balloonsAndStaticElectricity.register( 'TetherNode', TetherNode );

export default TetherNode;