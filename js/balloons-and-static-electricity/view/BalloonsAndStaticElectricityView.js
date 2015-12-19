// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ControlPanel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/ControlPanel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SweaterNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/SweaterNode' );
  var WallNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/WallNode' );
  var BalloonNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var AccessibleHeadingNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleHeadingNode' );
  var KeyboardHelpDialog = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/KeyboardHelpDialog' );

  // strings
  var yellowBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/yellowBalloon.label' );
  var greenBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloon.label' );
  var yellowBalloonDescriptionPatternString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/yellowBalloon.descriptionPattern' );
  var greenBalloonDescriptionPatternString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloon.descriptionPattern' );
  var screenDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/screen.description' );
  var screenLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/screen.label' );
  var playAreaLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/playArea.label' );

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // constants
  var KEY_QUESTION_MARK = 63; // keypress keycode for '?'

  function BalloonsAndStaticElectricityView( model ) {

    var thisScreenView = this;

    ScreenView.call( this, { 
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      screenDescription: screenDescriptionString,
      screenLabel: screenLabelString
    } );

    // create an accessible heading for the entire screen view
    var accessibleHeadingNode = new AccessibleHeadingNode( 'h2', playAreaLabelString );

    // create a parent container for all things in the 'play area' to structure the accessibility DOM into sections
    var playAreaContainerNode = new Node( {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var trail = accessibleInstance.trail;
          var uniqueId = trail.getUniqueId();

          // The parent in the parallel DOM should look like:
          // <section id="play-area">
          //  <h2 id="pa-label">Play Area</h2>
          var sectionElement = document.createElement( 'section' );
          sectionElement.id = 'play-area-' + uniqueId;
          sectionElement.setAttribute( 'aria-labelledby', 'heading-node-' + accessibleHeadingNode.id );

          return new AccessiblePeer( accessibleInstance, sectionElement );
        }
      }
    } );

    // add the heading to the container element, and make sure it comes first
    playAreaContainerNode.addChild( accessibleHeadingNode );
    playAreaContainerNode.accessibleOrder = [ accessibleHeadingNode ];
    this.addChild( playAreaContainerNode );

    var sweaterNode = new SweaterNode( model );
    playAreaContainerNode.addChild( sweaterNode );

    var wall = new WallNode( model );
    playAreaContainerNode.addChild( wall );

    //Show black to the right side of the wall so it doesn't look like empty space over there
    this.addChild( new Rectangle( model.wall.x + wall.wallNode.width, 0, 1000, 1000, { fill: 'black' } ) );

    //Add black to the left of the screen to match the black region to the right of the wall
    var maxX = this.layoutBounds.maxX - model.wall.x - wall.wallNode.width;
    this.addChild( new Rectangle( maxX - 1000, 0, 1000, 1000, { fill: 'black' } ) );

    var balloonsNode = new Node(); // TODO: Why this container?
    var greenBalloon = new BalloonNode( 500, 200, model.balloons[ 1 ], balloonGreen, model, { 
      accessibleLabel: greenBalloonLabelString,
      accessibleDescriptionPatternString: greenBalloonDescriptionPatternString
    } );
    var yellowBalloon = new BalloonNode( 400, 200, model.balloons[ 0 ], balloonYellow, model, {
      accessibleLabel: yellowBalloonLabelString,
      accessibleDescriptionPatternString: yellowBalloonDescriptionPatternString
    } );
    balloonsNode.children = [ yellowBalloon, greenBalloon ];
    playAreaContainerNode.addChild( balloonsNode );

    //Only show the selected balloon(s)
    model.balloons[ 1 ].isVisibleProperty.link( function( isVisible ) {
      greenBalloon.visible = isVisible;
    } );

    this.addChild( new ControlPanel( model, this.layoutBounds ) );

    //A black rectangle that vertically 'extends' the navbar from joist, see #54
    this.addChild( new Rectangle( 0, 0, 3000, this.layoutBounds.height, {
      fill: 'black',
      x: -1000,
      y: this.layoutBounds.height,
      pickable: false
    } ) );

    // set the accessible order: sweater, balloons wall
    playAreaContainerNode.accessibleOrder = [ sweaterNode, balloonsNode, wall ];

    var keyboardHelpDialog = new KeyboardHelpDialog( this );
    keyboardHelpDialog.center = yellowBalloon.center;

    // set the accessible content

    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        // generate the 'supertype peer' for the ScreenView in the parallel DOM.
        var accessiblePeer = ScreenView.ScreenViewAccessiblePeer( accessibleInstance, screenDescriptionString, screenLabelString );
        // accessiblePeer.domElement.setAttribute( 'role', 'application' );
        
        // give this screenView element and the node a unique ID for convenient DOM lookup
        accessiblePeer.domElement.id = 'screen-view-' + uniqueId;
        thisScreenView.accessibleId = accessiblePeer.domElement.id; // @public (a11y)

        // add a global event listener to all children of this screen view, bubbles through all children
        // keypress event used to find '?'
        var activeElement;
        window.addEventListener( 'keypress', function( event ) {
          // 'global' event behavior in here...
          if( event.which === KEY_QUESTION_MARK ) {

            // track the active element so we can focus it once the help dialog closes
            activeElement = document.activeElement;

            // pull up the help dialog
            keyboardHelpDialog.shownProperty.set( true );

          }
          
        } );

        window.addEventListener( 'keydown', function( event ) {
          if( event.keyCode === 27 ) {

            // hide the keyboardHelpDialog
            keyboardHelpDialog.shownProperty.set( false );

            // reset focus to the domElement
            if( activeElement ) { activeElement.focus(); }
          } 
        } );

        return accessiblePeer;
      }
    };

  }

  inherit( ScreenView, BalloonsAndStaticElectricityView );
  return BalloonsAndStaticElectricityView;
} );