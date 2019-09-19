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
define( require => {
  'use strict';

  // modules
  const BalloonDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BalloonDescriber' );
  const BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  const BalloonInteractionCueNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonInteractionCueNode' );
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  const BASEQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEQueryParameters' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const FocusHighlightFromNode = require( 'SCENERY/accessibility/FocusHighlightFromNode' );
  const GrabDragInteraction = require( 'SCENERY_PHET/accessibility/GrabDragInteraction' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const KeyboardDragListener = require( 'SCENERY/listeners/KeyboardDragListener' );
  const KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  const Line = require( 'SCENERY/nodes/Line' );
  const MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  const PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  const Vector2 = require( 'DOT/Vector2' );

  // a11y - critical x locations for the balloon
  const X_LOCATIONS = PlayAreaMap.X_LOCATIONS;

  // a11y strings
  const grabBalloonHelpString = BASEA11yStrings.grabBalloonHelp.value;

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
    const self = this;

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

    // @private - the utterance to be sent to the utteranceQueue when a jumping action occurs
    this.jumpingUtterance = new Utterance();

    const originalChargesNode = new Node( {
      pickable: false,
      tandem: tandem.createTandem( 'originalChargesNode' )
    } );
    const addedChargesNode = new Node( { pickable: false, tandem: tandem.createTandem( 'addedChargesNode' ) } );

    const property = {

      //Set only to the legal positions in the frame
      set: function( location ) { model.locationProperty.set( globalModel.checkBalloonRestrictions( location, model.width, model.height ) ); },

      //Get the location of the model
      get: function() { return model.locationProperty.get(); }
    };

    /**
     * Finish a drag interaction by updating the Property tracking that the balloon is dragged and resetting
     * velocities.
     */
    const endDragListener = function() {
      model.isDraggedProperty.set( false );
      model.velocityProperty.set( new Vector2( 0, 0 ) );
      model.dragVelocityProperty.set( new Vector2( 0, 0 ) );
    };

    //When dragging, move the balloon
    const dragHandler = new MovableDragHandler( property, {

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

    const balloonImageNode = new Image( imgsrc, {
      tandem: tandem.createTandem( 'balloonImageNode' ),
      pickable: false // custom touch areas applied to parent
    } );

    // now add the balloon, so that the tether is behind it in the z order
    this.addChild( balloonImageNode );

    // custom elliptical touch/mouse areas so the balloon is easier to grab when under the other balloon
    this.mouseArea = Shape.ellipse( balloonImageNode.centerX, balloonImageNode.centerY, balloonImageNode.width / 2, balloonImageNode.height / 2, 0 );
    this.touchArea = this.mouseArea;

    // static charges
    const plusChargeNodesTandemGroup = tandem.createGroupTandem( 'plusChargeNodes' );
    const minusChargeNodesTandemGroup = tandem.createGroupTandem( 'minusChargeNodes' );
    for ( var i = 0; i < model.plusCharges.length; i++ ) {
      const plusChargeNode = new PlusChargeNode(
        model.plusCharges[ i ].location,
        plusChargeNodesTandemGroup.createNextTandem()
      );
      originalChargesNode.addChild( plusChargeNode );

      const minusChargeNode = new MinusChargeNode(
        model.minusCharges[ i ].location,
        minusChargeNodesTandemGroup.createNextTandem()
      );
      originalChargesNode.addChild( minusChargeNode );
    }

    //possible charges
    const addedNodes = []; // track in a local array to update visibility with charge
    const addedChargeNodesTandemGroup = tandem.createGroupTandem( 'addedChargeNodes' );
    for ( i = model.plusCharges.length; i < model.minusCharges.length; i++ ) {
      const addedMinusChargeNode = new MinusChargeNode(
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
      const numVisibleMinusCharges = Math.abs( chargeVal );

      for ( let i = 0; i < addedNodes.length; i++ ) {
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
        const visiblity = ( value === 'all' );
        originalChargesNode.visible = visiblity;
        addedChargesNode.visible = visiblity;
      }
    } );

    // a11y
    balloonImageNode.focusHighlight = new FocusHighlightFromNode( balloonImageNode );

    // a11y - when the balloon charge, location, or model.showChargesProperty changes, the balloon needs a new
    // description for assistive technology
    const updateAccessibleDescription = function() {
      self.descriptionContent = self.describer.getBalloonDescription( model );
    };
    model.locationProperty.link( updateAccessibleDescription );
    model.chargeProperty.link( updateAccessibleDescription );
    model.isDraggedProperty.link( updateAccessibleDescription );
    globalModel.showChargesProperty.link( updateAccessibleDescription );

    // @private - the drag handler needs to be updated in a step function, see KeyboardDragHandler for more
    // information
    const boundaryUtterance = new Utterance();
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
          const attemptedDirection = self.getAttemptedMovementDirection( event.domEvent.keyCode );  
          boundaryUtterance.alert = self.describer.movementDescriber.getTouchingBoundaryDescription( attemptedDirection );
          utteranceQueue.addToBack( boundaryUtterance );
        }
      }
    } );

    // made visible when the balloon is picked up with a keyboard for the first time to show how a user can drag with
    // a keyboard
    const interactionCueNode = new BalloonInteractionCueNode( globalModel, model, this, layoutBounds );
    interactionCueNode.center = balloonImageNode.center;

    // attach the GrabDragInteraction to the image node, which is a child of this node so that the accessible
    // content for the interaction is underneath this node
    const grabDragInteraction = new GrabDragInteraction( balloonImageNode, {
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
      const parentToLocalChargeCenter = this.parentToLocalPoint( model.getChargeCenter() );
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
      this.jumpingUtterance.alert = this.describer.movementDescriber.getJumpingDescription( center );
      utteranceQueue.addToBack( this.jumpingUtterance );

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
      let direction;
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
      const modelBounds = this.globalModel.playAreaBounds;
      const balloonWidth = this.model.width;
      const balloonHeight = this.model.height;
      return new Bounds2( modelBounds.minX, modelBounds.minY, modelBounds.maxX - balloonWidth, modelBounds.maxY - balloonHeight );
    }
  } );
} );
