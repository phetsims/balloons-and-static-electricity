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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Cursor = require( 'SCENERY/accessibility/reader/Cursor' );
  var ReaderDisplayNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/ReaderDisplayNode' );
  var Reader = require( 'SCENERY/accessibility/reader/Reader' );
  var AccessibleHeadingNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleHeadingNode' );
  // var AccessibleBalloonNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleBalloonNode' );
  var BalloonNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonNode' );
  var KeyboardHelpDialog = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/KeyboardHelpDialog' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );
  var Range = require( 'DOT/Range' );
  var Line = require( 'SCENERY/nodes/Line' );

  // strings
  var yellowBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/yellowBalloon.label' );
  var greenBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloon.label' );
  var yellowBalloonDescriptionPatternString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/yellowBalloon.descriptionPattern' );
  var greenBalloonDescriptionPatternString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloon.descriptionPattern' );
  var screenDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/screen.description' );
  var screenLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/screen.label' );
  var playAreaLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/playArea.label' );
  var sceneSummaryLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/sceneSummary.label' );

  // experimental strings for patterns describing the screen overview - i18n once they are reviewed and tested
  var roomDescriptionPatternString = 'This simulation contains a Play Area and a Control Panel. The Play Area is a small room. It has {0}.';
  var balloonLocationDescriptionString = 'The {0} Balloon is in the {1}{2}{3}{4}.';
  var chargeDescriptionPatternString = 'Sweater {0} many pairs of negative and positive charges, the balloon has just a few pairs. Charges can change as you play and learn about static electricity.';
  var controlPanelDescriptionString = 'The Control Panel allows you to add and remove the wall, add and remove a second balloon, and reset Balloon charges and position.';
  var navigationDescriptionString = 'Tab to play with {0}.';

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // constants
  // var KEY_H = 72; // keypress keycode for '?'

  function BalloonsAndStaticElectricityView( model ) {

    var thisScreenView = this;

    ScreenView.call( this, { 
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      screenDescription: screenDescriptionString,
      screenLabel: screenLabelString
    } );

    // create an element for the parallel DOM that will act as a a section containing the screen description.
    // NOTE: Eventually this will be handled in scenery, but waiting until testing results to move to common code.
    // At this time, we are experimenting with adding structure to the screen description so that the user can
    // quickly find information that they are looking for.
    var descriptionSectionNode = new Node( {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {

          // this section should look like:
          // <section id="scene-description-id">
          //   <h2 id='scene-description-label-id'>Scene Summary</h2>
          //   <ul>
          //    <li>...</li>
          //    <li>...</li>
          //    ...
          //   </ul>
          // </section>

          var sectionElement = document.createElement( 'section' );

          var headerElement = document.createElement( 'h2' );
          headerElement.textContent = sceneSummaryLabelString;

          // create the description list and its items, and add in the desired order
          var descriptionList = document.createElement( 'ul' );

          var roomDescriptionItem = document.createElement( 'li' );
          descriptionList.appendChild( roomDescriptionItem );

          var locationDescriptionItem = document.createElement( 'li' );
          descriptionList.appendChild( locationDescriptionItem );

          var chargeDescriptionItem = document.createElement( 'li' );
          descriptionList.appendChild( chargeDescriptionItem );

          // TODO: This is not fully described in the design documentation
          // var releaseDescriptionItem = document.createElement( 'li' );
          // descriptionList.appendChild( releaseDescriptionItem );

          var controlPanelDescriptionItem = document.createElement( 'li' );
          controlPanelDescriptionItem.textContent = controlPanelDescriptionString;
          descriptionList.appendChild( controlPanelDescriptionItem );

          var navigationDescriptionItem = document.createElement( 'li' );
          navigationDescriptionItem.textContent = navigationDescriptionString; 
          descriptionList.appendChild( navigationDescriptionItem );

          sectionElement.appendChild( headerElement );
          sectionElement.appendChild( descriptionList );

          var updateVisibleItemsDescription = function() {
            var textContent;

            var twoBalloonsVisible = model.balloons[ 1 ].isVisible;

            // update the description of items in the play area when visibility changes
            var roomItemsString = '';
            roomItemsString += ( twoBalloonsVisible ? 'two balloons, ' : 'a balloon, ' );
            roomItemsString += ( model.wall.isVisible ? 'a sweater, and a removable wall' : 'and a sweater' );

            textContent = StringUtils.format( roomDescriptionPatternString, roomItemsString );
            roomDescriptionItem.textContent = textContent;

            // update the navigation cue
            var balloonsString = twoBalloonsVisible ? 'Balloons' : 'Balloon';
            var navitationCue = StringUtils.format( navigationDescriptionString, balloonsString );
            navigationDescriptionItem.textContent = navitationCue;
            
          };

          var updateBalloonLocationDescription = function( balloon ) {
            // what color is the balloon?
            var balloonColor = balloon === model.balloons[ 0 ] ? 'yellow' : 'green';

            // update the description depending on the location of the balloon and the visibility of the items
            var middleRange = new Range( 65, 150 );
            var upperRange = new Range( 0, 65 );
            var lowerRange = new Range( 150, 235 );
            var yPosition = balloon.locationProperty.value.y;
            var verticalPositionString = middleRange.contains( yPosition ) ? 'middle ' :
                                          upperRange.contains( yPosition ) ? 'upper part ' :
                                          lowerRange.contains( yPosition ) ? 'lower part ' :
                                          'bottom part ';

            // is the balloon in the sweater, play area, or wall?
            var xPosition = balloon.locationProperty.value.x;
            var rightBound = model.wall.isVisible ? model.bounds.maxX : model.bounds.maxX + model.wallWidth;

            var inSweater = xPosition + balloon.width < model.sweater.x + model.sweater.width + 2;
            var atWall = xPosition + balloon.width >= rightBound;

            var containedInString = inSweater ? 'of sweater, ' :
                                    atWall ? 'of wall, ' :
                                    'of play area, ';

            // where is the balloon relative to other objects in the play area?
            var nearSweaterRange = new Range( 250, 350 );
            var closerToSweaterRange = new Range( 350, 415 );
            var middleXRange = new Range( 415, 460 );
            var closerToWallRange = new Range( 460, 539 );
            var nearWallRange = new Range( 539, 554 );

            var relativePositionString = '';
            // if the balloon is in the play area and the wall is visible, describe its relative location
            if ( !atWall && !inSweater && model.wall.isVisible ) {
              relativePositionString = middleXRange.contains( xPosition ) ? 'evenly between sweater and wall. ' :
                                          closerToSweaterRange.contains( xPosition ) ? 'closer to sweater than wall. ' :
                                          nearSweaterRange.contains( xPosition ) ? 'near sweater. ' : 
                                          closerToWallRange.contains( xPosition ) ? 'closer to wall than sweater. ' :
                                          nearWallRange.contains( xPosition ) ? 'near wall' :
                                          'against wall. ';
            }

            // describe the position of the other elements on the screen
            var otherItemDescriptions = model.wall.isVisible ? 'Sweater is at far left, wall is at far right' :
                                                              'Sweater is at far left';

            // put it all together!
            var textContent = StringUtils.format( balloonLocationDescriptionString, balloonColor, verticalPositionString,
              containedInString, relativePositionString, otherItemDescriptions );

            locationDescriptionItem.textContent = textContent;

          };

          // update the screen description for charges, depending on 
          // TODO: I am unclear if this is the correct behavior from the design documents - it is not sufficient
          // to group elements in this way.
          var updateChargeDescription = function() {
            // is the wall visible?
            var sweaterAndWallString = model.wall.isVisible ? 'and wall have' : 'has';

            var textContent = StringUtils.format( chargeDescriptionPatternString, sweaterAndWallString );
            chargeDescriptionItem.textContent = textContent;
          };

          model.balloons[ 1 ].isVisibleProperty.link( function( isVisible ) {
            updateVisibleItemsDescription();
          } );

          model.balloons.forEach( function( balloon ) {
            balloon.locationProperty.link( function( location ) {
              updateBalloonLocationDescription( balloon );
            } );
          } );

          model.wall.isVisibleProperty.link( function( isVisible ) {
            updateVisibleItemsDescription();
            updateChargeDescription();
          } );

          return new AccessiblePeer( accessibleInstance, sectionElement );
        }
      }
    } );
    this.addChild( descriptionSectionNode );

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

    // create the keyboard help dialog for accessibility
    var keyboardHelpDialog = new KeyboardHelpDialog( this, {
      maxWidth: thisScreenView.layoutBounds.width
    } );

    // add the heading to the container element, and make sure it comes first
      
    this.addChild( playAreaContainerNode );

    playAreaContainerNode.addChild( accessibleHeadingNode );

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
    this.greenBalloon = new BalloonNode( 500, 200, model.balloons[ 1 ], balloonGreen, model, keyboardHelpDialog, { 
      accessibleLabel: greenBalloonLabelString,
      accessibleDescriptionPatternString: greenBalloonDescriptionPatternString
    } );
    this.yellowBalloon = new BalloonNode( 400, 200, model.balloons[ 0 ], balloonYellow, model, keyboardHelpDialog, {
      accessibleLabel: yellowBalloonLabelString,
      accessibleDescriptionPatternString: yellowBalloonDescriptionPatternString
    } );

    balloonsNode.children = [ this.yellowBalloon, this.greenBalloon ];
    playAreaContainerNode.addChild( balloonsNode );

    //Only show the selected balloon(s)
    model.balloons[ 1 ].isVisibleProperty.link( function( isVisible ) {
      thisScreenView.greenBalloon.visible = isVisible;
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
    playAreaContainerNode.accessibleOrder = [ accessibleHeadingNode, sweaterNode, balloonsNode, wall ];

    // keybaord help dialog must be centered since it is instantiated within the screen view constructor
    keyboardHelpDialog.centerBottom = this.center;

    // set the accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        // generate the 'supertype peer' for the ScreenView in the parallel DOM.
        var accessiblePeer = ScreenView.ScreenViewAccessiblePeer( accessibleInstance, '', screenLabelString );
        // accessiblePeer.domElement.setAttribute( 'role', 'application' );
        
        // give this screenView element and the node a unique ID for convenient DOM lookup
        accessiblePeer.domElement.id = 'screen-view-' + uniqueId;
        thisScreenView.accessibleId = accessiblePeer.domElement.id; // @public (a11y)

        // listen to the focusin event 
        accessiblePeer.domElement.addEventListener( 'blur', function( event ) {
          if ( event.target.getAttribute( 'role' ) === 'application' && event.relatedTarget) {
            // the related target is the element that is about to receive focus - it should be described
            // by the release description of the balloon (perpsective 3).
            // @private
            var balloonNode = thisScreenView.getBalloonByAccessibleID( event.target.id );
            thisScreenView.relatedTarget = event.relatedTarget;
            thisScreenView.relatedTargetDescription = event.relatedTarget.getAttribute( 'aria-describedby' );
            event.relatedTarget.setAttribute( 'aria-describedby', balloonNode.descriptionContainer.id );
          }
          else if ( thisScreenView.relatedTarget ) {
            // the related target should now have its original aria describedby content
            if ( thisScreenView.relatedTargetDescription ) {
              thisScreenView.relatedTarget.setAttribute( 'aria-describedby', thisScreenView.relatedTargetDescription );
            }
            else {
              // no description
              thisScreenView.relatedTarget.removeAttribute( 'aria-describedby' );
            }
            thisScreenView.relatedTarget = null;
            thisScreenView.relatedTargetDescription = null;
          }
        }, true /*dispatch down the DOM tree, focusin not supported by Firefox*/ );

        return accessiblePeer;
      }
    };

    // visualise regions of the play area
    if( BalloonsAndStaticElectricityQueryParameters.DEV ) {
      var blueOptions = { fill: 'rgba(0,0,255,0.3)' };
      var greyOptions = { fill: 'rgba(200,200,200,0.3)' };

      // left edge
      this.addChild( new Rectangle( model.playArea.leftEdge, greyOptions ) );

      // left arm
      this.addChild( new Rectangle( model.playArea.leftArm, blueOptions ) );

      // right sweater body
      this.addChild( new Rectangle( model.playArea.sweaterBodyLeft, greyOptions ) );

      // left sweater body
      this.addChild( new Rectangle( model.playArea.sweaterBodyRight, blueOptions ) );

      // right arm
      this.addChild( new Rectangle( model.playArea.rightArm, greyOptions ) );

      // left side of play area
      this.addChild( new Rectangle( model.playArea.playAreaLeft, blueOptions) );

      // center of play area
      this.addChild( new Rectangle( model.playArea.playAreaCenter, greyOptions ) );

      // right side of play Area
      this.addChild( new Rectangle( model.playArea.playAreaRight, blueOptions ) );

      // right edge of play area
      this.addChild( new Rectangle( model.playArea.rightEdge, greyOptions ) );

      // top edge of play area
      this.addChild( new Rectangle( model.playArea.topEdge, greyOptions ) );

      // upper part of play area
      this.addChild( new Rectangle( model.playArea.upper, blueOptions ) );

      // lower part of play area
      this.addChild( new Rectangle( model.playArea.lower, greyOptions ) );

      // bottom part of play area
      this.addChild( new Rectangle( model.playArea.bottomEdge, blueOptions ) );

      // draw some lines to represent positions of critical balloon points
      var lineOptions = { stroke: 'rgba(0, 0, 0,0.4)', lineWidth: 5 };
      this.addChild( new Line( model.playArea.atWall, model.playArea.minY, model.playArea.atWall, model.playArea.maxY, lineOptions ) );
      this.addChild( new Line( model.playArea.atNearWall, model.playArea.minY, model.playArea.atNearWall, model.playArea.maxY, lineOptions ) );
      this.addChild( new Line( model.playArea.atCenter, model.playArea.minY, model.playArea.atCenter, model.playArea.maxY, lineOptions ) );
      this.addChild( new Line( model.playArea.atNearSweater, model.playArea.minY, model.playArea.atNearSweater, model.playArea.maxY, lineOptions ) );


    }

    // enable the prototype screen reader 
    if( BalloonsAndStaticElectricityQueryParameters.READER ) {
      var cursor = new Cursor( document.body.getElementsByClassName( 'accessibility' )[ 0 ] );
      var readerDisplayBounds = new Bounds2( 10, 0, this.layoutBounds.width - 20, 50 );

      // eslint complains about the unused var reader
      var reader = new Reader( cursor );

      var display = new ReaderDisplayNode( reader, readerDisplayBounds );
      this.addChild( display );      
    }


  }

  inherit( ScreenView, BalloonsAndStaticElectricityView, {

    /**
     * Get the balloon node by its accessible id
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    getBalloonByAccessibleID: function( id ) {
      assert && assert( id, 'must use valid id to find balloon' );

      if ( this.yellowBalloon.dragElement.id === id ) {
        return this.yellowBalloon;
      }
      else if ( this.greenBalloon.dragElement.id === id ) {
        return this.greenBalloon;
      }
      else {
        assert && assert( false, 'No balloon node found for id: ' + id );
      }
    }
  } );
  return BalloonsAndStaticElectricityView;
} );