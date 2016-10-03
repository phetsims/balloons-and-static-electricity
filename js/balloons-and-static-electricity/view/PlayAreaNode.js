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
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Line = require( 'SCENERY/nodes/Line' );

  function PlayAreaNode( model ) {

    // super constructor
    Node.call( this, { pickable: false } );
    var blueOptions = { fill: 'rgba(0,0,255,0.3)' };
    var greyOptions = { fill: 'rgba(200,200,200,0.3)' };

    // left edge
    this.addChild( new Rectangle( model.playArea.leftColumn, greyOptions ) );

    // left arm
    this.addChild( new Rectangle( model.playArea.leftArmColumn, blueOptions ) );

    // right sweater body
    this.addChild( new Rectangle( model.playArea.leftBodyColumn, greyOptions ) );

    // left sweater body
    this.addChild( new Rectangle( model.playArea.rightBodyColumn, blueOptions ) );

    // right arm
    this.addChild( new Rectangle( model.playArea.rightArmColumn, greyOptions ) );

    // left side of play area
    this.addChild( new Rectangle( model.playArea.playAreaLeftColumn, blueOptions) );

    // center of play area
    this.addChild( new Rectangle( model.playArea.playAreaCenterColumn, greyOptions ) );

    // right side of play Area
    this.addChild( new Rectangle( model.playArea.playAreaRightColumn, blueOptions ) );

    // right edge of play area
    this.addChild( new Rectangle( model.playArea.rightColumn, greyOptions ) );

    // top edge of play area
    this.addChild( new Rectangle( model.playArea.topRow, greyOptions ) );

    // upper part of play area
    this.addChild( new Rectangle( model.playArea.upperRow, blueOptions ) );

    // lower part of play area
    this.addChild( new Rectangle( model.playArea.lowerRow, greyOptions ) );

    // bottom part of play area
    this.addChild( new Rectangle( model.playArea.bottomRow, blueOptions ) );

    // draw some lines to represent positions of critical balloon points
    var lineOptions = { stroke: 'rgba(0, 0, 0,0.4)', lineWidth: 5 };
    this.addChild( new Line( model.playArea.atWall, model.playArea.minY, model.playArea.atWall, model.playArea.maxY, lineOptions ) );
    this.addChild( new Line( model.playArea.atNearWall, model.playArea.minY, model.playArea.atNearWall, model.playArea.maxY, lineOptions ) );
    this.addChild( new Line( model.playArea.atCenter, model.playArea.minY, model.playArea.atCenter, model.playArea.maxY, lineOptions ) );
    this.addChild( new Line( model.playArea.atNearSweater, model.playArea.minY, model.playArea.atNearSweater, model.playArea.maxY, lineOptions ) );

  }

  balloonsAndStaticElectricity.register( 'PlayAreaNode', PlayAreaNode );

  return inherit( Node, PlayAreaNode );
} );
