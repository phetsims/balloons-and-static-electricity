// Copyright 2017-2018, University of Colorado Boulder

/**
 * A node that provides an interaction cue for dragging the balloon in Balloons and Static Electricity. Includes arrow
 * and letter keys to indicate that the user can use WASD or arrow keys to move it around the play area.
 * 
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LetterKeyNode = require( 'SCENERY_PHET/keyboard/LetterKeyNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var ARROW_HEIGHT = 15; // dimensions for the arrow icons
  var KEY_HEIGHT = 24; // height of the arrow key, larger than default KeyNode height
  var ARROW_WIDTH = 1 / 2 * Math.sqrt( 3 ) * ARROW_HEIGHT; // for equilateral triangle
  var TEXT_KEY_OPTIONS = { font: new PhetFont( 14 ), forceSquareKey: true, keyHeight: KEY_HEIGHT };
  var KEY_ARROW_SPACING = 2;
  var BALLOON_KEY_SPACING = 8;
  var SHADOW_WIDTH = 2;

  // possible directions or the directional cues
  var DIRECTION_ANGLES = {
    up: 0,
    down: Math.PI,
    left: -Math.PI / 2,
    right: Math.PI / 2
  };

  /**
   * @constructor
   * @param {BASEModel} model
   * @param {BalloonModel} balloonModel
   * @param {BalloonNode} balloonNode 
   * @param {Bounds2} layoutBounds
   */
  function BalloonInteractionCueNode( model, balloonModel, balloonNode, layoutBounds ) {

    Node.call( this );

    // create the help node for the WASD and arrow keys, invisible except for on the initial balloon pick up
    var directionKeysParent = new Node();
    this.addChild( directionKeysParent );

    var wNode = this.createMovementKeyNode( 'up' );
    var aNode = this.createMovementKeyNode( 'left' );
    var sNode = this.createMovementKeyNode( 'down' );
    var dNode = this.createMovementKeyNode( 'right' );

    directionKeysParent.addChild( wNode );
    directionKeysParent.addChild( aNode );
    directionKeysParent.addChild( sNode );
    directionKeysParent.addChild( dNode );

    // add listeners to update visibility of nodes when location changes and when the wall is made
    // visible/invisible
    Property.multilink( [ balloonModel.locationProperty, model.wall.isVisibleProperty ], function( location, visible ) {

      // get the max x locations depending on if the wall is visible
      var centerXRightBoundary;
      if ( visible ) {
        centerXRightBoundary = PlayAreaMap.X_LOCATIONS.AT_WALL;
      }
      else {
        centerXRightBoundary = PlayAreaMap.X_BOUNDARY_LOCATIONS.AT_RIGHT_EDGE;
      }

      var balloonCenter = balloonModel.getCenter();
      aNode.visible = balloonCenter.x !== PlayAreaMap.X_BOUNDARY_LOCATIONS.AT_LEFT_EDGE;
      sNode.visible = balloonCenter.y !== PlayAreaMap.Y_BOUNDARY_LOCATIONS.AT_BOTTOM;
      dNode.visible = balloonCenter.x !== centerXRightBoundary;
      wNode.visible = balloonCenter.y !== PlayAreaMap.Y_BOUNDARY_LOCATIONS.AT_TOP;
    } );

    // place the direction cues relative to the balloon bounds
    var balloonBounds = balloonModel.bounds;
    wNode.centerBottom = balloonBounds.getCenterTop().plusXY( 0, -BALLOON_KEY_SPACING );
    aNode.rightCenter = balloonBounds.getLeftCenter().plusXY( -BALLOON_KEY_SPACING, 0 );
    sNode.centerTop = balloonBounds.getCenterBottom().plusXY( 0, BALLOON_KEY_SPACING + SHADOW_WIDTH );
    dNode.leftCenter = balloonBounds.getRightCenter().plusXY( BALLOON_KEY_SPACING + SHADOW_WIDTH, 0 );
  }

  balloonsAndStaticElectricity.register( 'BalloonInteractionCueNode', BalloonInteractionCueNode );

  return inherit( Node, BalloonInteractionCueNode, {

    /**
     * Create a node that looks like a keyboard letter key next to an arrow indicating the direction the balloon
     * would move if that key is pressed.
     *
     * @param {string} direction - 'up'|'down'|'left'|'right'
     * @returns {Node}
     */
    createMovementKeyNode: function( direction ) {

      // create the arrow icon
      var arrowShape = new Shape();
      arrowShape.moveTo( ARROW_HEIGHT / 2, 0 ).lineTo( ARROW_HEIGHT, ARROW_WIDTH ).lineTo( 0, ARROW_WIDTH ).close();
      var arrowIcon = new Path( arrowShape, {
        fill: 'white',
        stroke: 'black',
        lineJoin: 'bevel',
        lineCap: 'butt',
        lineWidth: 2,
        rotation: DIRECTION_ANGLES[ direction ]
      } );

      // create the letter key nodes and place in the correct layout box
      var keyIcon;
      var box;
      if ( direction === 'up' ) {
        keyIcon = new LetterKeyNode( 'W', TEXT_KEY_OPTIONS );
        box = new VBox( { children: [ arrowIcon, keyIcon ], spacing: KEY_ARROW_SPACING } );
      }
      else if ( direction === 'left' ) {
        keyIcon = new LetterKeyNode( 'A', TEXT_KEY_OPTIONS );
        box = new HBox( { children: [ arrowIcon, keyIcon ], spacing: KEY_ARROW_SPACING } );
      }
      else if ( direction === 'right' ) {
        keyIcon = new LetterKeyNode( 'D', TEXT_KEY_OPTIONS );
        box = new HBox( { children: [ keyIcon, arrowIcon ], spacing: KEY_ARROW_SPACING } );
      }
      else if ( direction === 'down' ) {
        keyIcon = new LetterKeyNode( 'S', TEXT_KEY_OPTIONS );
        box = new VBox( { children: [ keyIcon, arrowIcon ], spacing: KEY_ARROW_SPACING } );
      }

      assert && assert( box, 'No box created for direction ' + direction );
      return box;
    }
  } );
} );
