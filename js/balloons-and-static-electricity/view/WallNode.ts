// Copyright 2013-2026, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the wall of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import wall_png from '../../../images/wall_png.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import BASEModel from '../model/BASEModel.js';
import ChargesCanvasNode from './ChargesCanvasNode.js';
import WallDescriber from './describers/WallDescriber.js';

const wallLabelString = BASEA11yStrings.wallLabel.value;

export default class WallNode extends Node {

  private readonly model: BASEModel;
  private readonly wallDescriber: WallDescriber;
  public readonly wallNode: Image;

  public constructor( model: BASEModel ) {

    super( {
      pickable: false,

      // accessibility options
      accessibleHeading: wallLabelString
    } );

    this.model = model;
    const wallModel = model.wall;

    // manages a11y descriptions for the wall
    this.wallDescriber = new WallDescriber( model );

    this.translate( wallModel.x, 0 );

    // add the background
    this.wallNode = new Image( wall_png );

    this.addChild( this.wallNode );

    // The wall charges are rendered using Canvas for performance, bounds widened so that charges are fully visible in
    // wider layouts, see #409.
    const wallBounds = new Bounds2( 0, 0, wallModel.width + 20, wallModel.height );
    const chargesCanvasNode = new ChargesCanvasNode( wallModel.x, wallBounds, wallModel.plusCharges, wallModel.minusCharges );
    this.addChild( chargesCanvasNode );

    wallModel.isVisibleProperty.link( isVisible => {
      this.visible = isVisible;
    } );

    // show charges based on draw property
    model.showChargesProperty.link( value => {
      chargesCanvasNode.visible = ( value === 'allCharges' );
    } );

    // pdom - when the balloons change position, update the description of the induced charge in the wall
    const updateWallDescription = () => {
      this.setDescriptionContent( this.wallDescriber.getWallDescription( model.yellowBalloon, model.greenBalloon, model.getBalloonsAdjacent() ) );
    };

    // pdom - attach listeners to update descriptions of the wall, no need to dispose
    Multilink.multilink( [
      model.yellowBalloon.positionProperty,
      model.greenBalloon.positionProperty,
      model.greenBalloon.isVisibleProperty,
      model.showChargesProperty
    ], updateWallDescription );

    // Update wall charge rendering when balloons affect induced charge.
    const invalidateChargesNodePaint = chargesCanvasNode.invalidatePaint.bind( chargesCanvasNode );
    Multilink.multilink( [
      model.yellowBalloon.positionProperty,
      model.greenBalloon.positionProperty,
      model.yellowBalloon.isVisibleProperty,
      model.greenBalloon.isVisibleProperty,
      model.yellowBalloon.chargeProperty,
      model.greenBalloon.chargeProperty
    ], invalidateChargesNodePaint );
  }
}
