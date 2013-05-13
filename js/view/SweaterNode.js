// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the sweater of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */

define( function ( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusChargeNode = require( 'view/PlusChargeNode' );
  var MinusChargeNode = require( 'view/MinusChargeNode' );
  var PointChargeModel = require( 'model/PointChargeModel' );
  var Vector2 = require( 'DOT/Vector2' );

  function SweaterNode( model ) {
    var self = this;

    // super constructor
    Node.call( this );

    this.chargesNode = new Node();
    this.sweaterModel = model.sweater;


    // add the Sweater image
    this.addChild( new Image( "images/sweater.svg", {
      x: this.sweaterModel.x,
      y: this.sweaterModel.y
    } ) );

    //draw plus and minus charges
    this.sweaterModel.plusCharges.forEach( function ( entry ) {
      entry.view = new PlusChargeNode( entry.location );
      self.chargesNode.addChild( entry.view );
    } );
    this.sweaterModel.minusCharges.forEach( function ( entry ) {
      entry.view = new MinusChargeNode( entry.location );
      entry.link( 'location', function updateLocation( location ) {
        entry.view.x = location.x;
        entry.view.y = location.y;
      } );
      self.chargesNode.addChild( entry.view );
    } );

    this.addChild( this.chargesNode );

    //show all, none or charge difference
    var updateChargesVisibilityOnSweater = function ( value ) {
      if ( value === 'none' ) {
        self.chargesNode.visible = false;
      }
      else {
        self.chargesNode.visible = true;
        var showAll = (value === 'all');
        for ( var i = 0, l = self.sweaterModel.minusCharges.length; i < l; i++ ) {
          self.sweaterModel.plusCharges[i].view.visible = showAll || self.sweaterModel.minusCharges[i].moved;
          self.sweaterModel.minusCharges[i].view.visible = showAll && !self.sweaterModel.minusCharges[i].moved;
        }
      }
    };


    model.link( 'showCharges', function ( value ) {
      updateChargesVisibilityOnSweater( value );
    } );

    this.sweaterModel.link( 'charge', function () {
      updateChargesVisibilityOnSweater( model.showCharges );
    } );
  }


  inherit( SweaterNode, Node ); // prototype chaining

  return SweaterNode;
} );
