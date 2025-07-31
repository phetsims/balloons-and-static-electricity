// Copyright 2013-2025, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the wall of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import wall_png from '../../../images/wall_png.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import BASEModel from '../model/BASEModel.js';
import WallDescriber from './describers/WallDescriber.js';
import MinusChargesCanvasNode from './MinusChargesCanvasNode.js';
import PlusChargeNode from './PlusChargeNode.js';

const wallLabelString = BASEA11yStrings.wallLabel.value;

class WallNode extends Node {

  private readonly model: BASEModel;
  private readonly wallDescriber: WallDescriber;
  public readonly wallNode: Image;

  public constructor( model: BASEModel, layoutHeight: number, tandem: Tandem ) {

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
    this.wallNode = new Image( wall_png, { tandem: tandem.createTandem( 'wallNode' ) } );

    this.addChild( this.wallNode );

    const plusChargesNode = new Node( { tandem: tandem.createTandem( 'plusChargesNode' ) } );
    plusChargesNode.translate( -wallModel.x, 0 );

    // draw plusCharges on the wall
    wallModel.plusCharges.forEach( entry => {
      plusChargesNode.addChild( new PlusChargeNode( entry.position ) );
    } );
    this.addChild( plusChargesNode );

    // The minus charges on the wall and rendered using Canvas for performance, bounds widened so that charges are fully
    // visible in wider layouts, see #409.
    const wallBounds = new Bounds2( 0, 0, wallModel.width + 20, wallModel.height );
    const minusChargesNode = new MinusChargesCanvasNode( wallModel.x, wallBounds, wallModel.minusCharges );
    this.addChild( minusChargesNode );

    wallModel.isVisibleProperty.link( isVisible => {
      this.visible = isVisible;
    } );

    // show charges based on draw property
    model.showChargesProperty.link( value => {
      plusChargesNode.visible = ( value === 'all' );
      minusChargesNode.visible = ( value === 'all' );
    } );

    // pdom - when the balloons change position, update the description of the induced charge in the wall
    const updateWallDescription = () => {
      this.setDescriptionContent( this.wallDescriber.getWallDescription( model.yellowBalloon, model.greenBalloon, model.getBalloonsAdjacent() ) );
    };

    // pdom - attach listeners to update descriptions of the wall, no need to dispose
    model.yellowBalloon.positionProperty.link( updateWallDescription );
    model.greenBalloon.positionProperty.link( updateWallDescription );
    model.greenBalloon.isVisibleProperty.link( updateWallDescription );
    model.showChargesProperty.link( updateWallDescription );

    // Update minus charges indicating induced charge when balloons move.
    model.yellowBalloon.positionProperty.link( minusChargesNode.invalidatePaint.bind( minusChargesNode ) );
    model.greenBalloon.positionProperty.link( minusChargesNode.invalidatePaint.bind( minusChargesNode ) );
  }
}

balloonsAndStaticElectricity.register( 'WallNode', WallNode );

export default WallNode;