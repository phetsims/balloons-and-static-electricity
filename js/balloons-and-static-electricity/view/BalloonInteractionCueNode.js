// Copyright 2017-2019, University of Colorado Boulder

/**
 * A node that provides an interaction cue for dragging the balloon in Balloons and Static Electricity. Includes arrow
 * and letter keys to indicate that the user can use WASD or arrow keys to move it around the play area.
 * 
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LetterKeyNode = require( 'SCENERY_PHET/keyboard/LetterKeyNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const ARROW_HEIGHT = 15; // dimensions for the arrow icons
  const KEY_HEIGHT = 24; // height of the arrow key, larger than default KeyNode height
  const ARROW_WIDTH = 1 / 2 * Math.sqrt( 3 ) * ARROW_HEIGHT; // for equilateral triangle
  const TEXT_KEY_OPTIONS = { font: new PhetFont( 14 ), forceSquareKey: true, keyHeight: KEY_HEIGHT };
  const KEY_ARROW_SPACING = 2;
  const BALLOON_KEY_SPACING = 8;
  const SHADOW_WIDTH = 2;

  // possible directions or the directional cues
  const DIRECTION_ANGLES = {
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
    const directionKeysParent = new Node();
    this.addChild( directionKeysParent );

    const wNode = this.createMovementKeyNode( 'up' );
    const aNode = this.createMovementKeyNode( 'left' );
    const sNode = this.createMovementKeyNode( 'down' );
    const dNode = this.createMovementKeyNode( 'right' );

    directionKeysParent.addChild( wNode );
    directionKeysParent.addChild( aNode );
    directionKeysParent.addChild( sNode );
    directionKeysParent.addChild( dNode );

    // add listeners to update visibility of nodes when position changes and when the wall is made
    // visible/invisible
    Property.multilink( [ balloonModel.positionProperty, model.wall.isVisibleProperty ], function( position, visible ) {

      // get the max x positions depending on if the wall is visible
      let centerXRightBoundary;
      if ( visible ) {
        centerXRightBoundary = PlayAreaMap.X_POSITIONS.AT_WALL;
      }
      else {
        centerXRightBoundary = PlayAreaMap.X_BOUNDARY_POSITIONS.AT_RIGHT_EDGE;
      }

      const balloonCenter = balloonModel.getCenter();
      aNode.visible = balloonCenter.x !== PlayAreaMap.X_BOUNDARY_POSITIONS.AT_LEFT_EDGE;
      sNode.visible = balloonCenter.y !== PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_BOTTOM;
      dNode.visible = balloonCenter.x !== centerXRightBoundary;
      wNode.visible = balloonCenter.y !== PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_TOP;
    } );

    // place the direction cues relative to the balloon bounds
    const balloonBounds = balloonModel.bounds;
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
      const arrowShape = new Shape();
      arrowShape.moveTo( ARROW_HEIGHT / 2, 0 ).lineTo( ARROW_HEIGHT, ARROW_WIDTH ).lineTo( 0, ARROW_WIDTH ).close();
      const arrowIcon = new Path( arrowShape, {
        fill: 'white',
        stroke: 'black',
        lineJoin: 'bevel',
        lineCap: 'butt',
        lineWidth: 2,
        rotation: DIRECTION_ANGLES[ direction ]
      } );

      // create the letter key nodes and place in the correct layout box
      let keyIcon;
      let box;
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
