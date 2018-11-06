// Copyright 2017, University of Colorado Boulder

/**
 * A node that provides an interaction cue for interacting with the balloon in Balloons and Static Electricity.
 * When focused for the first time, a rectangle will appear under the balloon that indicates how to grab it.  Once grabbed,
 * arrow and letter keys will appear to indicate that the user can use WASD or arrow keys to move it around the play area.
 * After the first interaction, this will be invisible.
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
  var GrabReleaseCueNode = require( 'SCENERY_PHET/accessibility/nodes/GrabReleaseCueNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var CUE_REPEATS = 1; // number of times successful drag should happen before the cue is no longer necessary
  var ARROW_HEIGHT = 15; // dimensions for the arrow icons
  var KEY_HEIGHT = 24; // height of the arrow key, larger than default KeyNode height
  var ARROW_WIDTH = 1 / 2 * Math.sqrt( 3 ) * ARROW_HEIGHT; // for equilateral triangle
  var TEXT_KEY_OPTIONS = { font: new PhetFont( 14 ), forceSquareKey: true, keyHeight: KEY_HEIGHT };
  var KEY_ARROW_SPACING = 2;
  var BALLOON_KEY_SPACING = 8;
  var SHADOW_WIDTH = 2;
  var BALLOON_GRAB_CUE_SPACING = 10;

  // possible directions or the directional cues
  var DIRECTION_ANGLES = {
    up: 0,
    down: Math.PI,
    left: -Math.PI / 2,
    right: Math.PI / 2
  };

  function BalloonInteractionCueNode( model, balloonModel, balloonNode, layoutBounds ) {

    Node.call( this );

    var backgroundRectangle = new GrabReleaseCueNode( { visible: false } );
    this.addChild( backgroundRectangle );

    // create the help node for the WASD and arrow keys, invisible except for on the initial balloon pick up
    var directionKeysParent = new Node( { visible: false } );
    this.addChild( directionKeysParent );

    var wNode = this.createMovementKeyNode( 'up' );
    var aNode = this.createMovementKeyNode( 'left' );
    var sNode = this.createMovementKeyNode( 'down' );
    var dNode = this.createMovementKeyNode( 'right' );

    directionKeysParent.addChild( wNode );
    directionKeysParent.addChild( aNode );
    directionKeysParent.addChild( sNode );
    directionKeysParent.addChild( dNode );

    // add listeners to update location and visibility of nodes when location changes and when the wall is made
    // visible/invisible
    Property.multilink( [ balloonModel.locationProperty, model.wall.isVisibleProperty ], function( location, visible ) {

      // get the max x locations depending on if the wall is visible
      var maxX;
      var centerXBoundary;
      if ( visible ) {
        maxX = model.playAreaBounds.width;
        centerXBoundary = PlayAreaMap.X_LOCATIONS.AT_WALL;
      }
      else {
        maxX = layoutBounds.width;
        centerXBoundary = PlayAreaMap.X_LOCATIONS.AT_RIGHT_EDGE;
      }

      var balloonBounds = balloonModel.bounds;
      var balloonCenter = balloonModel.getCenter();

      // position the 'grab' cue - make sure it is totally in the play area
      backgroundRectangle.centerTop = balloonModel.getCenter().plusXY( 0, balloonModel.height / 2 + BALLOON_GRAB_CUE_SPACING );
      backgroundRectangle.left = Math.max( 0, backgroundRectangle.left );
      backgroundRectangle.right = Math.min( maxX, backgroundRectangle.right );
      backgroundRectangle.bottom = Math.min( backgroundRectangle.bottom, layoutBounds.maxY );

      // movement direction cues
      wNode.centerBottom = balloonBounds.getCenterTop().plusXY( 0, -BALLOON_KEY_SPACING );
      aNode.rightCenter = balloonBounds.getLeftCenter().plusXY( -BALLOON_KEY_SPACING, 0 );
      sNode.centerTop = balloonBounds.getCenterBottom().plusXY( 0, BALLOON_KEY_SPACING + SHADOW_WIDTH );
      dNode.leftCenter = balloonBounds.getRightCenter().plusXY( BALLOON_KEY_SPACING + SHADOW_WIDTH, 0 );

      aNode.visible = balloonCenter.x !== PlayAreaMap.X_LOCATIONS.AT_LEFT_EDGE;
      sNode.visible = balloonCenter.y !== PlayAreaMap.Y_LOCATIONS.AT_BOTTOM;
      dNode.visible = balloonCenter.x !== centerXBoundary;
      wNode.visible = balloonCenter.y !== PlayAreaMap.X_LOCATIONS.AT_RIGHT_EDGE;

      // if we move and the interaction count is no longer zero, make the cues invisible
      if ( directionKeysParent.visible && balloonNode.keyboardDragCount === CUE_REPEATS ) {
        directionKeysParent.visible = false;
      }
    } );

    // when focused, make "grab" cue visible, unless there was a successful drag
    balloonNode.grabButtonFocusedEmitter.addListener( function() {
      backgroundRectangle.visible = ( balloonNode.keyboardDragCount < CUE_REPEATS );
    } );

    // when dragged, make movement cues visible, unless there was a successful drag
    balloonNode.dragNodeFocusedEmitter.addListener( function() {
      directionKeysParent.visible = ( balloonNode.keyboardDragCount < CUE_REPEATS );
    } );

    // when blurred, none of this help content should be visible
    balloonNode.grabButtonBlurredEmitter.addListener( function() {
      backgroundRectangle.visible = false;
    } );
    balloonNode.dragNodeBlurredEmitter.addListener( function() {
      directionKeysParent.visible = false;
    } );
  }

  balloonsAndStaticElectricity.register( 'BalloonInteractionCueNode', BalloonInteractionCueNode );

  return inherit( Node, BalloonInteractionCueNode, {

    /**
     * Create a node that looks like a keyboard letter key next to an arrow indicating the direction the balloon
     * would move if that key is pressed.
     *
     * @param {string} direction - 'up'|'down'|'left'|'right'
     * @return {Node}
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
