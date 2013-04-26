// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the Sweater of the model.
 *
 *
 @author Vasily Shakhov (Mlearner)
 */

define( function ( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusCharge = require( 'view/PlusCharge' );
  var MinusCharge = require( 'view/MinusCharge' );
  var PointChargeModel = require( 'model/PointChargeModel' );
  var Vector2 = require( 'DOT/Vector2' );

  function SweaterNode( sweaterModel ) {
    var self = this;

    // super constructor
    Node.call( this );

    // add the Sweater image
    this.addChild( new Image( "images/sweater.svg", {
      x: sweaterModel.x,
      y: sweaterModel.y
    } ) );

    sweaterModel.plusCharges.forEach( function ( entry ) {
      entry.view = new PlusCharge( entry.location );
      self.addChild( entry.view );
    } );


    sweaterModel.minusCharges.forEach( function ( entry ) {
      entry.view = new MinusCharge( entry.location );
      entry.link( 'location', function updateLocation( location ) {
        entry.view.x = location.x + PointChargeModel.radius;
        entry.view.y = location.y + PointChargeModel.radius;
      } );
      self.addChild( entry.view );
    } );

  }

  inherit( SweaterNode, Node ); // prototype chaining

  return SweaterNode;
} );
