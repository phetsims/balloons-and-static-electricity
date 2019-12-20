// Copyright 2013-2019, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the sweater of the model.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  const BASEQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEQueryParameters' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  const Property = require( 'AXON/Property' );
  const SweaterDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/SweaterDescriber' );

  // a11y strings
  const sweaterLabelString = BASEA11yStrings.sweaterLabel.value;

  // images
  const sweater = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/sweater.png' );

  /**
   * @constructor
   * @param {BASEModel} model
   * @param {Tandem} tandem
   */
  function SweaterNode( model, tandem ) {
    const self = this;

    Node.call( this, {
      pickable: false,

      // a11y
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

    // scale image to match model, then set position
    sweaterImageNode.scale(
      this.sweaterModel.width / sweaterImageNode.width,
      this.sweaterModel.height / sweaterImageNode.height
    );

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

        const showAll = ( model.showChargesProperty.get() === 'all');
        for ( let i = 0; i < self.sweaterModel.minusCharges.length; i++ ) {
          const plusChargeNodes = self.plusChargesNode.children;
          const minusChargeNodes = self.minusChargesNode.children;
          plusChargeNodes[ i ].visible = showAll ||
                                         self.sweaterModel.minusCharges[ i ].movedProperty.get();
          minusChargeNodes[ i ].visible = showAll && !self.sweaterModel.minusCharges[ i ].movedProperty.get();
        }
      }
    };

    // a11y - construct a type that manages descriptions depending on the state of the model
    const sweaterDescriber = new SweaterDescriber( model, this.sweaterModel );

    Property.multilink( [ model.showChargesProperty, this.sweaterModel.chargeProperty ], function( showCharges, charge ) {
      updateChargesVisibilityOnSweater( charge );

      self.setDescriptionContent( sweaterDescriber.getSweaterDescription( showCharges ) );
    } );

    // When setting the state using phet-io, we must update the charge visibility, otherwise they can get out of sync
    // due to the fact that the movedProperty state could get loaded before the chargeProperty state.
    _.hasIn( window, 'phet.phetIo.phetioEngine' ) && phet.phetIo.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( function() {
      updateChargesVisibilityOnSweater( model.showChargesProperty.get() );
    } );
  }

  balloonsAndStaticElectricity.register( 'SweaterNode', SweaterNode );

  return inherit( Node, SweaterNode, {} );
} );
