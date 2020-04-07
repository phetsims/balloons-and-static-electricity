// Copyright 2013-2020, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the sweater of the model.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */

import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import sweater from '../../../images/sweater_png.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import BASEQueryParameters from '../BASEQueryParameters.js';
import SweaterDescriber from './describers/SweaterDescriber.js';
import MinusChargeNode from './MinusChargeNode.js';
import PlusChargeNode from './PlusChargeNode.js';

const sweaterLabelString = BASEA11yStrings.sweaterLabel.value;


/**
 * @constructor
 * @param {BASEModel} model
 * @param {Tandem} tandem
 */
function SweaterNode( model, tandem ) {
  const self = this;

  Node.call( this, {
    pickable: false,

    // pdom
    tagName: 'div', // sweater is just a div
    labelTagName: 'h3', // label is identified as a heading of level 3
    labelContent: sweaterLabelString
  } );

  this.plusChargesNode = new Node( { tandem: tandem.createTandem( 'plusChargesNode' ) } );
  this.minusChargesNode = new Node( {
    layerSplit: true,
    tandem: tandem.createTandem( 'minusChargesNode' )
  } );
  this.sweaterModel = model.sweater;

  // create the sweater image
  const sweaterImageNode = new Image( sweater, { tandem: tandem.createTandem( 'sweater' ) } );

  // Balloons and Static Electricity has unit tests which run outside of the context of SimLauncher and hence not all
  // images may have dimensions by now.
  if ( sweaterImageNode.width > 0 && sweaterImageNode.height > 0 ) {

    // scale image to match model, then set position
    sweaterImageNode.scale(
      this.sweaterModel.width / sweaterImageNode.width,
      this.sweaterModel.height / sweaterImageNode.height
    );
  }
  else {
    assert && assert( window.hasOwnProperty( 'QUnit' ), 'Images should have dimensions unless we are running a unit test' );
  }

  sweaterImageNode.left = this.sweaterModel.x;
  sweaterImageNode.top = this.sweaterModel.y;

  // add the sweater image
  this.addChild( sweaterImageNode );

  // show the charge area
  if ( BASEQueryParameters.showSweaterChargedArea ) {
    this.addChild( new Path( this.sweaterModel.chargedArea, {
      fill: 'rgba( 255, 255, 0, 0.5 )'
    } ) );
  }

  // draw plus and minus charges
  const plusChargeNodesTandemGroup = tandem.createGroupTandem( 'plusChargeNodes' );
  const minusChargeNodesTandemGroup = tandem.createGroupTandem( 'minusChargeNodes' );
  this.sweaterModel.plusCharges.forEach( function( plusCharge ) {
    const plusChargeNode = new PlusChargeNode( plusCharge.position, plusChargeNodesTandemGroup.createNextTandem() );
    self.plusChargesNode.addChild( plusChargeNode );
  } );
  this.sweaterModel.minusCharges.forEach( function( minusCharge ) {
    const minusChargeNode = new MinusChargeNode( minusCharge.position, minusChargeNodesTandemGroup.createNextTandem() );
    self.minusChargesNode.addChild( minusChargeNode );
  } );

  this.addChild( this.plusChargesNode );
  this.addChild( this.minusChargesNode );

  // show all, none or charge difference
  const updateChargesVisibilityOnSweater = function( value ) {
    if ( model.showChargesProperty.get() === 'none' ) {
      self.plusChargesNode.visible = false;
      self.minusChargesNode.visible = false;
    }
    else {
      self.plusChargesNode.visible = true;
      self.minusChargesNode.visible = true;

      const showAll = ( model.showChargesProperty.get() === 'all' );
      for ( let i = 0; i < self.sweaterModel.minusCharges.length; i++ ) {
        const plusChargeNodes = self.plusChargesNode.children;
        const minusChargeNodes = self.minusChargesNode.children;
        plusChargeNodes[ i ].visible = showAll ||
                                       self.sweaterModel.minusCharges[ i ].movedProperty.get();
        minusChargeNodes[ i ].visible = showAll && !self.sweaterModel.minusCharges[ i ].movedProperty.get();
      }
    }
  };

  // pdom - construct a type that manages descriptions depending on the state of the model
  const sweaterDescriber = new SweaterDescriber( model, this.sweaterModel );

  Property.multilink( [ model.showChargesProperty, this.sweaterModel.chargeProperty ], function( showCharges, charge ) {
    updateChargesVisibilityOnSweater( charge );

    self.setDescriptionContent( sweaterDescriber.getSweaterDescription( showCharges ) );
  } );

  // When setting the state using phet-io, we must update the charge visibility, otherwise they can get out of sync
  // due to the fact that the movedProperty state could get loaded before the chargeProperty state.
  _.hasIn( window, 'phet.phetio.phetioEngine' ) && phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( function() {
    updateChargesVisibilityOnSweater( model.showChargesProperty.get() );
  } );
}

balloonsAndStaticElectricity.register( 'SweaterNode', SweaterNode );

export default inherit( Node, SweaterNode, {} );