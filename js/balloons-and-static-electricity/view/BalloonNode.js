// Copyright 2013-2020, University of Colorado Boulder

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

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import GrabDragInteraction from '../../../../scenery-phet/js/accessibility/GrabDragInteraction.js';
import MovableDragHandler from '../../../../scenery-phet/js/input/MovableDragHandler.js';
import FocusHighlightFromNode from '../../../../scenery/js/accessibility/FocusHighlightFromNode.js';
import KeyboardUtils from '../../../../scenery/js/accessibility/KeyboardUtils.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import BASEQueryParameters from '../BASEQueryParameters.js';
import BalloonDirectionEnum from '../model/BalloonDirectionEnum.js';
import PlayAreaMap from '../model/PlayAreaMap.js';
import BalloonInteractionCueNode from './BalloonInteractionCueNode.js';
import BalloonDescriber from './describers/BalloonDescriber.js';
import MinusChargeNode from './MinusChargeNode.js';
import PlusChargeNode from './PlusChargeNode.js';

// pdom - critical x positions for the balloon
const X_POSITIONS = PlayAreaMap.X_POSITIONS;

const grabBalloonKeyboardHelpString = BASEA11yStrings.grabBalloonKeyboardHelp.value;

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

  options = merge( {
    cursor: 'pointer',

    // pdom - this node will act as a container for more accessible content, its children will implement
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

  // pdom - a type that generates descriptions for the balloon
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
    set: function( position ) { model.positionProperty.set( globalModel.checkBalloonRestrictions( position, model.width, model.height ) ); },

    //Get the position of the model
    get: function() { return model.positionProperty.get(); }
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

    // When dragging across it in a mobile device, pick it up
    // Temporarily disabled for vibration prototypes, see #449
    allowTouchSnag: phet.chipper.queryParameters.vibration === null,
    startDrag: function() {
      model.draggingWithPointer = true;
      if ( !model.isDraggedProperty.get() ) {
        model.isDraggedProperty.set( true );
      }
    },
    endDrag: function() {
      endDragListener();
      model.draggingWithPointer = false;
    },
    tandem: tandem.createTandem( 'dragHandler' )
  } );

  this.addInputListener( dragHandler );

  const balloonImageNode = new Image( imgsrc, {
    tandem: tandem.createTandem( 'balloonImageNode' )
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
      model.plusCharges[ i ].position,
      plusChargeNodesTandemGroup.createNextTandem()
    );
    originalChargesNode.addChild( plusChargeNode );

    const minusChargeNode = new MinusChargeNode(
      model.minusCharges[ i ].position,
      minusChargeNodesTandemGroup.createNextTandem()
    );
    originalChargesNode.addChild( minusChargeNode );
  }

  //possible charges
  const addedNodes = []; // track in a local array to update visibility with charge
  const addedChargeNodesTandemGroup = tandem.createGroupTandem( 'addedChargeNodes' );
  for ( i = model.plusCharges.length; i < model.minusCharges.length; i++ ) {
    const addedMinusChargeNode = new MinusChargeNode(
      model.minusCharges[ i ].position,
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
  model.positionProperty.link( function updatePosition( position ) {
    self.translation = position;
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

  // pdom
  balloonImageNode.focusHighlight = new FocusHighlightFromNode( balloonImageNode );

  // pdom - when the balloon charge, position, or model.showChargesProperty changes, the balloon needs a new
  // description for assistive technology
  const updateAccessibleDescription = function() {
    self.descriptionContent = self.describer.getBalloonDescription( model );
  };
  model.positionProperty.link( updateAccessibleDescription );
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
    positionProperty: model.positionProperty,
    shiftKeyMultiplier: 0.25,
    start: function( event ) {

      // if already touching a boundary when dragging starts, announce an indication of this
      if ( self.attemptToMoveBeyondBoundary( event.domEvent.keyCode ) ) {
        const attemptedDirection = self.getAttemptedMovementDirection( event.domEvent.keyCode );
        boundaryUtterance.alert = self.describer.movementDescriber.getTouchingBoundaryDescription( attemptedDirection );
        phet.joist.sim.utteranceQueue.addToBack( boundaryUtterance );
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

    keyboardHelpText: grabBalloonKeyboardHelpString,

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
      return !model.positionProperty.get().equals( model.positionProperty.initialValue );
    },

    listenersForDrag: [ this.keyboardDragHandler ],

    tandem: tandem.createTandem( 'grabDragInteraction' )
  } );

  // jump to the wall on 'J + W'
  this.keyboardDragHandler.addHotkeys( [
    {
      keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_W ],
      callback: function() {
        self.jumpBalloon( new Vector2( X_POSITIONS.AT_WALL, model.getCenterY() ) );
      }
    },
    {
      keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_S ],
      callback: function() {
        self.jumpBalloon( new Vector2( X_POSITIONS.AT_NEAR_SWEATER, model.getCenterY() ) );
      }
    },
    {
      keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_N ],
      callback: function() {
        self.jumpBalloon( new Vector2( X_POSITIONS.AT_NEAR_WALL, model.getCenterY() ) );
      }
    },
    {
      keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_C ],
      callback: function() {
        self.jumpBalloon( new Vector2( X_POSITIONS.AT_CENTER_PLAY_AREA, model.getCenterY() ) );
      }
    }
  ] );

  // update the drag bounds when wall visibility changes
  globalModel.wall.isVisibleProperty.link( function( isVisible ) {
    self.keyboardDragHandler._dragBounds = self.getDragBounds();
  } );

  model.resetEmitter.addListener( function() {

    // if reset, release the balloon from dragging
    dragHandler.interrupt();

    grabDragInteraction.interrupt();

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

inherit( Node, BalloonNode, {

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
   * Jump the balloon to a new position, first muting the utteranceQueue, then updating position,
   * then clearing the queue and enabling it once more.  Finally, we will add a custom utterance
   * to the queue describing the jump interaction.
   *
   * @param  {Vector2} center - new center position for the balloon
   */
  jumpBalloon: function( center ) {
    this.model.jumping = true;

    // release balloon so that the jump is not associated with velocity
    this.model.setCenter( center );

    // clear the queue of utterances that collected as position changed
    phet.joist.sim.utteranceQueue.clear();

    // Send a custom alert, depending on where the balloon was moved to
    this.jumpingUtterance.alert = this.describer.movementDescriber.getJumpingDescription( center );
    phet.joist.sim.utteranceQueue.addToBack( this.jumpingUtterance );

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

export default BalloonNode;