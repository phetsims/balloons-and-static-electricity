// Copyright 2013-2017, University of Colorado Boulder

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
  var MinusChargesCanvasNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargesCanvasNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var WallDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/WallDescriber' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // images
  var wallImage = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/wall.png' );

  // a11y strings
  var wallLabelString = BASEA11yStrings.wallLabel.value;

  /**
   * @constructor
   * @param {BASEModel} model
   * @param {Tandem} tandem
   */
  function WallNode( model, layoutHeight, tandem ) {
    var self = this;

    // @private
    this.model = model;
    var wallModel = model.wall;

    // manages a11y descriptions for the wall
    this.wallDescriber = new WallDescriber( model );

    Node.call( this, {
      pickable: false,

      // accessibility options
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: wallLabelString,
      descriptionTagName: 'p'
    } );

    this.translate( wallModel.x, 0 );

    // add the background
    this.wallNode = new Image( wallImage, { tandem: tandem.createTandem( 'wallNode' ) } );

    this.addChild( this.wallNode );

    var plusChargesNode = new Node( { tandem: tandem.createTandem( 'plusChargesNode' ) } );
    plusChargesNode.translate( -wallModel.x, 0 );

    //draw plusCharges on the wall
    var plusChargeNodesTandemGroup = tandem.createGroupTandem( 'plusChargeNodes' );
    wallModel.plusCharges.forEach( function( entry ) {
      var plusChargeNode = new PlusChargeNode( entry.location, plusChargeNodesTandemGroup.createNextTandem() );
      plusChargesNode.addChild( plusChargeNode );
    } );
    this.addChild( plusChargesNode );
    
    // the minus charges on the wall - with Canvas for performance, bounds widened so that charges are fully
    // visible in wider layouts, see #409
    var wallBounds = new Bounds2( 0, 0, wallModel.width + 20, wallModel.height );
    var minusChargesNode = new MinusChargesCanvasNode( wallModel.x, wallBounds, wallModel.minusCharges );
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
      self.setDescriptionContent( self.wallDescriber.getWallDescription( model.yellowBalloon, model.greenBalloon, model.getBalloonsAdjacent() ) );
    };

    // a11y - attach listeners to update descriptions of the wall, no need to dispose
    model.yellowBalloon.locationProperty.link( updateWallDescription );
    model.greenBalloon.locationProperty.link( updateWallDescription );
    model.greenBalloon.isVisibleProperty.link( updateWallDescription );
    model.showChargesProperty.link( updateWallDescription );

    // update minus charges indicating induced charge when balloons move
    model.yellowBalloon.locationProperty.link( minusChargesNode.invalidatePaint.bind( minusChargesNode ) );
    model.greenBalloon.locationProperty.link( minusChargesNode.invalidatePaint.bind( minusChargesNode ) );
  }

  balloonsAndStaticElectricity.register( 'WallNode', WallNode );

  return inherit( Node, WallNode );
} );
