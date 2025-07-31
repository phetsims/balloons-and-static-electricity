// Copyright 2013-2025, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the sweater of the model.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import sweater_png from '../../../images/sweater_png.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import BASEQueryParameters from '../BASEQueryParameters.js';
import BASEModel from '../model/BASEModel.js';
import SweaterModel from '../model/SweaterModel.js';
import SweaterDescriber from './describers/SweaterDescriber.js';
import MinusChargeNode from './MinusChargeNode.js';
import PlusChargeNode from './PlusChargeNode.js';

const sweaterLabelString = BASEA11yStrings.sweaterLabel.value;


class SweaterNode extends Node {

  private readonly plusChargesNode: Node;
  private readonly minusChargesNode: Node;
  private readonly sweaterModel: SweaterModel;

  public constructor( model: BASEModel, tandem: Tandem ) {

    super( {
      pickable: false,

      // pdom
      accessibleHeading: sweaterLabelString
    } );

    this.plusChargesNode = new Node( { tandem: tandem.createTandem( 'plusChargesNode' ) } );
    this.minusChargesNode = new Node( {
      layerSplit: true,
      tandem: tandem.createTandem( 'minusChargesNode' )
    } );
    this.sweaterModel = model.sweater;

    // create the sweater image
    const sweater = new Image( sweater_png, { tandem: tandem.createTandem( 'sweater' ) } );

    // Balloons and Static Electricity has unit tests which run outside the context of simLauncher and hence not all
    // images may have dimensions by now.
    if ( sweater.width > 0 && sweater.height > 0 ) {

      // scale image to match model, then set position
      sweater.scale(
        this.sweaterModel.width / sweater.width,
        this.sweaterModel.height / sweater.height
      );
    }
    else {
      assert && assert( window.hasOwnProperty( 'QUnit' ), 'Images should have dimensions unless we are running a unit test' );
    }

    sweater.left = this.sweaterModel.x;
    sweater.top = this.sweaterModel.y;

    // add the sweater image
    this.addChild( sweater );

    // show the charge area
    if ( BASEQueryParameters.showSweaterChargedArea ) {
      this.addChild( new Path( this.sweaterModel.chargedArea, {
        fill: 'rgba( 255, 255, 0, 0.5 )'
      } ) );
    }

    // draw plus and minus charges
    this.sweaterModel.plusCharges.forEach( plusCharge => {
      this.plusChargesNode.addChild( new PlusChargeNode( plusCharge.position ) );
    } );
    this.sweaterModel.minusCharges.forEach( minusCharge => {
      this.minusChargesNode.addChild( new MinusChargeNode( minusCharge.position ) );
    } );

    this.addChild( this.plusChargesNode );
    this.addChild( this.minusChargesNode );

    // show all, none or charge difference
    const updateChargesVisibilityOnSweater = () => {
      if ( model.showChargesProperty.get() === 'none' ) {
        this.plusChargesNode.visible = false;
        this.minusChargesNode.visible = false;
      }
      else {
        this.plusChargesNode.visible = true;
        this.minusChargesNode.visible = true;

        const showAll = ( model.showChargesProperty.get() === 'all' );
        for ( let i = 0; i < this.sweaterModel.minusCharges.length; i++ ) {
          const plusChargeNodes = this.plusChargesNode.children;
          const minusChargeNodes = this.minusChargesNode.children;
          plusChargeNodes[ i ].visible = showAll ||
                                         this.sweaterModel.minusCharges[ i ].movedProperty.get();
          minusChargeNodes[ i ].visible = showAll && !this.sweaterModel.minusCharges[ i ].movedProperty.get();
        }
      }
    };

    // pdom - construct a type that manages descriptions depending on the state of the model
    const sweaterDescriber = new SweaterDescriber( model, this.sweaterModel );

    Multilink.multilink( [ model.showChargesProperty, this.sweaterModel.chargeProperty ], ( showCharges, charge ) => {
      updateChargesVisibilityOnSweater();

      this.setDescriptionContent( sweaterDescriber.getSweaterDescription( showCharges ) );
    } );

    // When setting the state using phet-io, we must update the charge visibility, otherwise they can get out of sync
    // due to the fact that the movedProperty state could get loaded before the chargeProperty state.
    phetioStateSetEmitter.addListener( () => {
      updateChargesVisibilityOnSweater();
    } );
  }
}

balloonsAndStaticElectricity.register( 'SweaterNode', SweaterNode );
export default SweaterNode;