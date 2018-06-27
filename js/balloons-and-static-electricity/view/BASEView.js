// Copyright 2013-2017, University of Colorado Boulder

/**
 * main view class for the simulation
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var AccessibleSectionNode = require( 'SCENERY_PHET/accessibility/AccessibleSectionNode' );
  var BalloonInteractionCueNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonInteractionCueNode' );
  var BalloonNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonNode' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEQueryParameters' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ControlPanel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/ControlPanel' );
  var Cursor = require( 'SCENERY/accessibility/reader/Cursor' );
  var inherit = require( 'PHET_CORE/inherit' );
  var JoistA11yStrings = require( 'JOIST/JoistA11yStrings' );
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

  // a11y strings
  var playAreaString = JoistA11yStrings.playArea.value;
  var greenBalloonLabelString = BASEA11yStrings.greenBalloonLabel.value;
  var yellowBalloonLabelString = BASEA11yStrings.yellowBalloonLabel.value;

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // constants
  var BALLOON_TIE_POINT_HEIGHT = 14; // empirically determined

  /**
   * @constructor
   * @param {BASEModel} model
   * @param {Tandem} tandem
   */
  function BASEView( model, tandem ) {

    var self = this;

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      tandem: tandem,

      // a11y
      labelContent: balloonsAndStaticElectricityTitleString
    } );

    var sweaterNode = new SweaterNode( model, tandem.createTandem( 'sweaterNode' ) );
    var wallNode = new WallNode( model, this.layoutBounds.height, tandem.createTandem( 'wall' ) );

    // create a container for all things in the 'play area' to structure the accessibility DOM into sections
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

    this.yellowBalloonNode = new BalloonNode( 400, 200, model.yellowBalloon, balloonYellow, model, yellowBalloonLabelString, greenBalloonLabelString, tandem.createTandem( 'yellowBalloonNode' ), {
      labelContent: yellowBalloonLabelString
    } );
    var tetherAnchorPoint = new Vector2(
      model.yellowBalloon.locationProperty.get().x + 30, // a bit to the side of directly below the starting position
      this.layoutBounds.height
    );
    this.yellowBalloonTetherNode = new TetherNode(
      model.yellowBalloon,
      tetherAnchorPoint,
      new Vector2( this.yellowBalloonNode.width / 2, this.yellowBalloonNode.height - BALLOON_TIE_POINT_HEIGHT ),
      tandem.createTandem( 'yellowBalloonTetherNode' )
    );
    this.greenBalloonNode = new BalloonNode( 500, 200, model.greenBalloon, balloonGreen, model, greenBalloonLabelString, yellowBalloonLabelString, tandem.createTandem( 'greenBalloonNode' ), {
      labelContent: greenBalloonLabelString
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

    playAreaContainerNode.addChild( yellowBalloonLayerNode );
    playAreaContainerNode.addChild( greenBalloonLayerNode );

    // Only show the selected balloon(s)
    model.greenBalloon.isVisibleProperty.link( function( isVisible ) {
      self.greenBalloonNode.visible = isVisible;
      self.greenBalloonTetherNode.visible = isVisible;
    } );

    this.addChild( controlPanel );

    // interaction cues layered on top of everything
    this.addChild( yellowBalloonCueNode );
    this.addChild( greenBalloonCueNode );

    // when one of the balloons is picked up, move its content and cue nodes to front
    // TODO: When a node is moved to the front of the scene graph, the DOM is reordered and the node will be blurred.
    // Sim code prevents the blur listeners from firing at this time, but is there a better way to  do this?
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
    playAreaContainerNode.accessibleOrder = [ sweaterNode, yellowBalloonLayerNode, greenBalloonLayerNode, wallNode ];

    //--------------------------------------------------------------------------
    // debugging
    //--------------------------------------------------------------------------

    // visualise regions of the play area
    if ( BASEQueryParameters.showGrid ) {
      this.addChild( new PlayAreaGridNode( this.layoutBounds, tandem.createTandem( 'playAreaGridNode' ) ) );
    }

    // enable the prototype screen reader
    if ( BASEQueryParameters.reader ) {
      var cursor = new Cursor( document.body );
      var readerDisplayBounds = new Bounds2( 10, 0, this.layoutBounds.width - 20, 50 );

      var reader = new Reader( cursor );
      var display = new ReaderDisplayNode( reader, readerDisplayBounds );
      this.addChild( display );
    }
  }

  balloonsAndStaticElectricity.register( 'BASEView', BASEView );

  inherit( ScreenView, BASEView, {

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
    },

    /**
     * Custom layout function for this view. It is most natural for this simulation for the view to
     * be held on the bottom of the navigation bar so that the balloon's tether and wall are always cut
     * off by the navigation bar, see #77.
     *
     * @param {number} width
     * @param {number} height
     */
    layout: function( width, height ) {
      this.resetTransform();

      var scale = this.getLayoutScale( width, height );
      this.setScaleMagnitude( scale );

      var dx = 0;
      var offsetY = 0;

      // Move to bottom vertically (custom for this sim)
      if ( scale === width / this.layoutBounds.width ) {
        offsetY = ( height / scale - this.layoutBounds.height );
      }

      // center horizontally (default behavior for ScreenView)
      else if ( scale === height / this.layoutBounds.height ) {
        dx = ( width - this.layoutBounds.width * scale ) / 2 / scale;
      }
      this.translate( dx, offsetY );

      // update the visible bounds of the screen view
      this.visibleBoundsProperty.set( new Bounds2( -dx, -offsetY, width / scale - dx, height / scale - offsetY ) );
    }
  } );

  return BASEView;
} );
