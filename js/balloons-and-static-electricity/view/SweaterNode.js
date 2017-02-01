// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the sweater of the model.
 *
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Range = require( 'DOT/Range' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // phet-io modules
  var phetio = require( 'ifphetio!PHET_IO/phetio' );

  // constants - ranges to describe charges in the sweater
  var A_FEW_RANGE = new Range( 1, 15 );
  var SEVERAL_RANGE = new Range( 15, 40 );
  var MANY_RANGE = new Range( 40, 56 );
  var MAX_CHARGE = 57;

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

      // accessibility options
      tagName: 'div', // sweater is just a div
      labelTagName: 'h3', // label is identified as a heading of level 3
      accessibleLabel: BASEA11yStrings.sweaterLabelString,
      descriptionTagName: 'p'
    } );

    this.plusChargesNode = new Node( { tandem: tandem.createTandem( 'plusChargesNode' ) } );
    this.minusChargesNode = new Node( {
      layerSplit: true,
      tandem: tandem.createTandem( 'minusChargesNode' )
    } );
    this.sweaterModel = model.sweater;

    // add the Sweater image
    this.addChild( new Image( sweater, {
      x: this.sweaterModel.x + 25,
      y: this.sweaterModel.y + 70,
      scale: 0.47,
      tandem: tandem.createTandem( 'sweater' )
    } ) );

    //draw plus and minus charges
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

    //show all, none or charge difference
    var updateChargesVisibilityOnSweater = function( value ) {
      if ( value === 'none' ) {
        self.plusChargesNode.visible = false;
        self.minusChargesNode.visible = false;
      }
      else {
        self.plusChargesNode.visible = true;
        self.minusChargesNode.visible = true;
        var showAll = (value === 'all');
        for ( var i = 0; i < self.sweaterModel.minusCharges.length; i++ ) {
          var plusChargeNodes = self.plusChargesNode.children;
          var minusChargeNodes = self.minusChargesNode.children;
          plusChargeNodes[ i ].visible = showAll ||
                                                            self.sweaterModel.minusCharges[ i ].movedProperty.get();
          minusChargeNodes[ i ].visible = showAll && !self.sweaterModel.minusCharges[ i ].movedProperty.get();
        }
      }
    };

    model.showChargesProperty.link( function( value ) {
      updateChargesVisibilityOnSweater( value );
    } );

    this.sweaterModel.chargeProperty.link( function( charge ) {
      updateChargesVisibilityOnSweater( model.showChargesProperty.get() );

      // a11y - update description of sweater when charge changes
      var chargeDescription = self.getChargeDescription( charge );
      self.setAccessibleDescription( chargeDescription );
    } );

    // When setting the state using phet-io, we must update the charge visibility, otherwise they can get out of sync
    // due to the fact that the movedProperty state could get loaded before the chargeProperty state.
    phetio.setStateEmitter && phetio.setStateEmitter.addListener( function() {
      updateChargesVisibilityOnSweater( model.showChargesProperty.get() );
    } );
  }

  balloonsAndStaticElectricity.register( 'SweaterNode', SweaterNode );

  return inherit( Node, SweaterNode, {

    /**
     * Get a description for the sweater, based on its charge.
     *
     * @param  {number} charge
     * @return {string}
     */
    getChargeDescription: function( charge ) {
      var chargeString;
      var neutralityString;

      if ( charge === 0 ) {
        chargeString = BASEA11yStrings.noString;
        neutralityString = BASEA11yStrings.neutralString;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        chargeString = BASEA11yStrings.aFewString;
        neutralityString = BASEA11yStrings.positiveString;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        chargeString = BASEA11yStrings.severalString;
        neutralityString = BASEA11yStrings.positiveString;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        chargeString = BASEA11yStrings.manyString;
        neutralityString = BASEA11yStrings.positiveString;
      }
      else if ( charge === MAX_CHARGE ) {

        // if no more negative charges remain on sweater, return this immediately
        return BASEA11yStrings.sweaterChargeDepletedString;
      }

      return StringUtils.format( BASEA11yStrings.sweaterDescriptionPatternString, neutralityString, chargeString );
    }
  } );
} );
