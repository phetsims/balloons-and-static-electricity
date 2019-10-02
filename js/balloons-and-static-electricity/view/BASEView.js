// Copyright 2013-2019, University of Colorado Boulder

/**
 * main view class for the simulation
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const BalloonNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonNode' );
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  const BASEShapeHitDetector = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BASEShapeHitDetector' );
  const BASEQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEQueryParameters' );
  const BASESummaryNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BASESummaryNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ControlPanel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/ControlPanel' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlayAreaGridNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlayAreaGridNode' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SweaterNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/SweaterNode' );
  const TetherNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/TetherNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const VibrationChart = require( 'TAPPI/view/VibrationChart' );
  const vibrationController = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/vibrationController' );
  const vibrationManager = require( 'TAPPI/vibrationManager' );
  const WallNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/WallNode' );

  // a11y strings
  const greenBalloonLabelString = BASEA11yStrings.greenBalloonLabel.value;
  const yellowBalloonLabelString = BASEA11yStrings.yellowBalloonLabel.value;

  // images
  const balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  const balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // constants
  const BALLOON_TIE_POINT_HEIGHT = 14; // empirically determined

  /**
   * @constructor
   * @param {BASEModel} model
   * @param {Tandem} tandem
   */
  function BASEView( model, tandem ) {

    const self = this;

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      tandem: tandem
    } );

    const sweaterNode = new SweaterNode( model, tandem.createTandem( 'sweaterNode' ) );
    const wallNode = new WallNode( model, this.layoutBounds.height, tandem.createTandem( 'wall' ) );

    this.playAreaNode.addChild( sweaterNode );
    this.playAreaNode.addChild( wallNode );

    //Show black to the right side of the wall so it doesn't look like empty space over there
    this.addChild( new Rectangle(
      model.wall.x + wallNode.wallNode.width,
      0,
      1000,
      1000,
      { fill: 'black', tandem: tandem.createTandem( 'spaceToRightOfWall' ) }
    ) );

    //Add black to the left of the screen to match the black region to the right of the wall
    const maxX = this.layoutBounds.maxX - model.wall.x - wallNode.wallNode.width;
    this.addChild( new Rectangle(
      maxX - 1000,
      0,
      1000,
      1000,
      { fill: 'black', tandem: tandem.createTandem( 'spaceToLeftOfWall' ) }
    ) );

    const controlPanel = new ControlPanel( model, this.layoutBounds, tandem.createTandem( 'controlPanel' ) );

    this.yellowBalloonNode = new BalloonNode( model.yellowBalloon, balloonYellow, model, yellowBalloonLabelString, greenBalloonLabelString, this.layoutBounds, tandem.createTandem( 'yellowBalloonNode' ), {
      labelContent: yellowBalloonLabelString
    } );
    const tetherAnchorPoint = new Vector2(
      model.yellowBalloon.locationProperty.get().x + 30, // a bit to the side of directly below the starting position
      this.layoutBounds.height
    );
    this.yellowBalloonTetherNode = new TetherNode(
      model.yellowBalloon,
      tetherAnchorPoint,
      new Vector2( this.yellowBalloonNode.width / 2, this.yellowBalloonNode.height - BALLOON_TIE_POINT_HEIGHT ),
      tandem.createTandem( 'yellowBalloonTetherNode' )
    );
    this.greenBalloonNode = new BalloonNode( model.greenBalloon, balloonGreen, model, greenBalloonLabelString, yellowBalloonLabelString, this.layoutBounds, tandem.createTandem( 'greenBalloonNode' ), {
      labelContent: greenBalloonLabelString
    } );
    this.greenBalloonTetherNode = new TetherNode(
      model.greenBalloon,
      tetherAnchorPoint,
      new Vector2( this.greenBalloonNode.width / 2, this.greenBalloonNode.height - BALLOON_TIE_POINT_HEIGHT ),
      tandem.createTandem( 'greenBalloonTetherNode' )
    );

    // created after all other view objects so we can access each describer
    const screenSummaryNode = new BASESummaryNode( model, this.yellowBalloonNode, this.greenBalloonNode, wallNode, tandem.createTandem( 'screenSummaryNode' ) );
    this.setScreenSummaryContent( screenSummaryNode );

    // combine the balloon content into single nodes so that they are easily layerable
    const greenBalloonLayerNode = new Node( { children: [ this.greenBalloonTetherNode, this.greenBalloonNode ] } );
    const yellowBalloonLayerNode = new Node( { children: [ this.yellowBalloonTetherNode, this.yellowBalloonNode ] } );
    this.playAreaNode.addChild( yellowBalloonLayerNode );
    this.playAreaNode.addChild( greenBalloonLayerNode );

    // Only show the selected balloon(s)
    model.greenBalloon.isVisibleProperty.link( function( isVisible ) {
      self.greenBalloonNode.visible = isVisible;
      self.greenBalloonTetherNode.visible = isVisible;
    } );

    this.controlAreaNode.addChild( controlPanel );

    // when one of the balloons is picked up, move its content and cue nodes to front
    Property.multilink( [ model.yellowBalloon.isDraggedProperty, model.greenBalloon.isDraggedProperty ], function( yellowDragged, greenDragged ) {
      if ( yellowDragged ) {
        yellowBalloonLayerNode.moveToFront();
      }
      else if ( greenDragged ) {
        greenBalloonLayerNode.moveToFront();
      }
    } );

    // set the accessible order: sweater, balloons wall
    this.playAreaNode.accessibleOrder = [ sweaterNode, yellowBalloonLayerNode, greenBalloonLayerNode, wallNode ];

    // init vib controller
    vibrationController.initialize( model );

    if ( BASEQueryParameters.vibrationChart ) {
      this.vibrationChart = new VibrationChart( vibrationManager.vibratingProperty, this.layoutBounds.width * 0.75, 75, {
        labelFont: new PhetFont( 14 )
      } );

      this.addChild( this.vibrationChart );
      this.vibrationChart.centerTop = this.layoutBounds.centerTop;
    }

    if ( phet.chipper.queryParameters.vibration !== null ) {
      const hitDetector = new BASEShapeHitDetector( model, this, tandem.createTandem( 'hitDetector' ) );
      phet.joist.display.addInputListener( hitDetector );
    }

    //--------------------------------------------------------------------------
    // debugging
    //--------------------------------------------------------------------------

    // visualise regions of the play area
    if ( BASEQueryParameters.showGrid ) {
      this.addChild( new PlayAreaGridNode( this.layoutBounds, tandem.createTandem( 'playAreaGridNode' ) ) );
    }
  }

  balloonsAndStaticElectricity.register( 'BASEView', BASEView );

  inherit( ScreenView, BASEView, {

    /**
     * Step the view.  For acccessibility, we want to step the 'AudioView' and the keyboard drag handlers.
     * @param number} dt
     * @public
     */
    step: function( dt ) {
      this.greenBalloonNode.step( dt );
      this.yellowBalloonNode.step( dt );

      // step the audio
      this.audioView && this.audioView.step( dt );

      if ( this.vibrationChart ) {
        this.vibrationChart.step( dt );
      }
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

      const scale = this.getLayoutScale( width, height );
      this.setScaleMagnitude( scale );

      let dx = 0;
      let offsetY = 0;

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
