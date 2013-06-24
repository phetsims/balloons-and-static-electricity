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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
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
    Node.call( this, { pickable: false } );

    this.translate( wallModel.x, 0 );

    // add the background
    var wallImage = new Image( balloonAndStaticElectricityImages.getImage( 'wall.png' ) );
    this.addChild( wallImage );

    //Show black to the side of the wall so it doesn't look like empty space over there
    this.addChild( new Rectangle( wallImage.width, 0, 1000, 1000, {fill: 'black'} ) );

    var plusChargesNode = new Node();
    var minusChargesNode = new Node( { layerSplit: true } );
    plusChargesNode.translate( -wallModel.x, 0 );
    minusChargesNode.translate( -wallModel.x, 0 );

    //draw plusCharges on the wall
    wallModel.plusCharges.forEach( function( entry ) {
      entry.view = new PlusChargeNode( entry.location );
      plusChargesNode.addChild( entry.view );
    } );

    //draw minusCharges on the wall
    wallModel.minusCharges.forEach( function( entry ) {
      entry.view = new MinusChargeNode( entry.location );
      entry.locationProperty.link( function updateLocation( location ) {
        entry.view.setTranslation( location.x + PointChargeModel.radius, location.y + PointChargeModel.radius );
      } );
      minusChargesNode.addChild( entry.view );
    } );

    this.addChild( plusChargesNode );
    this.addChild( minusChargesNode );

    wallModel.isVisibleProperty.link( function updateWallVisibility( isVisible ) {
      self.visible = isVisible;
    } );

    //show charges based on draw  property
    model.showChargesProperty.link( function switchWallChargesView( value ) {
      plusChargesNode.visible = (value === 'all');
      minusChargesNode.visible = (value === 'all');
    } );
  }

  inherit( Node, WallNode ); // prototype chaining

  return WallNode;
} );
