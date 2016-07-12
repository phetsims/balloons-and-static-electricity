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
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );

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
  var balloonReleasedPatternString = '{0} released from {1}';
  var noChangeInPositionString = 'No change in position.';
  var noChangeInChargeString = 'No change in charge.';

  var topRightNearWallString = 'top right side of play area, near wall.';
  var upperRightNearWallString = 'upper right side of play area, near wall.';
  var lowerRightNearWallString = 'lower right side of play area, near wall.';
  var bottomRightNearWallString = 'bottom right side of play area, near wall.';

  var topAtHalfwayString = 'top of play area at halfway mark.';
  var upperAtHalfwayString = 'upper part of play area at halfway mark.';
  var lowerAtHalfwayString = 'lower part of play area at halfway mark.';
  var bottomAtHalfwayString = 'bottom of Play Area at halfway mark.';

  var topLeftOfSweaterString = 'top left side of play area, just right of sweater.';
  var upperLeftOfSweaterString = 'upper left side of play area, just right of sweater.';
  var lowerLeftOfSweaterString = 'lower left side of play area, just right of sweater.';
  var bottomLeftOfSweaterString = 'bottom left side of play area, just right of sweater.';

  var topRightCornerWallString = 'top right corner of wall.';
  var upperWallString = 'upper wall.';
  var lowerWallString = 'lower wall.';
  var bottomRightCornerWallString = 'bottom right corner of wall.';

  var rightOfPlayAreaString = 'right of play area';
  var topOfPlayAreaString = 'top of play area';
  var bottomOfPlayAreaString = 'bottom of play area';
  var sweaterString = 'sweater';
  var wallString = 'wall';

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
  var nowStickingToPatternString = 'Now sticking to {0}';
  var balloonNetChargePatternString = 'Balloon has a {0} charge';
  var netNegativeString = 'net negative';
  var netNeutralString = 'Net neutral';

  // charge description strings
  var noMoreString = 'no more';
  var aFewMoreString = 'a few more';
  var severalMoreString = 'several more';
  var manyMoreString = 'many more';

  var balloonComparativeChargePatternString = 'Balloon has {0} negative charges than positive ones';
  var sweaterComparativeChargePatternString = 'Sweater has {0} positive charges than negative ones';

  var leftString = 'left';
  var rightString = 'right';
  var upString = 'up';
  var downString = 'down';
  var balloonDirectionPatternString = '{0}, {1} towards {2}.';

  // approaching strings
  var closerString = 'Closer.';
  var atEdgeOfSweaterString = 'At edge of sweater.';
  var nearWallString = 'Near wall.';

  // location alerts
  var onSweaterString = 'on sweater.';
  var atWallString = 'at wall';
  var atLeftEdgeOfPlayAreaString = 'at far left of Play Area';
  var atRightEdgeOfPlayAreaString = 'at far right of play area';
  var atTopOfPlayAreaString = 'at top of play area';
  var atBottomOfPlayAreaString = 'at bottom of play area';
  var gettingThereString = 'getting there';

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

    // TODO: these should be maintained by the model
    this.initialGrab = true;
    // this.model.direction = ''; // the direction of movement of the balloon
    this.playAreaRegion = this.globalModel.playArea.getPointBounds( this.model.getCenter() );
    this.boundingObject = null; // object the balloon is touching, including bounding edges of the play area

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
          var grabBalloonString = StringUtils.format( grabPatternString, self.accessibleLabel );
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
          domElement.setAttribute( 'aria-grabbed', false );
          domElement.id = 'draggable-balloon-' + uniqueID;
          domElement.setAttribute( 'role', 'application' );

          // flag for the prototype screen reader - on blur, the reader should notify the user
          // of the newly focussed element with a polite message
          domElement.setAttribute( 'data-polite', true );

          // add the label
          domElement.setAttribute( 'aria-label', self.accessibleLabel );

          // @private - for easy access accross dom elements
          self.dragElement = domElement;

          // this can only be found with the arrow keys
          domElement.tabIndex = -1;

          // create the accessible label for the draggable balloon
          var labelElement = document.createElement( 'h3' );
          labelElement.id = 'balloon-label-' + uniqueID;
          labelElement.textContent = self.accessibleLabel;
          domElement.setAttribute( 'aria-labelledby', labelElement.id );
          domElement.appendChild( labelElement );

          // create the accessible description for the draggable balloon
          var balloonDescriptionString = self.getBalloonDescriptionString();
          var descriptionElement = document.createElement( 'p' );
          descriptionElement.id = 'balloon-description-' + uniqueID;
          domElement.setAttribute( 'aria-describedby', descriptionElement.id );
          descriptionElement.textContent = balloonDescriptionString;
          domElement.appendChild( descriptionElement );

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

          // when the location or charge changes, update the description of the draggable widge
          model.chargeProperty.link( function() {
            var newDescription = self.getBalloonDescriptionString();

            var balloonChargeDescription = self.getChargeDescriptionString( self.model.charge, balloonComparativeChargePatternString );
            var sweaterChargeDescription = self.getChargeDescriptionString( self.globalModel.sweater.charge, sweaterComparativeChargePatternString );

            if ( descriptionElement.textContent !== newDescription ) {
              descriptionElement.textContent = newDescription;
            }

            // build an alert to describe the charge of the balloon and sweater when the user drags the balloon
            // along the sweater and picks up charges.
            var politeDescriptionString = '{0}. {1}';
            var alertString = StringUtils.format( politeDescriptionString, balloonChargeDescription, sweaterChargeDescription );

            // set the text content of the assertive alert element so that the screen reader will anounce the
            // new charge distribution immediately
            var assertiveAlertElement = document.getElementById( 'assertive-alert' );
            assertiveAlertElement.textContent = alertString;

          } );

          model.locationProperty.link( function( currentLocation, oldLocation ) {
            var newDescription = self.getBalloonDescriptionString();
            var assertiveAlertElement = document.getElementById( 'assertive-alert' );


            if ( descriptionElement.textContent !== newDescription ) {
              descriptionElement.textContent = newDescription;
            }

            // only change description when oldLocation is defined and when there is a change in location
            if ( !oldLocation || currentLocation.equals( oldLocation ) ) {
              return;
            }

            var newDirection = self.getDraggingDirection( currentLocation, oldLocation );
            var newBoundingObject = self.model.getBoundaryObject();

            // if the balloon touches a boundary or a new object, that should be the most assertive update
            if ( self.boundingObject !== newBoundingObject ) {
              self.boundingObject = newBoundingObject;

              if ( newBoundingObject ) {
                var touchingObjectAlert = self.getBoundingLocationDescription();

                assertiveAlertElement.textContent = touchingObjectAlert;
                return;
              }
            }

            if ( self.model.direction !== newDirection ) {

              // this is the first movement of this drag interaction, which gets a unique description
              self.model.direction = newDirection;
              var initialGrabDescription = self.getFirstDragDescription();

              // set the text content of the assertive alert element so that the screen reader will anounce the
              // new direction immediately
              assertiveAlertElement.textContent = initialGrabDescription;
            }
            else {

              // for continued movement in the same direction, announce a more succinct description of direction
              // of movement and location
              var continuedMovementDescription = self.getContinuedDragDescription();

              // set the text content of the polite alert element so that the screen reader will anounce the
              // the update when the assertive alert is complete
              var politeElement = document.getElementById( 'polite-alert' );
              politeElement.textContent = continuedMovementDescription;
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
              var releasePositionDescription = self.getLocationDescriptionString();
              var positionString = StringUtils.format( nowStickingToPatternString, releasePositionDescription );

              var sweaterChargeDescription = self.globalModel.sweater.getChargeDescription();
              var balloonChargeDescription = self.getChargeNeutralityDescriptionString();

              // build the description string
              var alertString = StringUtils.format( restingStringPattern, positionString, sweaterChargeDescription, balloonChargeDescription );

              var politeElement = document.getElementById( 'polite-alert' );
              politeElement.textContent = alertString;
            }
          } );

          model.isDraggedProperty.link( function( isDragged ) {
            var assertiveElement = document.getElementById( 'assertive-alert' );
            self.initialGrab = true;

            if ( isDragged ) {
              model.isStoppedProperty.set( false );

              // assemble the descripion of the balloon once it is picked up, perspective 1 from
              // https://docs.google.com/spreadsheets/d/1BiXFN2dRWfsjqV2WvKAXnZFhsk0jCxbnT0gkZr_T5T0/edit?ts=568067c0#gid=1538722405
              var grabbedDescription = self.getGrabbedDescription();

            }
            else {
              var releaseDescription = self.getReleaseDescription();
              console.log( releaseDescription );
              // set the 'aria-grabbed' attribute back to false
              self.domElement.setAttribute( 'aria-grabbed', false );

              assertiveElement.textContent = releaseDescription;
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
        return BalloonDirectionEnum.RIGHT;
      }
      else if ( deltaX < 0 ) {
        return BalloonDirectionEnum.LEFT;
      }
      else if ( deltaY < 0 ) {
        return BalloonDirectionEnum.UP;
      }
      else if ( deltaY > 0 ) {
        return BalloonDirectionEnum.DOWN;
      }
      else {
          assert && assert( 'case not supported in getDraggingDirection' );
      }
    },

    /**
     * Get a description of the balloon once it has been grabbed for dragging
     * The order of the description should be location, charge information, description of closest object
     *
     * @return {type}  description
     */
    getGrabbedDescription: function() {
      var locationDescription = this.getLocationDescriptionString();

      // var balloonChargeDescription = this.getChargeDescriptionString( this.model.charge, balloonComparativeChargePatternString );
      //
      // var sweaterChargeDescription = this.getChargeDescriptionString( this.globalModel.sweater.charge, sweaterComparativeChargePatternString );
      // console.log( balloonChargeDescription );
      // console.log( sweaterChargeDescription );
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
          movementDescriptionString = noChangeInPositionString;
        }
        else if ( this.model.getCenter().x < this.globalModel.playArea.atSweater ) {
          movementDescriptionString = noChangeInPositionString;
        }
        else {
          movementDescriptionString = StringUtils.format( attractedQuicklyStringPattern, velocityDescription, toObjectString );
        }

        descriptionString = balloonReleasedString + ' ' + movementDescriptionString;
      }

      return descriptionString;
    },

    /**
     * Get a description of the balloon after the first movement once it has been picked up.
     * This description should include the balloon label, the direction of movement, and the object the
     * balloon is moving toward.  Subsequent descriptions in this direction will only include the direction
     * of movement.
     *
     * @return {string}
     */
    getFirstDragDescription: function() {
      var directionString;
      var placeString; // string describing object balloon is traveling toward
      if ( this.model.direction === BalloonDirectionEnum.LEFT ) {
        // going left
        directionString = leftString;
        placeString = sweaterString;
      }
      else if ( this.model.direction === BalloonDirectionEnum.RIGHT ) {
        // going right
        directionString = rightString;
        placeString = this.globalModel.wall.isVisible ? wallString : rightOfPlayAreaString;

      }
      else if ( this.model.direction === BalloonDirectionEnum.UP ) {
        // going up
        directionString = upString;
        placeString = topOfPlayAreaString;
      }
      else if ( this.model.direction === BalloonDirectionEnum.DOWN ) {
        // going down
        directionString = downString;
        placeString = bottomOfPlayAreaString;
      }

      // if this is the initial drag, predicate is the accessible label - otherwise 'now'
      var predicate;
      if ( this.initialGrab ) {
        predicate = this.accessibleLabel;
        this.initialGrab = false;
      }
      else {
        predicate = 'Now';
      }
      return StringUtils.format( balloonDirectionPatternString, predicate, directionString, placeString );
    },

    /**
     * Get a succinct description about the direction of movement of the balloon.  This should only be used if
     * the balloon is moving in the same direction
     *
     * @return {string}
     */
    getContinuedDragDescription: function() {
      var newRegion = this.globalModel.playArea.getPointBounds( this.model.getCenter() );

      var description = '';
      if ( newRegion !== this.playAreaRegion ) {
        // in a new region, anounce when we are close, getting there, or almost there

        var atEdgeOfSweater = this.globalModel.playArea.playAreaLeftColumn.containsPoint( this.model.getCenter() );
        var atLeftMovingRight = this.model.getCenter().x < this.globalModel.playArea.atCenter && this.model.direction === BalloonDirectionEnum.RIGHT;
        var atRightMovingLeft = this.model.getCenter().x > this.globalModel.playArea.atCenter && this.model.direction === BalloonDirectionEnum.LEFT;
        var atBottomMovingLeft = this.globalModel.playArea.bottomRow.containsPoint( this.model.getCenter() ) && this.model.direction === BalloonDirectionEnum.UP;
        var atTopMovingDown = this.globalModel.playArea.topRow.containsPoint( this.model.getCenter() ) && this.model.direction === BalloonDirectionEnum.DOWN;

        var rightColumn = this.globalModel.playArea.playAreaRightColumn;
        var leftColumn = this.globalModel.playArea.playAreaLeftColumn;
        var lowerRow = this.globalModel.playArea.lowerRow;
        var upperRow = this.globalModel.playArea.upperRow;
        var centerColumn = this.globalModel.playArea.playAreaCenterColumn;
        var crossingLeft = this.model.direction === BalloonDirectionEnum.LEFT && centerColumn.containsPoint( this.model.getCenter() );
        var crossingRight = this.model.direction === BalloonDirectionEnum.RIGHT && centerColumn.containsPoint( this.model.getCenter() );
        var crossingUp = this.model.direction === BalloonDirectionEnum.UP && upperRow.containsPoint( this.model.getCenter() );
        var crossingDown = this.model.direction === BalloonDirectionEnum.DOWN && lowerRow.containsPoint( this.model.getCenter() );
        var crossingCenter = centerColumn.containsPoint( this.model.getCenter() );

        var almostToWall = this.model.direction === BalloonDirectionEnum.RIGHT && rightColumn.containsPoint( this.model.getCenter() );
        var almostToSweater = this.model.direction === BalloonDirectionEnum.LEFT && leftColumn.containsPoint( this.model.getCenter() );

        if ( atLeftMovingRight || atRightMovingLeft || atBottomMovingLeft || atTopMovingDown ) {

          // if on the right/left/bottom/top) side of the screen and moving to the left/right/top/bottom, notify
          // that the balloon is getting 'closer'
          description = closerString;
        }
        else if ( crossingCenter || crossingUp || crossingDown ) {

          // if crossing through the center of the play area in any direction, announce that the balloo
          // is 'getting there'
          description = gettingThereString;
        }
        else if ( almostToSweater ) {
          description = atEdgeOfSweaterString;
        }
        else if ( almostToWall ) {

          // if moving into the left or right play area columns, announce that the balloon is 'almost there'
          description = nearWallString;
        }
      }
      this.playAreaRegion = newRegion;
      return description;
    },


    /**
     * Get a description for when the balloon hits a bounding object, including the sweater, wall, and
     * bounding edges of the play area
     *
     * @return {string}
     */
    getBoundingLocationDescription: function() {
      var alertDescriptionString;
      if ( this.boundingObject === BalloonLocationEnum.LEFT_EDGE ) {
        alertDescriptionString = atLeftEdgeOfPlayAreaString;
      }
      else if ( this.boundingObject === BalloonLocationEnum.RIGHT_EDGE ) {
        alertDescriptionString = atRightEdgeOfPlayAreaString;
      }
      else if ( this.boundingObject === BalloonLocationEnum.TOP_EDGE ) {
        alertDescriptionString = atTopOfPlayAreaString;
      }
      else if ( this.boundingObject === BalloonLocationEnum.BOTTOM_EDGE ) {
        alertDescriptionString = atBottomOfPlayAreaString;
      }
      else if ( this.boundingObject === BalloonLocationEnum.AT_WALL) {
        alertDescriptionString = atWallString;
      }
      else if ( this.boundingObject === BalloonLocationEnum.AT_SWEATER_EDGE ) {
        alertDescriptionString = atSweaterEdgeString;
      }
      else if ( this.boundingObject === BalloonLocationEnum.ON_SWEATER ) {
        alertDescriptionString = onSweaterString;
      }
      else {
        assert && assert( false, 'Unrecognized bounding object in getBoundingLocationDescription.' );
      }

      return alertDescriptionString;
    },

    /**
     * Get a description of the relative neutrality of the balloon's charge
     * @return {string}
     */
    getChargeNeutralityDescriptionString: function() {
      if ( this.model.charge < 0 ) {
        return StringUtils.format( balloonNetChargePatternString, netNegativeString );
      }
      else {
        return StringUtils.format( balloonNetChargePatternString, netNeutralString );
      }
    },

    /**
     * Get a description of the object charge.
     *
     * @return {type}  description
     */
    getChargeDescriptionString: function( charge, stringPattern ) {
      var chargeDescriptionString = '';
      // no more, a few more, several more, many more
      // there are a total of 57 charges, so the three charge levels should split this up evenly
      // the map is split by 19.

      // switch case by abs value of charge for clarity
      var absCharge = Math.abs( charge );

      // max charges the balloon can hold - split by four so that each of the four
      // categories of qualitative descriptions are provided.
      var maxCharge = 57;
      if ( absCharge === 0 ) {
        chargeDescriptionString = noMoreString;
      }
      else if ( absCharge <= maxCharge / 3 ) {
        chargeDescriptionString = aFewMoreString;
      }
      else if ( absCharge <= 2 * maxCharge / 3 ) {
        chargeDescriptionString = severalMoreString;
      }
      else if ( absCharge <= maxCharge ) {
        chargeDescriptionString = manyMoreString;
      }
      else {
        assert && assert( false, 'Trying to create description for unsuported number of charges' );
      }
      return StringUtils.format( stringPattern, chargeDescriptionString );
    },

    /**
     * Get an up to date description of the dragable balloon widget.  This includes a description about the location,
     * charge, and a cue to use the 'grab balloon' button.
     *
     * @return {string}
     */
    getBalloonDescriptionString: function() {
      var locationDescription = this.getLocationDescriptionString();
      var chargeDescription = this.getChargeNeutralityDescriptionString();
      var buttonCueString  = 'Use the Grab Balloon Button to pick up balloon for dragging';

      var balloonDescriptionPatternString = 'Balloon is at {0} {1}. {2}.';

      return StringUtils.format( balloonDescriptionPatternString, locationDescription, chargeDescription, buttonCueString );
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
