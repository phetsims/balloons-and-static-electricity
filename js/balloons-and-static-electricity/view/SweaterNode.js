// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the sweater of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var AccessibleNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Range = require( 'DOT/Range' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // constants - ranges to describe charges in the sweater
  var A_FEW_RANGE = new Range( 0, 15 );
  var SEVERAL_RANGE = new Range( 15, 40 );
  var MANY_RANGE = new Range( 40, 56 );
  var MAX_CHARGE = 57;

  // strings
  var sweaterLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/sweater.label' );
  var sweaterDescriptionPatternString = 'Sweater has net {0} charge, {1} more positive charges than negative charges';
  var sweaterChargeDepletedString = 'Sweater has a net positive charge, no negative charges, only positive charges';

  var neutralString = 'neutral';
  var positiveString = 'positive';

  var noString = 'no';
  var aFewString = 'a few';
  var severalString = 'several';
  var manyString = 'many';

  // images
  var sweater = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/sweater.jpg' );

  function SweaterNode( model ) {
    var self = this;

    // super constructor
    AccessibleNode.call( this, null, {
      pickable: false,

      // accesssibility options
      tagName: 'div', // sweater is just a div
      labelTagName: 'h3', // label is identified as a heading of level 3
      label: sweaterLabelString
    } );

    this.plusChargesNode = new Node();
    this.minusChargesNode = new Node( { layerSplit: true } );
    this.sweaterModel = model.sweater;

    // add the Sweater image
    this.addChild( new Image( sweater, {
      x: this.sweaterModel.x + 25,
      y: this.sweaterModel.y + 70,
      scale: 0.47
    } ) );

    //draw plus and minus charges
    this.sweaterModel.plusCharges.forEach( function( entry ) {
      entry.view = new PlusChargeNode( entry.location );
      self.plusChargesNode.addChild( entry.view );
    } );
    this.sweaterModel.minusCharges.forEach( function( entry ) {
      entry.view = new MinusChargeNode( entry.location );
      entry.locationProperty.link( function updateLocation( location ) {
        entry.view.setTranslation( location );
      } );
      self.minusChargesNode.addChild( entry.view );
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
        for ( var i = 0, l = self.sweaterModel.minusCharges.length; i < l; i++ ) {
          self.sweaterModel.plusCharges[ i ].view.visible = !!(showAll || self.sweaterModel.minusCharges[ i ].moved);
          self.sweaterModel.minusCharges[ i ].view.visible = !!(showAll && !self.sweaterModel.minusCharges[ i ].moved);
        }
      }
    };

    model.showChargesProperty.link( function( value ) {
      updateChargesVisibilityOnSweater( value );
    } );

    this.sweaterModel.chargeProperty.link( function( charge ) {
      updateChargesVisibilityOnSweater( model.showCharges );

      // a11y - update description of sweater when charge changes
      var chargeDescription = self.getChargeDescription( charge );
      self.setDescription( chargeDescription );
      console.log( chargeDescription );
    } );
  }

  balloonsAndStaticElectricity.register( 'SweaterNode', SweaterNode );

  return inherit( AccessibleNode, SweaterNode, {

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
        chargeString = noString;
        neutralityString = neutralString;
      }
      if ( A_FEW_RANGE.contains( charge ) ) {
        chargeString = aFewString;
        neutralityString = positiveString;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        chargeString = severalString;
        neutralityString = positiveString;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        chargeString = manyString;
        neutralityString = positiveString;
      }
      else if ( charge === MAX_CHARGE ){

        // if no more negative charges remain on sweater, return this immediately
        return sweaterChargeDepletedString;
      }

      return StringUtils.format( sweaterDescriptionPatternString, neutralityString, chargeString );
    }
  } );
} );
