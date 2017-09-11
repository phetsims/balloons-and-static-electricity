// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the sweater of the model.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var Property = require( 'AXON/Property' );
  var SweaterDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/SweaterDescriber' );

  // strings
  var sweaterLabelString = BASEA11yStrings.sweaterLabelString;

  // images
  var sweater = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/sweater.jpg' );

  /**
   * @constructor
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {Tandem} tandem
   */
  function SweaterNode( model, tandem ) {
    var self = this;

    Node.call( this, {
      pickable: false,

      // a11y
      tagName: 'div', // sweater is just a div
      labelTagName: 'h3', // label is identified as a heading of level 3
      accessibleLabel: sweaterLabelString,
      descriptionTagName: 'p'
    } );

    this.plusChargesNode = new Node( { tandem: tandem.createTandem( 'plusChargesNode' ) } );
    this.minusChargesNode = new Node( {
      layerSplit: true,
      tandem: tandem.createTandem( 'minusChargesNode' )
    } );
    this.sweaterModel = model.sweater;

    // create the sweater image
    var sweaterImageNode = new Image( sweater, { tandem: tandem.createTandem( 'sweater' ) } );

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
    if ( BalloonsAndStaticElectricityQueryParameters.showSweaterChargedArea ) {
      this.addChild( new Path( this.sweaterModel.chargedArea, {
        fill: 'rgba( 255, 255, 0, 0.5 )'
      } ) );
    }

    // draw plus and minus charges
    var plusChargeNodesTandemGroup = tandem.createGroupTandem( 'plusChargeNodes' );
    var minusChargeNodesTandemGroup = tandem.createGroupTandem( 'minusChargeNodes' );
    this.sweaterModel.plusCharges.forEach( function( plusCharge ) {
      var plusChargeNode = new PlusChargeNode( plusCharge.location, plusChargeNodesTandemGroup.createNextTandem() );
      self.plusChargesNode.addChild( plusChargeNode );
    } );
    this.sweaterModel.minusCharges.forEach( function( minusCharge ) {
      var minusChargeNode = new MinusChargeNode( minusCharge.location, minusChargeNodesTandemGroup.createNextTandem() );
      self.minusChargesNode.addChild( minusChargeNode );
    } );

    this.addChild( this.plusChargesNode );
    this.addChild( this.minusChargesNode );

    // show all, none or charge difference
    var updateChargesVisibilityOnSweater = function( value ) {
      if ( model.showChargesProperty.get() === 'none' ) {
        self.plusChargesNode.visible = false;
        self.minusChargesNode.visible = false;
      }
      else {
        self.plusChargesNode.visible = true;
        self.minusChargesNode.visible = true;

        var showAll = ( model.showChargesProperty.get() === 'all');
        for ( var i = 0; i < self.sweaterModel.minusCharges.length; i++ ) {
          var plusChargeNodes = self.plusChargesNode.children;
          var minusChargeNodes = self.minusChargesNode.children;
          plusChargeNodes[ i ].visible = showAll ||
                                         self.sweaterModel.minusCharges[ i ].movedProperty.get();
          minusChargeNodes[ i ].visible = showAll && !self.sweaterModel.minusCharges[ i ].movedProperty.get();
        }
      }
    };

    // a11y - construct a type that manages descriptions depending on the state of the model
    var sweaterDescriber = new SweaterDescriber( model, this.sweaterModel );

    Property.multilink( [ model.showChargesProperty, this.sweaterModel.chargeProperty ], function( showCharges, charge ) {
      updateChargesVisibilityOnSweater( charge );

      self.setAccessibleDescription( sweaterDescriber.getSweaterDescription( showCharges ) );
    } );

    // When setting the state using phet-io, we must update the charge visibility, otherwise they can get out of sync
    // due to the fact that the movedProperty state could get loaded before the chargeProperty state.
    phet.phetIo && phet.phetIo.phetio.setStateEmitter && phet.phetIo.phetio.setStateEmitter.addListener( function() {
      updateChargesVisibilityOnSweater( model.showChargesProperty.get() );
    } );
  }

  balloonsAndStaticElectricity.register( 'SweaterNode', SweaterNode );

  return inherit( Node, SweaterNode, {} );
} );
