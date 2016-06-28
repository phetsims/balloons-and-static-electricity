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
  var Range = require( 'DOT/Range' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var BalloonModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonModel' );
  var BalloonLocationEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonLocationEnum' );

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
  var balloonReleasedPatternString = '{0} released {1}';
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

  var topLeftOfSweaterString = 'from top left side of play area, just right of sweater.';
  var upperLeftOfSweaterString = 'from upper left side of play area, just right of sweater.';
  var lowerLeftOfSweaterString = 'from lower left side of play area, just right of sweater.';
  var bottomLeftOfSweaterString = 'from bottom left side of play area, just right of sweater.';

  var topRightCornerWallString = 'against top right corner of wall.';
  var upperWallString = 'against upper wall.';
  var lowerWallString = 'against lower wall.';
  var bottomRightCornerWallString = 'against bottom right corner of wall.';

  var topRightArmString = 'top right arm.';
  var upperRightArmString = 'upper right arm. ';
  var lowerRightArmString = 'lower right arm.';
  var bottomRightArmStrinig = 'bottom right arm.';

  var topRightSweaterString = 'top right side of sweater.';
  var upperRightSweaterString = 'upper right side of sweater.';
  var lowerRightSweaterString = 'lower right side of sweater.';
  var bottomRightSweaterString = 'bottom right side of sweater.';

  var topLeftSweaterString = 'top left side of sweater.';
  var upperLeftSweaterString = 'upper left side of sweater.';
  var lowerLeftSweaterString = 'lower left side of sweater.';
  var bottomLeftSweaterString = 'bottom left side of sweater.';

  var topLeftArmString = 'top left arm.';
  var upperLeftArmString = 'upper left arm.';
  var lowerLeftArmString = 'lower left arm.';
  var bottomLeftArmString = 'bottom left arm.';

  // now sticking to, balloon charge, sweater charge
  var restingStringPattern = '{0} {1}, {2}.';
  var nowStickingToStringPattern = 'Now sticking {0}';
  var balloonChargeStringPattern = 'Balloon has a {0} charge';
  var netNegativeString = 'net negative';
  var netNeutralString = 'Net neutral';

  // constants
  var KEY_J = 74; // keycode for the 'j' key
  var KEY_H = 72; // keypress keycode for '?'

  function BalloonNode( x, y, model, imgsrc, globalModel, keyboardHelpDialog, options ) {
    var self = this;

    options = _.extend( {
      accessibleDescriptionPatternString: '',
      accessibleLabel: ''
    }, options );
    this.accessibleLabel = options.accessibleLabel; // @private

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

    this.x = x;
    this.y = y;

    // @private
    this.model = model;
    this.globalModel = globalModel;

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

            // focus the draggable node
            self.dragElement.focus();

            // balloon is now draggable and grabbed
            model.isDragged = true;
            self.dragElement.setAttribute( 'aria-grabbed', 'true' );

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

          // flag for the prototype screen reader - on blur, the reader should notify the user
          // of the newly focussed element with a polite message
          domElement.setAttribute( 'data-polite', true );

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

            // when the user presses 'spacebar' or 'enter', release the balloon
            // handled in keyup so spacebar isnt pressed immediately by the newly focused
            // button
            if ( event.keyCode === 32 || event.keyCode === 13 ) {

              // set focus to the button before setting isDragged so order of aria-live messages is correct
              self.buttonElement.focus();

              model.isDragged = false;
              domElement.setAttribute( 'aria-grabbed', 'false' );

              // reset the keystate and nothing else
              model.keyState = {};

              return;
            }

          } );

          domElement.addEventListener( 'blur', function( event ) {
            // on blur, release balloon
            model.isDragged = false;

            domElement.setAttribute( 'aria-grabbed', 'false' );

            // reset the keystate so it is fresh next time we pick up balloon
            model.keyState = {};

          } );

          model.isStoppedProperty.link( function ( isStopped ) {
            // once the charged balloon has reached a destination, describe its position and charge
            if ( isStopped && self.model.charge < 0 ) {
              var positionDescription = self.getLocationDescriptionString();
              var positionString = StringUtils.format( nowStickingToStringPattern, positionDescription );

              var sweaterChargeDescription = self.globalModel.sweater.getChargeDescription();
              var balloonChargeDescription = self.getChargeDescription();

              // build the description string
              var alertString = StringUtils.format( restingStringPattern, positionString, sweaterChargeDescription, balloonChargeDescription );
              console.log( alertString );

              var politeElement = document.getElementById( 'polite-alert' );
              politeElement.textContent = alertString;
            }
          } );

          model.isDraggedProperty.link( function( isDragged ) {
            if ( !isDragged ) {
              var releaseDescription = self.getReleaseDescription();

              var politeElement = document.getElementById( 'polite-alert' );
              politeElement.textContent = releaseDescription;
            }
            else {
              model.isStoppedProperty.set( false );
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

    /**
     * Get a description of how quickly the balloon moves to another object in the play area
     * as a function of charge.
     * @param  {number} charge
     * @return {string}
     */
    getVelocityDescription: function( charge ) {
      var velocityDescription = '';

      var verySlowRange = new Range( 1, 14 );
      var slowRange = new Range( 15, 29 );
      var quickRange = new Range( 30, 44 );
      var veryQuickRange = new Range( 45, 57 );
      var absCharge = Math.abs( charge );

      if ( verySlowRange.contains( absCharge ) ) {
        velocityDescription = 'very slowly';
      }
      else if ( slowRange.contains( absCharge ) ) {
        velocityDescription = 'slowly';
      }
      else if ( quickRange.contains( absCharge ) ) {
        velocityDescription = 'quickly';
      }
      else if ( veryQuickRange.contains( absCharge ) ) {
        velocityDescription = 'very quickly';
      }
      return velocityDescription;
    },

    /**
     * Get a description of the balloon after it has been released.
     * This description id dependent on the position.
     * @return {string} [description]
     */
    getReleaseDescription: function() {
      // when the balloon is released, we should hear a description about the released balloon
      // see https://docs.google.com/spreadsheets/d/1BiXFN2dRWfsjqV2WvKAXnZFhsk0jCxbnT0gkZr_T5T0/edit?ts=568067c0#gid=931000658
      var descriptionString = '';
      var locationString = this.getLocationDescriptionString();
      var balloonReleasedString = StringUtils.format( balloonReleasedPatternString, this.accessibleLabel, locationString );

      if ( this.model.charge === 0 ) {
        // when the charg is zero, we want to hear the balloon Label, release position, no change in position,
        // no change in charges, button label

        // TODO: This should be a string pattern
        descriptionString = balloonReleasedString + ' ' + noChangeInPositionString + ' ' + noChangeInChargeString;
      }
      else {
        // otherwise, we want to hear the balloon label, release position, description of what is happening during the
        // release, followed by the resting position, summary description of closest object, balloon charge description,
        // finally the lable of the focussed item
        var velocityDescription = this.getVelocityDescription( this.model.charge );
        var attractedQuicklyStringPattern = 'Attracted {0} {1}';
        var toWallString = 'to wall';
        var toSweaterString = 'to sweater';

        var force = BalloonModel.getTotalForce( this.globalModel, this.model );
        var toObjectString;
        if ( force.x > 0 ) {
          toObjectString = toWallString;
        }
        else {
          toObjectString = toSweaterString;
        }

        var movementDescriptionString = '';

        // if the balloon is touching the wall or is on the sweater, only describe release
        if ( this.model.getCenter().x === this.globalModel.playArea.atWall ) {
          movementDescriptionString = '';
        }
        else if ( this.model.getCenter().x < this.globalModel.playArea.atSweater ) {
          movementDescriptionString = '';
        }
        else {
          movementDescriptionString = StringUtils.format( attractedQuicklyStringPattern, velocityDescription, toObjectString );
        }

        descriptionString = balloonReleasedString + ' ' + movementDescriptionString;
      }

      console.log( descriptionString );
      return descriptionString;
    },

    /**
     * Get a description of the charge on the balloon
     * For now, this is just relative based on neutrality
     * @return {string}
     */
    getChargeDescription: function() {
      // no more, a few more, several more, several more
      if ( this.model.charge < 0 ) {
        return StringUtils.format( balloonChargeStringPattern, netNegativeString );
      }
      else {
        return StringUtils.format( balloonChargeStringPattern, netNeutralString );
      }
    },

    getLocationDescriptionString: function() {
      var balloonCenter = this.model.getCenter();
      var bounds = this.globalModel.playArea.getPointBounds( balloonCenter );

      // descriptiosn of balloon along wall
      if ( balloonCenter.x === this.globalModel.playArea.atWall ) {
        if ( bounds === BalloonLocationEnum.TOP_RIGHT_PLAY_AREA ) {
          return topRightCornerWallString;
        }
        else if ( bounds === BalloonLocationEnum.UPPER_RIGHT_PLAY_AREA ) {
          return upperWallString;
        }
        else if ( bounds === BalloonLocationEnum.LOWER_RIGHT_PLAY_AREA ) {
          return lowerWallString;
        }
        else if ( bounds === BalloonLocationEnum.BOTTOM_RIGHT_PLAY_AREA ) {
          return bottomRightCornerWallString;
        }
      }
      else {
        // the balloon is elswhere in the play area
        // near wall strings
        if ( bounds === BalloonLocationEnum.TOP_RIGHT_PLAY_AREA ) {
          return topRightNearWallString;
        }
        else if ( bounds === BalloonLocationEnum.UPPER_RIGHT_PLAY_AREA ) {
          return upperRightNearWallString;
        }
        else if ( bounds === BalloonLocationEnum.LOWER_RIGHT_PLAY_AREA ) {
          return lowerRightNearWallString;
        }
        else if ( bounds === BalloonLocationEnum.BOTTOM_RIGHT_PLAY_AREA ) {
          return bottomRightNearWallString;
        }
        // center of play area strings
        else if ( bounds === BalloonLocationEnum.TOP_CENTER_PLAY_AREA ) {
          return topAtHalfwayString;
        }
        else if ( bounds === BalloonLocationEnum.UPPER_CENTER_PLAY_AREA ) {
          return upperAtHalfwayString;
        }
        else if ( bounds === BalloonLocationEnum.LOWER_CENTER_PLAY_AREA ) {
          return lowerAtHalfwayString;
        }
        else if ( bounds === BalloonLocationEnum.BOTTOM_CENTER_PLAY_AREA ) {
          return bottomAtHalfwayString;
        }
        // left of play area strings
        else if ( bounds === BalloonLocationEnum.TOP_LEFT_PLAY_AREA ) {
          return topLeftOfSweaterString;
        }
        else if ( bounds === BalloonLocationEnum.UPPER_LEFT_PLAY_AREA ) {
          return upperLeftOfSweaterString;
        }
        else if ( bounds === BalloonLocationEnum.UPPER_LEFT_PLAY_AREA ) {
          return lowerLeftOfSweaterString;
        }
        else if ( bounds === BalloonLocationEnum.UPPER_LEFT_PLAY_AREA ) {
          return bottomLeftOfSweaterString;
        }
        // right arm strings
        else if ( bounds === BalloonLocationEnum.TOP_RIGHT_ARM ) {
          return topRightArmString;
        }
        else if ( bounds === BalloonLocationEnum.UPPER_RIGHT_ARM ) {
          return upperRightArmString;
        }
        else if ( bounds === BalloonLocationEnum.LOWER_RIGHT_ARM ) {
          return lowerRightArmString;
        }
        else if ( bounds === BalloonLocationEnum.BOTTOM_RIGHT_ARM ) {
          return bottomRightArmStrinig;
        }
        // right sweater body strings
        else if ( bounds === BalloonLocationEnum.TOP_RIGHT_SWEATER ) {
          return topRightSweaterString;
        }
        else if ( bounds === BalloonLocationEnum.UPPER_RIGHT_SWEATER ) {
          return upperRightSweaterString;
        }
        else if ( bounds === BalloonLocationEnum.LOWER_RIGHT_SWEATER ) {
          return lowerRightSweaterString;
        }
        else if ( bounds === BalloonLocationEnum.BOTTOM_RIGHT_SWEATER ) {
          return bottomRightSweaterString;
        }
        // left sweater body strings
        else if ( bounds === BalloonLocationEnum.TOP_LEFT_SWEATER ) {
          return topLeftSweaterString;
        }
        else if ( bounds === BalloonLocationEnum.UPPER_LEFT_SWEATER ) {
          return upperLeftSweaterString;
        }
        else if ( bounds === BalloonLocationEnum.LOWER_LEFT_SWEATER ) {
          return lowerLeftSweaterString;
        }
        else if ( bounds === BalloonLocationEnum.BOTTOM_LEFT_SWEATER ) {
          return bottomLeftSweaterString;
        }
        // left sweater arm strings
        else if ( bounds === BalloonLocationEnum.TOP_LEFT_ARM ) {
          return topLeftArmString;
        }
        else if ( bounds === BalloonLocationEnum.UPPER_LEFT_ARM ) {
          return upperLeftArmString;
        }
        else if ( bounds === BalloonLocationEnum.LOWER_LEFT_ARM ) {
          return lowerLeftArmString;
        }
        else if ( bounds === BalloonLocationEnum.BOTTOM_LEFT_ARM ) {
          return bottomLeftArmString;
        }

        return 'No description for this location!';
      }
    }
  } );
} );
