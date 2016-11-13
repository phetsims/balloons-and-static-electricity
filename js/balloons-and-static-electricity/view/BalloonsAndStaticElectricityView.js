// Copyright 2013-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ControlPanel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/ControlPanel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SweaterNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/SweaterNode' );
  var WallNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/WallNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Cursor = require( 'SCENERY/accessibility/reader/Cursor' );
  var ReaderDisplayNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/ReaderDisplayNode' );
  var Reader = require( 'SCENERY/accessibility/reader/Reader' );
  var AccessibleNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleNode' );
  var BalloonNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonNode' );
  var KeyboardHelpDialog = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/KeyboardHelpDialog' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );
  var SceneSummaryNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/SceneSummaryNode' );
  var PlayAreaNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlayAreaNode' );
  var BalloonsAndStaticElectricityAudio = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonsAndStaticElectricityAudio' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // strings
  var balloonsAndStaticElectricityTitleString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity.title' );
  var playAreaLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/playArea.label' );

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  function BalloonsAndStaticElectricityView( model ) {

    var self = this;

    ScreenView.call( this, {
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      accessibleContent: null
    } );

    // for now, we are testing whether accessible content can be contained in an article
    var articleContainerNode = new AccessibleNode( {
      tagName: 'article'
    } );
    this.addChild( articleContainerNode );

    var accessibleHeaderNode = new AccessibleNode( {
      tagName: 'header',
      labelTagName: 'h1',
      label: balloonsAndStaticElectricityTitleString,
      descriptionTagName: 'p'
    } );
    articleContainerNode.addChild( accessibleHeaderNode );

    var sceneSummaryNode = new SceneSummaryNode( model );
    articleContainerNode.addChild( sceneSummaryNode );

    // add sonification if enabled
    if ( BalloonsAndStaticElectricityQueryParameters.sonification ) {
      this.audioView = new BalloonsAndStaticElectricityAudio( model );
    }

    // create a parent container for all things in the 'play area' to structure the accessibility DOM into sections
    var playAreaContainerNode = new AccessibleNode( {
      tagName: 'section',
      label: playAreaLabelString,
      childContainerTagName: 'div',
      labelTagName: 'h2'
    } );

    // create the keyboard help dialog for accessibility
    var keyboardHelpDialog = new KeyboardHelpDialog( this, {
      maxWidth: self.layoutBounds.width
    } );

    articleContainerNode.addChild( playAreaContainerNode );

    var sweaterNode = new SweaterNode( model );
    playAreaContainerNode.addChild( sweaterNode );

    var wall = new WallNode( model );
    playAreaContainerNode.addChild( wall );

    //Show black to the right side of the wall so it doesn't look like empty space over there
    articleContainerNode.addChild( new Rectangle( model.wall.x + wall.wallNode.width, 0, 1000, 1000, { fill: 'black' } ) );

    //Add black to the left of the screen to match the black region to the right of the wall
    var maxX = this.layoutBounds.maxX - model.wall.x - wall.wallNode.width;
    articleContainerNode.addChild( new Rectangle( maxX - 1000, 0, 1000, 1000, { fill: 'black' } ) );

    var controlPanel = new ControlPanel( model, this.layoutBounds );

    var balloonsNode = new Node(); // TODO: Why this container?
    this.greenBalloon = new BalloonNode( 500, 200, model.greenBalloon, balloonGreen, model, 'green', keyboardHelpDialog );
    this.yellowBalloon = new BalloonNode( 400, 200, model.yellowBalloon, balloonYellow, model, 'yellow', keyboardHelpDialog );

    balloonsNode.children = [ this.yellowBalloon, this.greenBalloon ];
    playAreaContainerNode.addChild( balloonsNode );

    //Only show the selected balloon(s)
    model.greenBalloon.isVisibleProperty.link( function( isVisible ) {
      self.greenBalloon.visible = isVisible;
    } );

    articleContainerNode.addChild( controlPanel );

    //A black rectangle that vertically 'extends' the navbar from joist, see #54
    articleContainerNode.addChild( new Rectangle( 0, 0, 3000, this.layoutBounds.height, {
      fill: 'black',
      x: -1000,
      y: this.layoutBounds.height,
      pickable: false
    } ) );

    // set the accessible order: sweater, balloons wall
    playAreaContainerNode.accessibleOrder = [ accessibleHeaderNode, sweaterNode, balloonsNode, wall ];

    // keyboard help dialog must be centered since it is instantiated within the screen view constructor
    keyboardHelpDialog.centerBottom = this.center;

    // visualise regions of the play area
    if ( BalloonsAndStaticElectricityQueryParameters.dev ) {
      articleContainerNode.addChild( new PlayAreaNode( model ) );
    }

    // enable the prototype screen reader
    if ( BalloonsAndStaticElectricityQueryParameters.reader ) {
      var cursor = new Cursor( document.body );
      var readerDisplayBounds = new Bounds2( 10, 0, this.layoutBounds.width - 20, 50 );

      // eslint complains about the unused var reader
      var reader = new Reader( cursor );

      var display = new ReaderDisplayNode( reader, readerDisplayBounds );
      articleContainerNode.addChild( display );
    }

  }

  balloonsAndStaticElectricity.register( 'BalloonsAndStaticElectricityView', BalloonsAndStaticElectricityView );

  inherit( ScreenView, BalloonsAndStaticElectricityView, {

    /**
     * Step the view.  For acccessibility, we want to step the 'AudioView'
     * and the the keyboard drag handlers.
     *
     * @param  number} dt description
     */
    step: function( dt ) {
      this.greenBalloon.step( dt );
      this.yellowBalloon.step( dt );

      // step the audio
      this.audioView && this.audioView.step( dt );
    }
  } );

  return BalloonsAndStaticElectricityView;
} );
