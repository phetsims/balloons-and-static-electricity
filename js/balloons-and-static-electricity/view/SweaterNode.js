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
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var sweaterLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/sweater.label' );
  var sweaterDescriptionPatternString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/sweater.descriptionPattern' );
  var neutralString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/neutral' );
  var netPositiveString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/netPositive' );
  var noString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/no' );
  var aFewString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/aFew' );
  var severalString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/several' );
  var manyString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/many' );
  var sweaterNoMoreChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/sweater.noMoreCharges' );

  // images
  var sweater = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/sweater.jpg' );

  // // a map to get the correct charge description for the sweater - based on the net model charge
  // var chargeAmountDescriptionMap = {
  //   0: noString,
  //   5: aFewString,
  //   25: severalString,
  //   45: manyString
  // };

  function SweaterNode( model ) {
    var self = this;

    // super constructor
    Node.call( this, { pickable: false } );

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

    this.sweaterModel.chargeProperty.link( function() {
      updateChargesVisibilityOnSweater( model.showCharges );
    } );

    // outfit a11y
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        // the parallel DOM element should look like this:
        // <!-- Sweater is not in the tab order, but needs to be a live region, so changes in charges are communicated. -->
        //  <div id="sweater-widget" aria-labelledby="sweater-label" aria-describedby="balloon-description">
        //    <h3 id="sweater-label">Sweater</h3>
        //    <!-- Sweater charge information changes and will need to be associated with the balloon. -->
        //    <p id="sweater-description">The sweater has a neutral charge, no more positive charges than negative ones.</p>
        //  </div>  

        // create the div element and assign it a unique id.
        var domElement = document.createElement( 'div' );
        domElement.id = 'sweater-' + uniqueId;
        domElement.setAttribute( 'aria-live', 'polite' );

        // create the label element, and assign it as an aria label for the above div
        var labelElement = document.createElement( 'h3' );
        labelElement.textContent = sweaterLabelString;
        labelElement.id = 'sweater-label-' + uniqueId;
        domElement.setAttribute( 'aria-labelledby', labelElement.id );

        // create the description element and assign it a unique id.
        var descriptionElement = document.createElement( 'p' );
        descriptionElement.id = 'sweater-description-' + uniqueId;

        domElement.setAttribute( 'aria-describedby', descriptionElement.id );

        // structure the elements
        domElement.appendChild( labelElement );
        domElement.appendChild( descriptionElement );

        // build up the correct charge description based on the state of the model
        var createDescription = function( charge ) {
          var chargeNeutralityDescriptionString = charge > 0 ? netPositiveString : neutralString;

          var chargeAmountString;
          if( charge === 0 ) {
            chargeAmountString = noString;
          }
          else if( charge <= 15 ) {
            chargeAmountString = aFewString;
          }
          else if( charge <= 40 && charge > 10 ) {
            chargeAmountString = severalString;
          }
          else if ( charge > 40 ) {
            chargeAmountString = manyString;
          }
          assert && assert( chargeAmountString, 'String charge amount description not defined.' );

          // build the formatted string
          var chargeDescriptionString = StringUtils.format( sweaterDescriptionPatternString, chargeNeutralityDescriptionString, chargeAmountString );

          // notify if no more charges remain on sweater
          return charge === 57 ? chargeDescriptionString + ' ' + sweaterNoMoreChargesString : chargeDescriptionString;
        };

        // whenever the model charge changes, update the accesible description
        self.sweaterModel.chargeProperty.link( function( charge ) {
          descriptionElement.textContent = createDescription( charge );
        } );

        return new AccessiblePeer( accessibleInstance, domElement );

      }
    };
  }

  return inherit( Node, SweaterNode );
} );
