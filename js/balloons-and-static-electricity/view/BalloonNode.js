// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the Balloon of the model.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  // constants - to monitor the direction of dragging
  var UP = 'UP';
  var DOWN = 'DOWN';
  var LEFT = 'LEFT';
  var RIGHT = 'RIGHT';
  
  // strings
  // var neutralString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/neutral' );
  // var netNegativeString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/netNegative' );
  // var releaseLocationPatternString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/releaseLocationPattern' );
  // var noString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/no' );
  // var aFewString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/aFew' );
  // var severalString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/several' );
  // var manyString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/many' );
  // var balloonNavigationCuesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloon.navigationCues' );
  var grabPatternString = require ('string!BALLOONS_AND_STATIC_ELECTRICITY/grabPattern' );
  var balloonGrabCueString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloonGrabCue' );
  var balloonReleasedPatternString = '{0} released';
  var noChangeInPositionString = 'No change in position.';
  var noChangeInChargeString = 'No change in charge.';

  var topRightNearWallString = 'from top right side of play area, near wall.';
  var upperRightNearWallString = 'from upper right side of play area, near wall.';
  var lowerRightNearWallString = 'from lower right side of play area, near wall.';
  var bottomRightNearWallString = 'from bottom right side of play area, near wall.';

  var topAtHalfwayString = 'from top of play area at halfway mark.';
  var upperAtHalfwayString = 'from upper part of play area at halfway mark.';
  var lowerAtHalfwayString = 'from lower part of play area at halfway mark.';
  var bottomAtHalfwayString = 'from bottom of Play Area at halfway mark.';

  var topLeftSweaterString = 'from top left side of play area, just right of sweater.';
  var upperLeftSweaterString = 'from upper left side of play area, just right of sweater.';
  var lowerLeftSweaterString = 'from lower left side of play area, just right of sweater.';
  var bottomLeftSweaterString = 'from bottom left side of play area, just right of sweater.';

  var topRightCornerWallString = 'against top right corner of wall.';
  var upperWallString = 'against upper wall.';
  var lowerWallString = 'against lower wall.';
  var bottomRightCornerWallString = 'against bottom right corner of wall.';

  // constants
  var KEY_J = 74; // keycode for the 'j' key
  var KEY_H = 72; // keypress keycode for '?'

  function BalloonNode( x, y, model, imgsrc, globalModel, keyboardHelpDialog, options ) {
    var self = this;

    options = _.extend( {
      accessibleDescriptionPatternString: '',
      accessibleLabel: ''
    }, options );

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

    this.x = x;
    this.y = y;

    this.playArea = globalModel.playArea;

    this.accessibleId = this.id; // @private, for identifying the representation of this node in the accessibility tree.
    this.initialGrab = true;

    var startChargesNode = new Node( { pickable: false } );
    var addedChargesNode = new Node( { pickable: false } );

    var property = {

      //Set only to the legal positions in the frame
      set: function( location ) { model.location = globalModel.checkBalloonRestrictions( location, model.width, model.height ); },

      //Get the location of the model
      get: function() { return model.location; }
    };

    //When dragging, move the balloon
    var balloonDragHandler = new MovableDragHandler( property, {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      startDrag: function() {
        model.isDragged = true;
      },
      endDrag: function() {
        model.isDragged = false;
        model.velocity = new Vector2( 0, 0 );
      }
    } );

    this.addInputListener( balloonDragHandler );

    // add the Balloon image
    var balloonImageNode = new Image( imgsrc );
    this.addChild( balloonImageNode );

    //rope
    //TODO: For performance, move this out of BalloonNode and into a separate layer ?
    var customShape = new Shape();
    customShape.moveTo( model.width / 2, model.height - 2 );
    customShape.lineTo( 440 - model.location.x + model.width / 2, 50 + globalModel.height - model.location.y );
    var path = new Path( customShape, {
      stroke: '#000000',
      lineWidth: 1,
      pickable: false
    } );
    this.addChild( path );

    // static charges
    for ( var i = 0; i < model.plusCharges.length; i++ ) {
      model.plusCharges[ i ].view = new PlusChargeNode( model.plusCharges[ i ].location );
      startChargesNode.addChild( model.plusCharges[ i ].view );

      model.minusCharges[ i ].view = new MinusChargeNode( model.minusCharges[ i ].location );
      startChargesNode.addChild( model.minusCharges[ i ].view );
    }

    //possible charges
    for ( i = model.plusCharges.length; i < model.minusCharges.length; i++ ) {
      model.minusCharges[ i ].view = new MinusChargeNode( model.minusCharges[ i ].location );
      model.minusCharges[ i ].view.visible = false;
      addedChargesNode.addChild( model.minusCharges[ i ].view );
    }

    this.addChild( startChargesNode );
    this.addChild( addedChargesNode );

    //if change charge, show more minus charges
    model.chargeProperty.link( function updateLocation( chargeVal ) {
      if ( chargeVal ) {
        model.minusCharges[ model.plusCharges.length - 1 - chargeVal - 1 ].view.visible = true;
      }
    } );

    //changes visual position
    model.locationProperty.link( function updateLocation( location ) {
      self.translation = location;
      customShape = new Shape();
      customShape.moveTo( model.width / 2, model.height - 2 );
      customShape.lineTo( 440 - model.location.x + model.width / 2, 50 + globalModel.height - model.location.y );
      path.shape = customShape;
    } );

    //show charges based on showCharges property
    globalModel.showChargesProperty.link( function updateChargesVisibilityOnBalloon( value ) {
      if ( value === 'diff' ) {
        startChargesNode.visible = false;
        addedChargesNode.visible = true;
      }
      else {
        var visiblity = (value === 'all');
        startChargesNode.visible = visiblity;
        addedChargesNode.visible = visiblity;
      }
    } );

    this.buttonHightlightNode = new Rectangle( 0, 0, balloonImageNode.width, balloonImageNode.height, {
        lineWidth: 4 / balloonImageNode.transform.transformDelta2( Vector2.X_UNIT ).magnitude(),
        stroke: 'rgba( 250, 40, 135, 0.9 )'
    } ); 

    this.applicationHighlightNode = new Rectangle( 0, 0, balloonImageNode.width, balloonImageNode.height, {
        lineWidth: 4 / balloonImageNode.transform.transformDelta2( Vector2.X_UNIT ).magnitude(),
        stroke: 'black'
    } );

    // create child nodes for the sole purpose of accessibility - these are invisible but implement
    // keyboard navigation and auditory descriptions for the balloon.
    // The balloon is represented by two elements.  A button that initiates dragging behavior, 
    // and a widget that can be dragged and dropped.
    // As rectangles, we get the bounds for the focus highlight
    
    // this node will contain the 'Grab Balloon' button
    var accessibleButtonNode = new Rectangle( balloonImageNode.bounds, {
      accessibleContent: {
        focusHighlight: self.buttonHightlightNode,
        createPeer: function( accessibleInstance ) {

          // the domElement is a button
          var domElement = document.createElement( 'button' );

          // @private - for easy access accross the dom
          self.buttonElement = domElement; 

          // the inner text of the button is the label
          var grabBalloonString = StringUtils.format( grabPatternString, options.accessibleLabel );
          domElement.textContent = grabBalloonString;

          // pick up the balloon for dragging when the button is clicked
          domElement.addEventListener( 'click', function() {

            // balloon is now draggable and grabbed
            model.isDragged = true;
            self.dragElement.setAttribute( 'aria-grabbed', 'true' );

            // focus the draggable element
            self.dragElement.focus();

            // reset the velocity when picked up
            model.velocityProperty.set( new Vector2( 0, 0 ) );

          } );

          return new AccessiblePeer( accessibleInstance, domElement );
        }
      }
    } );

    var buttonDescriptionNode = new Node( {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var domElement = document.createElement( 'p' );
          domElement.textContent = balloonGrabCueString;

          return new AccessiblePeer( accessibleInstance, domElement );
        }
      }
    } );

    // this node will contain the 'Draggable Balloon' div
    var accessibleDragNode = new Rectangle( balloonImageNode.bounds, {
      accessibleContent: {
        focusHighlight: self.applicationHighlightNode,
        createPeer: function( accessibleInstance ) {
          var trail = accessibleInstance.trail;
          var uniqueID = trail.getUniqueId();

          // the domElement is a draggable application div
          var domElement = document.createElement( 'div' );
          domElement.setAttribute ( 'draggable', 'true' );
          domElement.id = 'draggable-balloon-' + uniqueID;
          domElement.setAttribute( 'role', 'application' );

          // add the label
          domElement.setAttribute( 'aria-label', options.accessibleLabel );

          // @private - for easy access accross dom elements
          self.dragElement = domElement;

          // this can only be found with the arrow keys
          domElement.tabIndex = -1;

          // create the accessible label for the grabbed balloon
          var labelElement = document.createElement( 'h3' );
          labelElement.id = 'balloon-label-' + uniqueID;
          labelElement.textContent = options.accessibleLabel;

          domElement.addEventListener( 'keydown', function( event ) {
            // when the user presses 'spacebar' or 'enter', release the balloon
            if ( event.keyCode === 32 || event.keyCode === 13 ) {
              model.isDragged = false;
              domElement.setAttribute( 'aria-grabbed', 'false' );
              self.buttonElement.focus();

              // reset the keystate and nothing else
              model.keyState = {};

              return;
            }

            // update the keyState object for keyboard interaction
            model.keyState[ event.keyCode || event.which ] = true;

            // If the user presses j, enter jumping mode and pick the balloon up
            if ( model.keyState[ KEY_J ] ) {
              model.isJumping = true;
            }

            if ( model.keyState[ KEY_H ] ) {
              // blur the balloon immediately
              document.activeElement.blur();
            
              keyboardHelpDialog.activeElement = self.accessibleInstances[0].peer.domElement;
              keyboardHelpDialog.shownProperty.set( true );
            }  
          } );

          // update keystate
          domElement.addEventListener( 'keyup', function( event ) {
            // update the keyState object for keyboard interaction 
            model.keyState[ event.keyCode || event.which ] = false;

          } );

          var playArea = globalModel.playArea;
          model.isDraggedProperty.link( function( isDragged ) {
            if ( !isDragged ) {
              // when the balloon is released, we should hear a description about the released balloon
              // see https://docs.google.com/spreadsheets/d/1BiXFN2dRWfsjqV2WvKAXnZFhsk0jCxbnT0gkZr_T5T0/edit?ts=568067c0#gid=931000658
              if ( model.charge === 0 ) {
                // when the charg is zero, we want to hear the balloon Label, release position, no change in position,
                // no change in charges, button label
                var balloonReleasedString = StringUtils.format( balloonReleasedPatternString )
              }

            }
          } );

          return new AccessiblePeer( accessibleInstance, domElement );
        }
      }
    } );

    this.addChild( accessibleButtonNode );
    this.addChild( buttonDescriptionNode );
    this.addChild( accessibleDragNode );

    // add a circle to the center of the balloon to assist with location
    if ( BalloonsAndStaticElectricityQueryParameters.DEV ) {
      this.addChild( new Circle( 5, { fill: 'black', center: balloonImageNode.center } ) );
    }

    // accessible content for this node is just a container div
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueID = trail.getUniqueId();

        var domElement = document.createElement( 'div' );
        domElement.id = 'accessible-balloon-' + uniqueID;

        self.domElement = domElement;

        // link all properties
        // element should be invisible with balloon
        model.isVisibleProperty.link( function( isVisible ) {
          domElement.hidden = !isVisible;
        } );

        return new AccessiblePeer( accessibleInstance, domElement );

      }
    };
    
    model.view = this;
  }

  return inherit( Node, BalloonNode, {

    /**
     * Get the direction of dragging.  TODO: Do we need to handle diagonal dragging?
     * 
     * @param  {} location
     * @param  {} oldLocations
     * @return {string}
     */
    getDraggingDirection: function( location, oldLocation ) {

      var deltaX = location.x - oldLocation.x;
      var deltaY = location.y - oldLocation.y;

      if ( deltaX > 0 ) {
        return RIGHT;
      }
      else if ( deltaX < 0 ) {
        return LEFT;
      }
      else if ( deltaY < 0 ) {
        return UP;
      }
      else if ( deltaY > 0 ) {
        return DOWN;
      }
      else {
        assert && assert( 'case not supported in getDraggingDirection' );
      }
    },

    getPositionDescriptionString: function() {
    }
  } );
} );
