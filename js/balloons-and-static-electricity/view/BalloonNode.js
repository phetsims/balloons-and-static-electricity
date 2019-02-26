// Copyright 2013-2019, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the Balloon of the model.
 *
 * Accessible content for BalloonNode acts as a container for the button and application div, which are provided by
 * children of this node.  Beware that changing the scene graph under this node will change the structure of the
 * accessible content.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var BalloonDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BalloonDescriber' );
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var BalloonInteractionCueNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonInteractionCueNode' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEQueryParameters' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var FocusHighlightFromNode = require( 'SCENERY/accessibility/FocusHighlightFromNode' );
  var GrabDragInteraction = require( 'SCENERY_PHET/accessibility/GrabDragInteraction' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardDragListener = require( 'SCENERY/listeners/KeyboardDragListener' );
  var KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  var Line = require( 'SCENERY/nodes/Line' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  var Vector2 = require( 'DOT/Vector2' );

  // a11y - critical x locations for the balloon
  var X_LOCATIONS = PlayAreaMap.X_LOCATIONS;

  // a11y strings
  var grabBalloonHelpString = BASEA11yStrings.grabBalloonHelp.value;

  /**
   * Constructor for the balloon
   *
   * @param  {number} x
   * @param  {number} y
   * @param  {BalloonModel} model
   * @param  {Image} imgsrc - image source from the image plugin
   * @param  {BASEModel} globalModel
   * @param {string} accessibleLabelString - the accessible label for this balloon
   * @param {string} otherAccessibleLabelString - the accessible label for the "other" balloon
   * @param {Bounds2} layoutBounds - layout bounds of the ScreenView containing this node
   * @param  {Tandem} tandem
   * @constructor
   */
  function BalloonNode( model, imgsrc, globalModel, accessibleLabelString, otherAccessibleLabelString, layoutBounds, tandem, options ) {
    var self = this;

    options = _.extend( {
      cursor: 'pointer',

      // a11y - this node will act as a container for more accessible content, its children will implement
      // most of the keyboard navigation
      containerTagName: 'div',
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: accessibleLabelString
    }, options );

    assert && assert( !options.tandem, 'required param' );
    options.tandem = tandem;

    // super constructor
    Node.call( this, options );

    // @private
    this.model = model;
    this.globalModel = globalModel;

    // a11y - a type that generates descriptions for the balloon 
    this.describer = new BalloonDescriber( globalModel, globalModel.wall, model, accessibleLabelString, otherAccessibleLabelString );

    var originalChargesNode = new Node( {
      pickable: false,
      tandem: tandem.createTandem( 'originalChargesNode' )
    } );
    var addedChargesNode = new Node( { pickable: false, tandem: tandem.createTandem( 'addedChargesNode' ) } );

    var property = {

      //Set only to the legal positions in the frame
      set: function( location ) { model.locationProperty.set( globalModel.checkBalloonRestrictions( location, model.width, model.height ) ); },

      //Get the location of the model
      get: function() { return model.locationProperty.get(); }
    };

    /**
     * Finish a drag interaction by updating the Property tracking that the balloon is dragged and resetting
     * velocities.
     */
    var endDragListener = function() {
      model.isDraggedProperty.set( false );
      model.velocityProperty.set( new Vector2( 0, 0 ) );
      model.dragVelocityProperty.set( new Vector2( 0, 0 ) );
    };

    //When dragging, move the balloon
    var dragHandler = new MovableDragHandler( property, {

      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      onDrag: function() {

        // make sure the balloon is dragged - when this node is blurred, isDraggedProperty is set to false and this
        // happens after MovableDragHandler.startDrag
        if ( !model.isDraggedProperty.get() ) {
          model.isDraggedProperty.set( true );
        }
      },
      endDrag: function() {
        endDragListener();
      },
      tandem: tandem.createTandem( 'dragHandler' )
    } );

    this.addInputListener( dragHandler );

    var balloonImageNode = new Image( imgsrc, {
      tandem: tandem.createTandem( 'balloonImageNode' ),
      pickable: false // custom touch areas applied to parent
    } );

    // now add the balloon, so that the tether is behind it in the z order
    this.addChild( balloonImageNode );

    // custom elliptical touch/mouse areas so the balloon is easier to grab when under the other balloon
    this.mouseArea = Shape.ellipse( balloonImageNode.centerX, balloonImageNode.centerY, balloonImageNode.width / 2, balloonImageNode.height / 2, 0 );
    this.touchArea = this.mouseArea;

    // static charges
    var plusChargeNodesTandemGroup = tandem.createGroupTandem( 'plusChargeNodes' );
    var minusChargeNodesTandemGroup = tandem.createGroupTandem( 'minusChargeNodes' );
    for ( var i = 0; i < model.plusCharges.length; i++ ) {
      var plusChargeNode = new PlusChargeNode(
        model.plusCharges[ i ].location,
        plusChargeNodesTandemGroup.createNextTandem()
      );
      originalChargesNode.addChild( plusChargeNode );

      var minusChargeNode = new MinusChargeNode(
        model.minusCharges[ i ].location,
        minusChargeNodesTandemGroup.createNextTandem()
      );
      originalChargesNode.addChild( minusChargeNode );
    }

    //possible charges
    var addedNodes = []; // track in a local array to update visibility with charge
    var addedChargeNodesTandemGroup = tandem.createGroupTandem( 'addedChargeNodes' );
    for ( i = model.plusCharges.length; i < model.minusCharges.length; i++ ) {
      var addedMinusChargeNode = new MinusChargeNode(
        model.minusCharges[ i ].location,
        addedChargeNodesTandemGroup.createNextTandem()
      );
      addedMinusChargeNode.visible = false;
      addedChargesNode.addChild( addedMinusChargeNode );

      addedNodes.push( addedMinusChargeNode );
    }
    this.addChild( originalChargesNode );
    this.addChild( addedChargesNode );

    //if change charge, show more minus charges
    model.chargeProperty.link( function updateCharge( chargeVal ) {
      var numVisibleMinusCharges = Math.abs( chargeVal );

      for ( var i = 0; i < addedNodes.length; i++ ) {
        addedNodes[ i ].visible = i < numVisibleMinusCharges;
      }
    } );

    // link the position of this node to the model
    model.locationProperty.link( function updateLocation( location, oldLocation ) {
      self.translation = location;
    } );

    //show charges based on showCharges property
    globalModel.showChargesProperty.link( function updateChargesVisibilityOnBalloon( value ) {
      if ( value === 'diff' ) {
        originalChargesNode.visible = false;
        addedChargesNode.visible = true;
      }
      else {
        var visiblity = ( value === 'all' );
        originalChargesNode.visible = visiblity;
        addedChargesNode.visible = visiblity;
      }
    } );

    // a11y
    balloonImageNode.focusHighlight = new FocusHighlightFromNode( balloonImageNode );

    // a11y - when the balloon charge, location, or model.showChargesProperty changes, the balloon needs a new
    // description for assistive technology
    var updateAccessibleDescription = function() {
      self.descriptionContent = self.describer.getBalloonDescription( model );
    };
    model.locationProperty.link( updateAccessibleDescription );
    model.chargeProperty.link( updateAccessibleDescription );
    model.isDraggedProperty.link( updateAccessibleDescription );
    globalModel.showChargesProperty.link( updateAccessibleDescription );

    // @private - the drag handler needs to be updated in a step function, see KeyboardDragHandler for more
    // information
    this.keyboardDragHandler = new KeyboardDragListener( {
      downDelta: 0,
      shiftDownDelta: 0,
      dragVelocity: 300, // in view coordinates per second
      shiftDragVelocity: 100, // in view coordinates per second
      dragBounds: this.getDragBounds(),
      locationProperty: model.locationProperty,
      shiftKeyMultiplier: 0.25,
      start: function( event ) {

        // if already touching a boundary when dragging starts, announce an indication of this
        if ( self.attemptToMoveBeyondBoundary( event.domEvent.keyCode ) ) {
          var attemptedDirection = self.getAttemptedMovementDirection( event.domEvent.keyCode );
          utteranceQueue.addToBack( new Utterance( {
            alert: self.describer.movementDescriber.getTouchingBoundaryDescription( attemptedDirection ),
            uniqueGroupId: 'boundaryAlert'
          } ) );
        }
      }
    } );

    // made visible when the balloon is picked up with a keyboard for the first time to show how a user can drag with
    // a keyboard
    var interactionCueNode = new BalloonInteractionCueNode( globalModel, model, this, layoutBounds );
    interactionCueNode.center = balloonImageNode.center;

    // attach the GrabDragInteraction to the image node, which is a child of this node so that the accessible
    // content for the interaction is underneath this node
    var grabDragInteraction = new GrabDragInteraction( balloonImageNode, {
      objectToGrabString: accessibleLabelString,
      dragCueNode: interactionCueNode,

      grabCueOptions: {
        centerTop: balloonImageNode.centerBottom.plusXY( 0, 10 )
      },
      
      grabbableOptions: {
        descriptionContent: grabBalloonHelpString,
        appendDescription: true
      },

      onGrab: function() {
        model.isDraggedProperty.set( true );
      },

      onRelease: function() {
        endDragListener();

        // reset the key state of the drag handler by interrupting the drag
        self.keyboardDragHandler.interrupt();
      },

      // hides the interactionCueNode cue if this returns true
      successfulDrag: function() {
        return !model.locationProperty.get().equals( model.locationProperty.initialValue );
      },

      listenersForDrag: [ this.keyboardDragHandler ]
    } );

    // jump to the wall on 'J + W'
    this.keyboardDragHandler.addHotkeyGroups( [
      {
        keys: [ KeyboardUtil.KEY_J, KeyboardUtil.KEY_W ],
        callback: function() {
          self.jumpBalloon( new Vector2( X_LOCATIONS.AT_WALL, model.getCenterY() ) );
        }
      },
      {
        keys: [ KeyboardUtil.KEY_J, KeyboardUtil.KEY_S ],
        callback: function() {
          self.jumpBalloon( new Vector2( X_LOCATIONS.AT_NEAR_SWEATER, model.getCenterY() ) );
        }
      },
      {
        keys: [ KeyboardUtil.KEY_J, KeyboardUtil.KEY_N ],
        callback: function() {
          self.jumpBalloon( new Vector2( X_LOCATIONS.AT_NEAR_WALL, model.getCenterY() ) );
        }
      },
      {
        keys: [ KeyboardUtil.KEY_J, KeyboardUtil.KEY_C ],
        callback: function() {
          self.jumpBalloon( new Vector2( X_LOCATIONS.AT_CENTER_PLAY_AREA, model.getCenterY() ) );
        }
      }
    ] );

    // update the drag bounds when wall visibility changes
    globalModel.wall.isVisibleProperty.link( function( isVisible ) {
      self.keyboardDragHandler._dragBounds = self.getDragBounds();
    } );

    model.resetEmitter.addListener( function() {
      self.describer.reset();
      grabDragInteraction.reset();
    } );

    if ( BASEQueryParameters.showBalloonChargeCenter ) {
      var parentToLocalChargeCenter = this.parentToLocalPoint( model.getChargeCenter() );
      this.addChild( new Rectangle( 0, 0, 5, 5, { fill: 'green', center: parentToLocalChargeCenter } ) );
      this.addChild( new Line( -500, parentToLocalChargeCenter.y, 500, parentToLocalChargeCenter.y, { stroke: 'green' } ) );
    }
  }

  balloonsAndStaticElectricity.register( 'BalloonNode', BalloonNode );

  return inherit( Node, BalloonNode, {

    /**
     * Step the describer, which uses polling to determine the next alerts describing interactions with the balloon.
     *
     * @public
     * @param  {number} dt
     */
    step: function( dt ) {
      this.describer.step( dt );
    },

    /**
     * Jump the balloon to a new location, first muting the utteranceQueue, then updating position,
     * then clearing the queue and enabling it once more.  Finally, we will add a custom utterance
     * to the queue describing the jump interaction.
     *
     * @param  {Vector2} center - new center location for the balloon
     */
    jumpBalloon: function( center ) {
      this.model.jumping = true;

      // release balloon so that the jump is not associated with velocity
      this.model.setCenter( center );

      // clear the queue of utterances that collected as position changed
      utteranceQueue.clear();

      // Send a custom alert, depending on where the balloon was moved to
      var utterance = new Utterance( {
        alert: this.describer.movementDescriber.getJumpingDescription( center ),
        uniqueGroupId: 'jumpingDescription' // prevent a spam of these jumping alerts
      } );
      utteranceQueue.addToBack( utterance );

      // reset forces in tracked values in describer that determine description for induced charge change
      this.describer.chargeDescriber.resetReferenceForces();
    },

    /**
     * Determine if the user attempted to move beyond the play area bounds with the keyboard.
     * @returns {[type]} [description]
     */
    attemptToMoveBeyondBoundary: function( keyCode ) {
      return (
        ( KeyboardDragListener.isLeftMovementKey( keyCode ) && this.model.isTouchingLeftBoundary() ) ||
        ( KeyboardDragListener.isUpMovementKey( keyCode ) && this.model.isTouchingTopBoundary() ) ||
        ( KeyboardDragListener.isRightMovementKey( keyCode ) && this.model.isTouchingRightBoundary() ) ||
        ( KeyboardDragListener.isDownMovementKey( keyCode ) && this.model.isTouchingBottomBoundary() )
      );
    },

    getAttemptedMovementDirection: function( keyCode ) {
      var direction;
      if ( KeyboardDragListener.isLeftMovementKey( keyCode ) ) {
        direction = BalloonDirectionEnum.LEFT;
      }
      else if ( KeyboardDragListener.isRightMovementKey( keyCode ) ) {
        direction = BalloonDirectionEnum.RIGHT;
      }
      else if ( KeyboardDragListener.isUpMovementKey( keyCode ) ) {
        direction = BalloonDirectionEnum.UP;
      }
      else if ( KeyboardDragListener.isDownMovementKey( keyCode ) ) {
        direction = BalloonDirectionEnum.DOWN;
      }

      assert && assert( direction );
      return direction;
    },

    getDragBounds: function() {
      var modelBounds = this.globalModel.playAreaBounds;
      var balloonWidth = this.model.width;
      var balloonHeight = this.model.height;
      return new Bounds2( modelBounds.minX, modelBounds.minY, modelBounds.maxX - balloonWidth, modelBounds.maxY - balloonHeight );
    }
  } );
} );
