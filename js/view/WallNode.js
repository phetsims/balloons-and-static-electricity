// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the static elements of the model.
 * sweater, wall
 *
 @author Vasily Shakhov (Mlearner)
 */

define( function ( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PlusCharge = require( 'view/PlusCharge' );
  var MinusCharge = require( 'view/MinusCharge' );
  var PointChargeModel = require( 'model/PointChargeModel' );
  var Vector2 = require( 'DOT/Vector2' );

  function WallNode( wallModel ) {
    var self = this;

    // super constructor
    Node.call( this );

    // add the background
    this.addChild( new Rectangle( wallModel.x, 0, wallModel.width, wallModel.height, {
      fill: '#ff0'
    } ) );

    wallModel.plusCharges.forEach( function ( entry ) {
      entry.view = new PlusCharge( entry.location );
      self.addChild( entry.view );
    } );


    wallModel.minusCharges.forEach( function ( entry ) {
      entry.view = new MinusCharge( entry.location );
      entry.link( 'location', function updateLocation( location ) {
        entry.view.x = location.x+PointChargeModel.radius;
        entry.view.y = location.y+PointChargeModel.radius;
      } );
      self.addChild( entry.view );
    } );


  }

  inherit( WallNode, Node ); // prototype chaining

  return WallNode;
} );
