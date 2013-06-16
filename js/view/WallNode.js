// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the wall of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusChargeNode = require( 'view/PlusChargeNode' );
  var MinusChargeNode = require( 'view/MinusChargeNode' );
  var PointChargeModel = require( 'model/PointChargeModel' );
  var Vector2 = require( 'DOT/Vector2' );
  var balloonAndStaticElectricityImages = require( 'balloons-and-static-electricity-images' );

  function WallNode( model ) {
    var self = this;
    var wallModel = model.wall;

    // super constructor
    Node.call( this, {pickable: false} );

    this.translate( wallModel.x, 0 );

    // add the background
    // add the Balloon image
    this.addChild( new Image( balloonAndStaticElectricityImages.getImage( 'wall.png' ) ) );

    var chargesNode = new Node();
    chargesNode.translate( -wallModel.x, 0 );

    //draw plusCharges on the wall
    wallModel.plusCharges.forEach( function( entry ) {
      entry.view = new PlusChargeNode( entry.location );
      chargesNode.addChild( entry.view );
    } );

    //draw minusCharges on the wall
    wallModel.minusCharges.forEach( function( entry ) {
      entry.view = new MinusChargeNode( entry.location );
      entry.locationProperty.link( function updateLocation( location ) {
        entry.view.setTranslation( location.x + PointChargeModel.radius, location.y + PointChargeModel.radius );
      } );
      chargesNode.addChild( entry.view );
    } );

    this.addChild( chargesNode );

    wallModel.isVisibleProperty.link( function updateWallVisibility( isVisible ) {
      self.visible = isVisible;
    } );

    //show charges based on draw  property
    model.showChargesProperty.link( function switchWallChargesView( value ) {
      chargesNode.visible = (value === 'all');
    } );
  }

  inherit( Node, WallNode ); // prototype chaining

  return WallNode;
} );