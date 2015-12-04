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

  // strings
  var yellowBalloonDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/yellowBalloon.description' );
  var greenBalloonDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloon.description' );
  var screenViewLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/screenView.label');
  var screenViewDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/screenView.description');

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  function BalloonsAndStaticElectricityView( model ) {
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    this.addChild( new SweaterNode( model ) );

    var wall = new WallNode( model );
    this.addChild( wall );

    //Show black to the right side of the wall so it doesn't look like empty space over there
    this.addChild( new Rectangle( model.wall.x + wall.wallNode.width, 0, 1000, 1000, { fill: 'black' } ) );

    //Add black to the left of the screen to match the black region to the right of the wall
    var maxX = this.layoutBounds.maxX - model.wall.x - wall.wallNode.width;
    this.addChild( new Rectangle( maxX - 1000, 0, 1000, 1000, { fill: 'black' } ) );

    var balloonsNode = new Node();
    var greenBalloon = new BalloonNode( 500, 200, model.balloons[ 1 ], balloonGreen, model, { zibleDescription: greenBalloonDescriptionString } );
    var yellowBalloon = new BalloonNode( 400, 200, model.balloons[ 0 ], balloonYellow, model, { accessibleDescription: yellowBalloonDescriptionString } );
    balloonsNode.children = [ greenBalloon, yellowBalloon ];
    this.addChild( balloonsNode );

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

    // outfit a11y
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {

        // generate the 'supertype peer' for the ScreenView in the parallel DOM.
        var accessiblePeer = ScreenView.ScreenViewAccessiblePeer( accessibleInstance );
        var domElement = accessiblePeer.domElement;

        // we want the parallel DOM to look like this:
        // <header role="banner" aria-labelledby="scene-label" aria-describedby="scene-description">
        //   <h1 id="scene-label">The Scene for Balloons &amp; Static Electricity</h1> 
        //   <!-- General scene description for page load. Parts will need change dynamically once I figure that out.-->
        //   <div id="scene-description">
        //     <p>A balloon floats evenly between a large woolly sweater and a removable wall. The sweater is to the left and the wall is to the right.</p> 
        //     <p>Each object shows negative and positive charges. Charges are shown in pairs. Currently, the sweater and the wall have many pairs of charges, the balloon, just a few.</p>
        //     <p>The control panel has controls to add a second balloon, adjust charge views and to reset the entire experiment.</p>
        //     <p>Select Tab for next item. Select K or question mark for keyboard help. Select H for a heading outline.</p>
        //   </div>
        // </header>

        var headerElement = document.createElement( 'header' );
        headerElement.setAttribute( 'role', 'banner' );
        headerElement.setAttribute( 'aria-labelledby', 'scene-label' );
        headerElement.setAttribute( 'aria-describedby', 'scene-description' );

        // create the scene label
        var labelElement = document.createElement( 'h1' );
        labelElement.id = 'scene-label';
        labelElement.innerText = screenViewLabelString;

        // general scene descriptoin for page load.  Parts of the description will need to change dynamically.
        var descriptionElement = document.createElement( 'div' );
        descriptionElement.id = 'scene-description';

        // TODO: Why is there a separate paragraph(s)  for this?  Could we skip the div and just go right into the paragraph for the descriptoin?
        var descriptionParagraph = document.createElement( 'p' );
        descriptionParagraph.innerText = screenViewDescriptionString;

        // structure these elements
        domElement.appendChild( headerElement );
        headerElement.appendChild( labelElement );
        headerElement.appendChild( descriptionElement );
        descriptionElement.appendChild( descriptionParagraph );

        // var accessiblePeer = new AccessiblePeer( accessibleInstance, headerElement );

        return accessiblePeer;
      }
    };

    // define the accessible order for this screen
    this.accessibleOrder = [ yellowBalloon, greenBalloon, wall ];

  }

  inherit( ScreenView, BalloonsAndStaticElectricityView );
  return BalloonsAndStaticElectricityView;
} );