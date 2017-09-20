// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the wall of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var WallDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/WallDescriber' );

  // images
  var wallImage = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/wall.png' );

  /**
   * @constructor
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {Tandem} tandem
   */
  function WallNode( model, tandem ) {
    var self = this;

    // @private
    this.model = model;
    var wallModel = model.wall;

    this.wallDescriber = new WallDescriber( wallModel, model.showChargesProperty );

    Node.call( this, {
      pickable: false,

      // accessibility options
      tagName: 'div',
      labelTagName: 'h3',
      accessibleLabel: BASEA11yStrings.wallLabelString,
      descriptionTagName: 'p'
    } );

    this.translate( wallModel.x, 0 );

    // add the background
    this.wallNode = new Image( wallImage, { tandem: tandem.createTandem( 'wallNode' ) } );
    this.addChild( this.wallNode );

    var plusChargesNode = new Node( { tandem: tandem.createTandem( 'plusChargesNode' ) } );
    var minusChargesNode = new Node( {
      layerSplit: true,
      tandem: tandem.createTandem( 'minusChargesNode' )
    } );
    plusChargesNode.translate( -wallModel.x, 0 );
    minusChargesNode.translate( -wallModel.x, 0 );

    //draw plusCharges on the wall
    var plusChargeNodesTandemGroup = tandem.createGroupTandem( 'plusChargeNodes' );
    wallModel.plusCharges.forEach( function( entry ) {
      var plusChargeNode = new PlusChargeNode( entry.location, plusChargeNodesTandemGroup.createNextTandem() );
      plusChargesNode.addChild( plusChargeNode );
    } );

    //draw minusCharges on the wall
    var minusChargeNodesTandemGroup = tandem.createGroupTandem( 'minusChargeNodes' );
    wallModel.minusCharges.forEach( function( entry ) {
      var minusChargeNode = new MinusChargeNode( entry.location, minusChargeNodesTandemGroup.createNextTandem() );
      entry.locationProperty.link( function updateLocation( location ) {
        minusChargeNode.setTranslation( location.x + PointChargeModel.RADIUS, location.y + PointChargeModel.RADIUS );
      } );
      minusChargesNode.addChild( minusChargeNode );
    } );

    this.addChild( plusChargesNode );
    this.addChild( minusChargesNode );

    wallModel.isVisibleProperty.link( function updateWallVisibility( isVisible ) {
      self.visible = isVisible;
    } );

    //show charges based on draw  property
    model.showChargesProperty.link( function switchWallChargesView( value ) {
      plusChargesNode.visible = ( value === 'all' );
      minusChargesNode.visible = ( value === 'all' );
    } );

    // a11y - when the balloons change location, update the description of the induced charge in the wall
    var updateWallDescription = function() {
      self.setAccessibleDescription( self.wallDescriber.getWallDescription( model.yellowBalloon, model.greenBalloon ) );
    };

    model.yellowBalloon.locationProperty.link( updateWallDescription );
    model.greenBalloon.locationProperty.link( updateWallDescription );
    model.showChargesProperty.link( updateWallDescription );
  }

  balloonsAndStaticElectricity.register( 'WallNode', WallNode );

  return inherit( Node, WallNode );
} );
