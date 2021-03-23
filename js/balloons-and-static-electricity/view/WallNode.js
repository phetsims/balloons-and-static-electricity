// Copyright 2013-2020, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the wall of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import wallImage from '../../../images/wall_png.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import ChargeDeflectionSoundGenerator from './ChargeDeflectionSoundGenerator.js';
import WallDescriber from './describers/WallDescriber.js';
import MinusChargesCanvasNode from './MinusChargesCanvasNode.js';
import PlusChargeNode from './PlusChargeNode.js';

const wallLabelString = BASEA11yStrings.wallLabel.value;

class WallNode extends Node {

  /**
   * @param {BASEModel} model
   * @param {number} layoutHeight
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

    // max charge deflection for the minus charges, experimentally determined
    const maxChargeDeflection = 50;

    // @private - sound generator for the deflection of the charges in the wall
    this.chargeDeflectionSoundGenerator = new ChargeDeflectionSoundGenerator(
      model.wall.minusCharges.slice( 0, model.wall.numY ), // use just the leftmost minus charges for this
      maxChargeDeflection,
      model.balloons,
      model.wall.isVisibleProperty,
      {
        // soundGenerationMode: ChargeDeflectionSoundGenerator.SoundGenerationMode.COLLECTIVE_CROSS_FADE,
        // soundGenerationMode: ChargeDeflectionSoundGenerator.SoundGenerationMode.INDIVIDUAL_PITCH,
        // soundGenerationMode: ChargeDeflectionSoundGenerator.SoundGenerationMode.INDIVIDUAL_CROSS_FADE,
        soundGenerationMode: ChargeDeflectionSoundGenerator.SoundGenerationMode.INDIVIDUAL_DISCRETE,

        continuousSoundIndex: 0,

        // Prevent sound from being produced until the balloon is close enough to the wall.
        minBalloonXValue: 400
      }
    );
    soundManager.addSoundGenerator( this.chargeDeflectionSoundGenerator );

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

  /**
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.chargeDeflectionSoundGenerator.step( dt );
  }
}

balloonsAndStaticElectricity.register( 'WallNode', WallNode );

export default WallNode;