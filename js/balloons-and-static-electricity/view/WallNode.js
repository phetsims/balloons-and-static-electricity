// Copyright 2013-2020, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the wall of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import wallImage from '../../../images/wall_png.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import MinusChargesCanvasNode from './MinusChargesCanvasNode.js';
import PlusChargeNode from './PlusChargeNode.js';
import WallDescriber from './describers/WallDescriber.js';

const wallLabelString = BASEA11yStrings.wallLabel.value;

class WallNode extends Node {

  /**
   * @param {BASEModel} model
   * @param {Tandem} tandem
   */
  constructor( model, layoutHeight, tandem ) {

    super( {
      pickable: false,

      // accessibility options
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: wallLabelString
    } );

    // @private
    this.model = model;
    const wallModel = model.wall;

    // manages a11y descriptions for the wall
    this.wallDescriber = new WallDescriber( model );

    this.translate( wallModel.x, 0 );

    // add the background
    this.wallNode = new Image( wallImage, { tandem: tandem.createTandem( 'wallNode' ) } );

    this.addChild( this.wallNode );

    const plusChargesNode = new Node( { tandem: tandem.createTandem( 'plusChargesNode' ) } );
    plusChargesNode.translate( -wallModel.x, 0 );

    //draw plusCharges on the wall
    wallModel.plusCharges.forEach( entry => {
      const plusChargeNode = new PlusChargeNode( entry.position, Tandem.OPT_OUT );
      plusChargesNode.addChild( plusChargeNode );
    } );
    this.addChild( plusChargesNode );

    // the minus charges on the wall - with Canvas for performance, bounds widened so that charges are fully
    // visible in wider layouts, see #409
    const wallBounds = new Bounds2( 0, 0, wallModel.width + 20, wallModel.height );
    const minusChargesNode = new MinusChargesCanvasNode( wallModel.x, wallBounds, wallModel.minusCharges );
    this.addChild( minusChargesNode );

    wallModel.isVisibleProperty.link( isVisible => {
      this.visible = isVisible;
    } );

    //show charges based on draw  property
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

    // update minus charges indicating induced charge when balloons move
    model.yellowBalloon.positionProperty.link( minusChargesNode.invalidatePaint.bind( minusChargesNode ) );
    model.greenBalloon.positionProperty.link( minusChargesNode.invalidatePaint.bind( minusChargesNode ) );
  }
}

balloonsAndStaticElectricity.register( 'WallNode', WallNode );

export default WallNode;