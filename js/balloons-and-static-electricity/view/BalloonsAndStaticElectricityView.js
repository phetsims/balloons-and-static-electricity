// Copyright 2013-2015, University of Colorado Boulder

/**
 * main view class for the simulation
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AccessibleSectionNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/AccessibleSectionNode' );
  var BalloonInteractionCueNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonInteractionCueNode' );
  var BalloonNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonNode' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BalloonsAndStaticElectricityAudio = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonsAndStaticElectricityAudio' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ControlPanel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/ControlPanel' );
  var Cursor = require( 'SCENERY/accessibility/reader/Cursor' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayAreaGridNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlayAreaGridNode' );
  var Property = require( 'AXON/Property' );
  var Reader = require( 'SCENERY/accessibility/reader/Reader' );
  var ReaderDisplayNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/ReaderDisplayNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SceneSummaryNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/SceneSummaryNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SweaterNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/SweaterNode' );
  var TetherNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/TetherNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var WallNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/WallNode' );

  // strings
  var balloonsAndStaticElectricityTitleString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity.title' );
  var playAreaString = BASEA11yStrings.playAreaString;
  var greenBalloonLabelString = BASEA11yStrings.greenBalloonLabelString;
  var yellowBalloonLabelString = BASEA11yStrings.yellowBalloonLabelString;

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // constants
  var BALLOON_TIE_POINT_HEIGHT = 14; // empirically determined

  /**
   * @constructor
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {Tandem} tandem
   */
  function BalloonsAndStaticElectricityView( model, tandem ) {

    var self = this;

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      tandem: tandem,

      // a11y
      accessibleLabel: balloonsAndStaticElectricityTitleString
    } );

    var sweaterNode = new SweaterNode( model, tandem.createTandem( 'sweaterNode' ) );
    var wallNode = new WallNode( model, tandem.createTandem( 'wall' ) );

    // add sonification if enabled
    if ( BalloonsAndStaticElectricityQueryParameters.sonification ) {
      this.audioView = new BalloonsAndStaticElectricityAudio( model, tandem.createTandem( 'audioView' ) );
    }

    // create a parent container for all things in the 'play area' to structure the accessibility DOM into sections
    var playAreaContainerNode = new AccessibleSectionNode( playAreaString );
    this.addChild( playAreaContainerNode );
    playAreaContainerNode.addChild( sweaterNode );
    playAreaContainerNode.addChild( wallNode );

    //Show black to the right side of the wall so it doesn't look like empty space over there
    this.addChild( new Rectangle(
      model.wall.x + wallNode.wallNode.width,
      0,
      1000,
      1000,
      { fill: 'black', tandem: tandem.createTandem( 'spaceToRightOfWall' ) }
    ) );

    //Add black to the left of the screen to match the black region to the right of the wall
    var maxX = this.layoutBounds.maxX - model.wall.x - wallNode.wallNode.width;
    this.addChild( new Rectangle(
      maxX - 1000,
      0,
      1000,
      1000,
      { fill: 'black', tandem: tandem.createTandem( 'spaceToLeftOfWall' ) }
    ) );

    var controlPanel = new ControlPanel( model, this.layoutBounds, tandem.createTandem( 'controlPanel' ) );

    var balloonsNode = new Node( { tandem: tandem.createTandem( 'balloonsNode' ) } ); // TODO: Why this container?
    this.yellowBalloonNode = new BalloonNode( 400, 200, model.yellowBalloon, balloonYellow, model, yellowBalloonLabelString, tandem.createTandem( 'yellowBalloonNode' ), {
      accessibleLabel: yellowBalloonLabelString
    } );
    var tetherAnchorPoint = new Vector2(
      model.yellowBalloon.locationProperty.get().x + 30, // a bit to the side of directly below the starting position
      this.layoutBounds.height + 50 // slightly below bottom of frame, amount was empirically determined
    );
    this.yellowBalloonTetherNode = new TetherNode(
      model.yellowBalloon,
      tetherAnchorPoint,
      new Vector2( this.yellowBalloonNode.width / 2, this.yellowBalloonNode.height - BALLOON_TIE_POINT_HEIGHT ),
      tandem.createTandem( 'yellowBalloonTetherNode' )
    );
    this.greenBalloonNode = new BalloonNode( 500, 200, model.greenBalloon, balloonGreen, model, greenBalloonLabelString, tandem.createTandem( 'greenBalloonNode' ), {
      accessibleLabel: greenBalloonLabelString
    } );
    this.greenBalloonTetherNode = new TetherNode(
      model.greenBalloon,
      tetherAnchorPoint,
      new Vector2( this.greenBalloonNode.width / 2, this.greenBalloonNode.height - BALLOON_TIE_POINT_HEIGHT ),
      tandem.createTandem( 'greenBalloonTetherNode' )
    );

    // created after all other view objects so we can access each describer
    var sceneSummaryNode = new SceneSummaryNode( model, this.yellowBalloonNode, this.greenBalloonNode, wallNode, tandem.createTandem( 'sceneSummaryNode' ) );
    this.addChild( sceneSummaryNode );

    // combine the balloon content into single nodes so that they are easily layerable
    var greenBalloonLayerNode = new Node( { children: [ this.greenBalloonTetherNode, this.greenBalloonNode ] } );
    var yellowBalloonLayerNode = new Node( { children: [ this.yellowBalloonTetherNode, this.yellowBalloonNode ] } );

    // a11y - a node that provides some information when this node receives focus for the first time
    var yellowBalloonCueNode = new BalloonInteractionCueNode( model, model.yellowBalloon, this.yellowBalloonNode, this.layoutBounds );
    var greenBalloonCueNode = new BalloonInteractionCueNode( model, model.greenBalloon, this.greenBalloonNode, this.layoutBounds );

    // children specified in this order for layering purposes
    balloonsNode.children = [
      greenBalloonLayerNode,
      yellowBalloonLayerNode
    ];
    playAreaContainerNode.addChild( balloonsNode );

    // the yellow balloon should come first in keyboard navigation order
    balloonsNode.accessibleOrder = [ this.yellowBalloonNode, this.greenBalloonNode ];

    // Only show the selected balloon(s)
    model.greenBalloon.isVisibleProperty.link( function( isVisible ) {
      self.greenBalloonNode.visible = isVisible;
      self.greenBalloonTetherNode.visible = isVisible;
    } );

    this.addChild( controlPanel );

    //A black rectangle that vertically 'extends' the navbar from joist, see #54
    this.addChild( new Rectangle( 0, 0, 3000, this.layoutBounds.height, {
      fill: 'black',
      x: -1000,
      y: this.layoutBounds.height,
      pickable: false,
      tandem: tandem.createTandem( 'navBarExtension' )
    } ) );

    // interaction cues layered on top of everything
    this.addChild( yellowBalloonCueNode );
    this.addChild( greenBalloonCueNode );

    // when one of the balloons is picked up, move its content and cue nodes to front of their
    // respective parents
    Property.multilink( [ model.yellowBalloon.isDraggedProperty, model.greenBalloon.isDraggedProperty ], function( yellowDragged, greenDragged ) {
      if ( yellowDragged ) {
        yellowBalloonLayerNode.moveToFront();
        yellowBalloonCueNode.moveToFront();
      }
      else if ( greenDragged ) {
        greenBalloonLayerNode.moveToFront();
        greenBalloonCueNode.moveToFront();
      }
    } );

    // the scene summary should be before all other children
    this.accessibleOrder = [ sceneSummaryNode ];

    // set the accessible order: sweater, balloons wall
    playAreaContainerNode.accessibleOrder = [ sweaterNode, balloonsNode, wallNode ];

    //--------------------------------------------------------------------------
    // debugging
    //--------------------------------------------------------------------------

    // visualise regions of the play area
    if ( BalloonsAndStaticElectricityQueryParameters.showGrid ) {
      this.addChild( new PlayAreaGridNode( this.layoutBounds, tandem.createTandem( 'playAreaGridNode' ) ) );
    }

    // enable the prototype screen reader
    if ( BalloonsAndStaticElectricityQueryParameters.reader ) {
      var cursor = new Cursor( document.body );
      var readerDisplayBounds = new Bounds2( 10, 0, this.layoutBounds.width - 20, 50 );

      var reader = new Reader( cursor );
      var display = new ReaderDisplayNode( reader, readerDisplayBounds );
      this.addChild( display );
    }
  }

  balloonsAndStaticElectricity.register( 'BalloonsAndStaticElectricityView', BalloonsAndStaticElectricityView );

  inherit( ScreenView, BalloonsAndStaticElectricityView, {

    /**
     * Step the view.  For acccessibility, we want to step the 'AudioView' and the the keyboard drag handlers.
     * @param number} dt 
     * @public
     */
    step: function( dt ) {
      this.greenBalloonNode.step( dt );
      this.yellowBalloonNode.step( dt );

      // step the audio
      this.audioView && this.audioView.step( dt );
    }
  } );

  return BalloonsAndStaticElectricityView;
} );
