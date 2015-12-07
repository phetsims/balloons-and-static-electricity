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

  // strings
  var yellowBalloonDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/yellowBalloon.description' );
  var greenBalloonDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloon.description' );
  var screenDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/screen.description' );
  var screenLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/screen.label' );
  var playAreaLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/playArea.label' );

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  function BalloonsAndStaticElectricityView( model ) {
    ScreenView.call( this, { 
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      screenDescription: screenDescriptionString,
      screenLabel: screenLabelString
    } );

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

          // heading element
          var headingElement = document.createElement( 'h2' );
          headingElement.innerText = playAreaLabelString;
          headingElement.id = 'play-area-label-' + uniqueId;
          sectionElement.setAttribute( 'aria-labelledby', headingElement.id );

          // structure the heading
          sectionElement.appendChild( headingElement );

          return new AccessiblePeer( accessibleInstance, sectionElement );
        }
      }
    } );
    this.addChild( playAreaContainerNode );

    playAreaContainerNode.addChild( new SweaterNode( model ) );

    var wall = new WallNode( model );
    playAreaContainerNode.addChild( wall );

    //Show black to the right side of the wall so it doesn't look like empty space over there
    this.addChild( new Rectangle( model.wall.x + wall.wallNode.width, 0, 1000, 1000, { fill: 'black' } ) );

    //Add black to the left of the screen to match the black region to the right of the wall
    var maxX = this.layoutBounds.maxX - model.wall.x - wall.wallNode.width;
    this.addChild( new Rectangle( maxX - 1000, 0, 1000, 1000, { fill: 'black' } ) );

    var balloonsNode = new Node(); // TODO: Why this container?
    var greenBalloon = new BalloonNode( 500, 200, model.balloons[ 1 ], balloonGreen, model, { zibleDescription: greenBalloonDescriptionString } );
    var yellowBalloon = new BalloonNode( 400, 200, model.balloons[ 0 ], balloonYellow, model, { accessibleDescription: yellowBalloonDescriptionString } );
    balloonsNode.children = [ greenBalloon, yellowBalloon ];
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

    // define the accessible order for this screen
    // this.accessibleOrder = [ yellowBalloon, greenBalloon, wall ];

  }

  inherit( ScreenView, BalloonsAndStaticElectricityView );
  return BalloonsAndStaticElectricityView;
} );