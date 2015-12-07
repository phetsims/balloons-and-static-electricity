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

  // strings
  var sweaterLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/sweater.label' );
  var sweaterDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/sweater.description' );

  // images
  var sweater = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/sweater.jpg' );

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

        // create the label element, and assign it as an aria label for the above div
        var labelElement = document.createElement( 'h3' );
        labelElement.innerText = sweaterLabelString;
        labelElement.id = 'sweater-label-' + uniqueId;
        domElement.setAttribute( 'aria-labelledby', labelElement.id );

        // create the description element and assign it a unique id.
        var descriptionElement = document.createElement( 'p' );
        descriptionElement.id = 'sweater-description-' + uniqueId;
        descriptionElement.innerText = sweaterDescriptionString;
        domElement.setAttribute( 'aria-describedby', descriptionElement.id );

        // structure the elements
        domElement.appendChild( labelElement );
        domElement.appendChild( descriptionElement );

        return new AccessiblePeer( accessibleInstance, domElement );

      }
    };
  }

  return inherit( Node, SweaterNode );
} );
