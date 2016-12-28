// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node that shows the various regions of the play area for accessibility.  The play area is broken into
 * regions so that the balloons have unique descriptions depending on which region they are in.  In addition,
 * there are vertical and horizontal lines of significance that impact the output of the screen reader, and these
 * are drawn in the play area as well.
 *
 @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var TandemNode = require( 'TANDEM/scenery/nodes/TandemNode' );
  var TandemRectangle = require( 'TANDEM/scenery/nodes/TandemRectangle' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Line = require( 'SCENERY/nodes/Line' );

  /**
   * @constructor
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {Tandem} tandem
   */
  function PlayAreaNode( model, tandem ) {

    TandemNode.call( this, { pickable: false, tandem: tandem } );
    var blueOptions = { fill: 'rgba(0,0,255,0.3)' };
    var greyOptions = { fill: 'rgba(200,200,200,0.3)' };

    // left edge
    this.addChild( new TandemRectangle(
      model.playArea.leftColumn,
      _.extend( { tandem: tandem.createTandem( 'leftEdge' ) }, greyOptions )
    ) );

    // left arm
    this.addChild( new TandemRectangle(
      model.playArea.leftArmColumn,
      _.extend( { tandem: tandem.createTandem( 'leftArm' ) }, blueOptions )
    ) );

    // right sweater body
    this.addChild( new TandemRectangle(
      model.playArea.leftBodyColumn,
      _.extend( { tandem: tandem.createTandem( 'rightSweaterBody' ) }, greyOptions )
    ) );

    // left sweater body
    this.addChild( new TandemRectangle(
      model.playArea.rightBodyColumn,
      _.extend( { tandem: tandem.createTandem( 'leftSweaterBody' ) }, blueOptions )
    ) );

    // right arm
    this.addChild( new TandemRectangle(
      model.playArea.rightArmColumn,
      _.extend( { tandem: tandem.createTandem( 'rightArm' ) }, greyOptions )
    ) );

    // left side of play area
    this.addChild( new TandemRectangle(
      model.playArea.playAreaLeftColumn,
      _.extend( { tandem: tandem.createTandem( 'leftSideOfPlayArea' ) }, blueOptions )
    ) );

    // center of play area
    this.addChild( new TandemRectangle(
      model.playArea.playAreaCenterColumn,
      _.extend( { tandem: tandem.createTandem( 'centerOfPlayArea' ) }, greyOptions )
    ) );

    // right side of play Area
    this.addChild( new TandemRectangle(
      model.playArea.playAreaRightColumn,
      _.extend( { tandem: tandem.createTandem( 'rightSideOfPlayArea' ) }, blueOptions )
    ) );

    // right edge of play area
    this.addChild( new TandemRectangle(
      model.playArea.rightColumn,
      _.extend( { tandem: tandem.createTandem( 'rightEdgeOfPlayArea' ) }, greyOptions )
    ) );

    // top edge of play area
    this.addChild( new TandemRectangle(
      model.playArea.topRow,
      _.extend( { tandem: tandem.createTandem( 'topEdgeOfPlayArea' ) }, greyOptions )
    ) );

    // upper part of play area
    this.addChild( new TandemRectangle(
      model.playArea.upperRow,
      _.extend( { tandem: tandem.createTandem( 'upperPartOfPlayArea' ) }, blueOptions )
    ) );

    // lower part of play area
    this.addChild( new TandemRectangle(
      model.playArea.lowerRow,
      _.extend( { tandem: tandem.createTandem( 'lowerPartOfPlayArea' ) }, greyOptions )
    ) );

    // bottom part of play area
    this.addChild( new TandemRectangle(
      model.playArea.bottomRow,
      _.extend( { tandem: tandem.createTandem( 'bottomPartOfPlayArea' ) }, blueOptions )
    ) );

    // draw some lines to represent positions of critical balloon points
    var lineOptions = { stroke: 'rgba(0, 0, 0,0.4)', lineWidth: 5 };
    this.addChild( new Line( model.playArea.atWall, model.playArea.minY, model.playArea.atWall, model.playArea.maxY, lineOptions ) );
    this.addChild( new Line( model.playArea.atNearWall, model.playArea.minY, model.playArea.atNearWall, model.playArea.maxY, lineOptions ) );
    this.addChild( new Line( model.playArea.atCenter, model.playArea.minY, model.playArea.atCenter, model.playArea.maxY, lineOptions ) );
    this.addChild( new Line( model.playArea.atNearSweater, model.playArea.minY, model.playArea.atNearSweater, model.playArea.maxY, lineOptions ) );
  }

  balloonsAndStaticElectricity.register( 'PlayAreaNode', PlayAreaNode );

  return inherit( TandemNode, PlayAreaNode );
} );
