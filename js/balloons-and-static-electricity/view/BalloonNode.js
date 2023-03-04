// Copyright 2013-2023, University of Colorado Boulder

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

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import GrabDragInteraction from '../../../../scenery-phet/js/accessibility/GrabDragInteraction.js';
import { DragListener, FocusHighlightFromNode, Image, InteractiveHighlighting, KeyboardDragListener, KeyboardUtils, Line, Node, Path, Rectangle } from '../../../../scenery/js/imports.js';
import boundaryReachedSoundPlayer from '../../../../tambo/js/shared-sound-players/boundaryReachedSoundPlayer.js';
import PitchedPopGenerator from '../../../../tambo/js/sound-generators/PitchedPopGenerator.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import balloonGrab006_mp3 from '../../../sounds/balloonGrab006_mp3.js';
import balloonHitSweater_mp3 from '../../../sounds/balloonHitSweater_mp3.js';
import balloonRelease006_mp3 from '../../../sounds/balloonRelease006_mp3.js';
import wallContact_mp3 from '../../../sounds/wallContact_mp3.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import BASEConstants from '../BASEConstants.js';
import BASEQueryParameters from '../BASEQueryParameters.js';
import BalloonDirectionEnum from '../model/BalloonDirectionEnum.js';
import PlayAreaMap from '../model/PlayAreaMap.js';
import BalloonInteractionCueNode from './BalloonInteractionCueNode.js';
import BalloonRubbingSoundGenerator from './BalloonRubbingSoundGenerator.js';
import BalloonVelocitySoundGenerator from './BalloonVelocitySoundGenerator.js';
import BalloonDescriber from './describers/BalloonDescriber.js';
import MinusChargeNode from './MinusChargeNode.js';
import PlusChargeNode from './PlusChargeNode.js';

// pdom - critical x positions for the balloon
const X_POSITIONS = PlayAreaMap.X_POSITIONS;

// constants
const grabBalloonKeyboardHelpString = BASEA11yStrings.grabBalloonKeyboardHelp.value;
const GRAB_RELEASE_SOUND_LEVEL = 0.1; // empirically determined

class BalloonNode extends Node {

  /**
   * @mixes InteractiveHighlighting
   * @param {BalloonModel} model
   * @param {Image} imageSource - image source from the image plugin
   * @param {BASEModel} globalModel
   * @param {string} accessibleLabelString - the accessible label for this balloon
   * @param {string} otherAccessibleLabelString - the accessible label for the "other" balloon
   * @param {Bounds2} layoutBounds - layout bounds of the ScreenView containing this node
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model,
               imageSource,
               globalModel,
               accessibleLabelString,
               otherAccessibleLabelString,
               layoutBounds,
               tandem,
               options ) {

    options = merge( {
      cursor: 'pointer',

      // {Object} - options passed to the drift velocity sound generator
      balloonVelocitySoundGeneratorOptions: {
        enableControlProperties: [ model.isVisibleProperty ]
      },

      // {Object} - options passed to the balloon rubbing sound generator
      balloonRubbingSoundGeneratorOptions: {},

      // {function} - additional method to call at end of pointer drag
      pointerDrag: _.noop,

      // {function} - additional method to call at end of keyboard drag
      keyboardDrag: _.noop,

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
    super( options );

    // @private
    this.model = model;
    this.globalModel = globalModel;

    // pdom - a type that generates descriptions for the balloon
    this.describer = new BalloonDescriber( globalModel, globalModel.wall, model, accessibleLabelString, otherAccessibleLabelString, this );

    // @private - the utterance to be sent to the utteranceQueue when a jumping action occurs
    this.jumpingUtterance = new Utterance();

    const originalChargesNode = new Node( {
      pickable: false,
      tandem: tandem.createTandem( 'originalChargesNode' )
    } );
    const addedChargesNode = new Node( { pickable: false, tandem: tandem.createTandem( 'addedChargesNode' ) } );

    // Finish a drag interaction by updating the Property tracking that the balloon is dragged and resetting velocities.
    const endDragListener = () => {
      model.isDraggedProperty.set( false );
      model.velocityProperty.set( new Vector2( 0, 0 ) );
      model.dragVelocityProperty.set( new Vector2( 0, 0 ) );
      releaseBalloonSoundPlayer.play();
    };

    // Set up the bounds Property that will keep track of where the balloon can be dragged.
    const boundsWithoutWall = new Bounds2( 0, 0, globalModel.width - model.width, globalModel.height - model.height );
    const boundsWithWall = new Bounds2(
      0,
      0,
      globalModel.width - globalModel.wallWidth - model.width,
      globalModel.height - model.height
    );
    const balloonDragBoundsProperty = new Property( boundsWithWall );
    globalModel.wall.isVisibleProperty.link( isWallVisible => {
      balloonDragBoundsProperty.set( isWallVisible ? boundsWithWall : boundsWithoutWall );
    } );

    // Create the sound generators for grab and release of the balloons.
    const grabBalloonSoundPlayer = new SoundClip( balloonGrab006_mp3, {
      initialOutputLevel: GRAB_RELEASE_SOUND_LEVEL
    } );
    soundManager.addSoundGenerator( grabBalloonSoundPlayer );
    const releaseBalloonSoundPlayer = new SoundClip( balloonRelease006_mp3, {
      initialOutputLevel: GRAB_RELEASE_SOUND_LEVEL
    } );
    soundManager.addSoundGenerator( releaseBalloonSoundPlayer );

    // drag handling
    const dragHandler = new DragListener( {

      positionProperty: model.positionProperty,
      dragBoundsProperty: balloonDragBoundsProperty,
      allowTouchSnag: true,
      start: () => {
        model.draggingWithPointer = true;
        model.isDraggedProperty.set( true );
        grabBalloonSoundPlayer.play();
      },
      drag: options.pointerDrag,
      end: () => {
        endDragListener();
        model.draggingWithPointer = false;
      },
      tandem: tandem.createTandem( 'dragListener' )
    } );
    this.addInputListener( dragHandler );

    const balloonImageNode = new Image( imageSource, {
      tandem: tandem.createTandem( 'balloonImageNode' ),

      // the balloonImageNode is not pickable so that mouse and touch areas which are smaller than the bounds
      // of the image can be used by setting them on the parent of the image
      pickable: false
    } );

    // now add the balloon, so that the tether is behind it in the z order
    this.addChild( balloonImageNode );

    // Create a custom touch/mouse area that matches the shape of the balloons reasonably well.  This was created to
    // match the artwork as it is at the time of this writing, and if the artwork changes, this may need to change too.
    const mainBodyEllipse = Shape.ellipse(
      balloonImageNode.centerX,
      balloonImageNode.centerY * 0.91,
      balloonImageNode.width * 0.51,
      balloonImageNode.height * 0.465,
      0
    );
    const nubRect = Shape.rectangle(
      balloonImageNode.centerX - balloonImageNode.width * 0.05,
      balloonImageNode.height * 0.9,
      balloonImageNode.width * 0.1,
      balloonImageNode.height * 0.1
    );
    const pointerAreaShape = Shape.union( [ mainBodyEllipse, nubRect ] );
    this.mouseArea = pointerAreaShape;
    this.touchArea = pointerAreaShape;

    // static charges
    for ( let i = 0; i < model.plusCharges.length; i++ ) {
      originalChargesNode.addChild( new PlusChargeNode( model.plusCharges[ i ].position ) );
      originalChargesNode.addChild( new MinusChargeNode( model.minusCharges[ i ].position ) );
    }

    // possible charges
    const addedNodes = []; // track in a local array to update visibility with charge
    for ( let i = model.plusCharges.length; i < model.minusCharges.length; i++ ) {
      const addedMinusChargeNode = new MinusChargeNode( model.minusCharges[ i ].position );
      addedMinusChargeNode.visible = false;
      addedChargesNode.addChild( addedMinusChargeNode );

      addedNodes.push( addedMinusChargeNode );
    }
    this.addChild( originalChargesNode );
    this.addChild( addedChargesNode );

    // if change charge, show more minus charges
    model.chargeProperty.link( chargeVal => {
      const numVisibleMinusCharges = Math.abs( chargeVal );

      for ( let i = 0; i < addedNodes.length; i++ ) {
        addedNodes[ i ].visible = i < numVisibleMinusCharges;
      }
    } );

    // link the position of this node to the model
    model.positionProperty.link( position => {
      this.translation = position;
    } );

    // show charges based on showCharges property
    globalModel.showChargesProperty.link( value => {
      if ( value === 'diff' ) {
        originalChargesNode.visible = false;
        addedChargesNode.visible = true;
      }
      else {
        const visibility = ( value === 'all' );
        originalChargesNode.visible = visibility;
        addedChargesNode.visible = visibility;
      }
    } );

    // {Property.<boolean> - a value that reflects whether charges are being shown on the balloon
    const chargesShownOnBalloonProperty = new DerivedProperty(
      [ globalModel.showChargesProperty ],
      showCharges => showCharges !== 'none'
    );

    // sound generation for charges moving on to this balloon
    const popSoundGenerator = new PitchedPopGenerator( {
      enableControlProperties: [ chargesShownOnBalloonProperty ],
      initialOutputLevel: 0.3
    } );
    soundManager.addSoundGenerator( popSoundGenerator );
    model.chargeProperty.lazyLink( charge => {
      const chargeAbsoluteValue = Math.abs( charge );
      if ( chargeAbsoluteValue > 0 ) {
        popSoundGenerator.playPop( chargeAbsoluteValue / BASEConstants.MAX_BALLOON_CHARGE );
      }
    } );

    // sound generation for drift velocity
    soundManager.addSoundGenerator( new BalloonVelocitySoundGenerator(
      model.velocityProperty,
      model.touchingWallProperty,
      options.balloonVelocitySoundGeneratorOptions
    ) );

    // @private {BalloonRubbingSoundGenerator} - Sound generation for when the balloon is being rubbed on the sweater or
    // against the wall.
    this.balloonRubbingSoundGenerator = new BalloonRubbingSoundGenerator(
      model.dragVelocityProperty,
      model.onSweaterProperty,
      model.touchingWallProperty,
      options.balloonRubbingSoundGeneratorOptions
    );
    soundManager.addSoundGenerator( this.balloonRubbingSoundGenerator );

    // sound generation for when the balloon contacts the sweater
    const balloonHitsSweaterSoundClip = new SoundClip( balloonHitSweater_mp3, {
      initialOutputLevel: 0.075
    } );
    soundManager.addSoundGenerator( balloonHitsSweaterSoundClip );
    model.velocityProperty.lazyLink( ( currentVelocity, previousVelocity ) => {
      const currentSpeed = currentVelocity.magnitude;
      const previousSpeed = previousVelocity.magnitude;
      if ( currentSpeed === 0 && previousSpeed > 0 && model.onSweaterProperty.value ) {
        balloonHitsSweaterSoundClip.play();
      }
    } );

    // Add the sound generation for when the balloon hits the wall or the drag bounds.
    const balloonHitsWallSoundClip = new SoundClip( wallContact_mp3, {
      initialOutputLevel: 0.15
    } );
    soundManager.addSoundGenerator( balloonHitsWallSoundClip );
    model.positionProperty.lazyLink( ( position, previousPosition ) => {

      // Test whether the balloon has come into contact with an edge and play a sound if so.
      const dragBounds = balloonDragBoundsProperty.value;
      if ( position.x >= dragBounds.maxX && previousPosition.x < dragBounds.maxX ) {

        // A different sound is played based on whether the balloon has hit the wall or the drag bounds.
        if ( globalModel.wall.isVisibleProperty.value ) {
          balloonHitsWallSoundClip.play();
        }
        else {
          boundaryReachedSoundPlayer.play();
        }
      }
      else if ( position.x <= dragBounds.minX && previousPosition.x > dragBounds.minX ) {
        boundaryReachedSoundPlayer.play();
      }
      if ( position.y >= dragBounds.maxY && previousPosition.y < dragBounds.maxY ) {
        boundaryReachedSoundPlayer.play();
      }
      else if ( position.y <= dragBounds.minY && previousPosition.y > dragBounds.minY ) {
        boundaryReachedSoundPlayer.play();
      }
    } );

    // pdom
    balloonImageNode.focusHighlight = new FocusHighlightFromNode( balloonImageNode );

    // pdom - when the balloon charge, position, or model.showChargesProperty changes, the balloon needs a new
    // description for assistive technology
    const updateAccessibleDescription = () => {
      this.descriptionContent = this.describer.getBalloonDescription();
    };
    model.positionProperty.link( updateAccessibleDescription );
    model.chargeProperty.link( updateAccessibleDescription );
    model.isDraggedProperty.link( updateAccessibleDescription );
    globalModel.showChargesProperty.link( updateAccessibleDescription );

    const dragBoundsProperty = new Property( this.getDragBounds() );

    // @private - the drag handler needs to be updated in a step function, see KeyboardDragHandler for more information
    let successfulKeyboardDrag = false; // used to hide the "drag" cue once a successful keyboard drag happens
    const boundaryUtterance = new Utterance();
    this.keyboardDragHandler = new KeyboardDragListener( {
      dragVelocity: 300, // in view coordinates per second
      shiftDragVelocity: 100, // in view coordinates per second
      dragBoundsProperty: dragBoundsProperty,
      positionProperty: model.positionProperty,
      shiftKeyMultiplier: 0.25,
      start: event => {
        const key = KeyboardUtils.getEventCode( event.domEvent );
        successfulKeyboardDrag = true;

        // if already touching a boundary when dragging starts, announce an indication of this
        if ( this.attemptToMoveBeyondBoundary( key ) ) {
          const attemptedDirection = this.getAttemptedMovementDirection( key );
          boundaryUtterance.alert = this.describer.movementDescriber.getTouchingBoundaryDescription( attemptedDirection );
          this.alertDescriptionUtterance( boundaryUtterance );
        }
      },
      drag: options.keyboardDrag,
      tandem: tandem.createTandem( 'keyboardDragListener' )
    } );

    // made visible when the balloon is picked up with a keyboard for the first time to show how a user can drag with
    // a keyboard
    const interactionCueNode = new BalloonInteractionCueNode( globalModel, model, this, layoutBounds );
    interactionCueNode.center = balloonImageNode.center;

    // Attach the GrabDragInteraction to a child of this Node so that the accessible
    // content for the interaction is underneath this node. Cannot attach to the balloonImageNode
    // because it is important that that Node be pickable: false for the touch areas. The Node takes
    // the shape of the touchArea so that bounds do not interfere or extend beyond the elliptical touch
    // area shape.
    const grabDragTargetNode = new InteractiveHighlightInteractionNode( this.touchArea );
    this.addChild( grabDragTargetNode );
    const grabDragInteraction = new GrabDragInteraction( grabDragTargetNode, this.keyboardDragHandler, {
      objectToGrabString: accessibleLabelString,
      dragCueNode: interactionCueNode,

      // BASE needs to control the ordering of all alerts after a release happens, so prevent
      // the default release alert
      // alertOnRelease: false,

      grabCueOptions: {
        centerTop: balloonImageNode.centerBottom.plusXY( 0, 10 )
      },

      keyboardHelpText: grabBalloonKeyboardHelpString,

      onGrab: () => {
        model.isDraggedProperty.set( true );
        grabBalloonSoundPlayer.play();
      },

      onRelease: () => {
        endDragListener();

        // reset the key state of the drag handler by interrupting the drag
        this.keyboardDragHandler.interrupt();
      },

      // hides the interactionCueNode cue node after a successful drag
      showDragCueNode: () => !successfulKeyboardDrag,

      tandem: tandem.createTandem( 'grabDragInteraction' )
    } );

    // jump to the wall on 'J + W'
    this.keyboardDragHandler.hotkeys = [
      {
        keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_W ],
        callback: () => {
          this.jumpBalloon( new Vector2( X_POSITIONS.AT_WALL, model.getCenterY() ) );
        }
      },
      {
        keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_S ],
        callback: () => {
          this.jumpBalloon( new Vector2( X_POSITIONS.AT_NEAR_SWEATER, model.getCenterY() ) );
        }
      },
      {
        keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_N ],
        callback: () => {
          this.jumpBalloon( new Vector2( X_POSITIONS.AT_NEAR_WALL, model.getCenterY() ) );
        }
      },
      {
        keys: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_C ],
        callback: () => {
          this.jumpBalloon( new Vector2( X_POSITIONS.AT_CENTER_PLAY_AREA, model.getCenterY() ) );
        }
      }
    ];

    // update the drag bounds when wall visibility changes
    globalModel.wall.isVisibleProperty.link( () => {
      dragBoundsProperty.value = this.getDragBounds();
    } );

    model.resetEmitter.addListener( () => {

      // if reset, release the balloon from dragging
      dragHandler.interrupt();

      // reset so the "drag" cue shows up again for the GrabDragInteraction
      successfulKeyboardDrag = false;

      this.describer.reset();
      grabDragInteraction.reset();
    } );

    // Handle a query parameter that adds a line and a marker at the "charge center".  This can be useful for debugging.
    if ( BASEQueryParameters.showBalloonChargeCenter ) {
      const parentToLocalChargeCenter = this.parentToLocalPoint( model.getChargeCenter() );
      this.addChild( new Rectangle( 0, 0, 5, 5, { fill: 'green', center: parentToLocalChargeCenter } ) );
      this.addChild( new Line( -500, parentToLocalChargeCenter.y, 500, parentToLocalChargeCenter.y, { stroke: 'green' } ) );
    }
  }

  /**
   * Step the model forward in time.
   * @param  {number} dt
   * @public
   */
  step( dt ) {

    this.balloonRubbingSoundGenerator.step( dt );

    // Step the describer, which uses polling to determine the next alerts describing interactions with the balloon.
    this.describer.step( dt );
  }

  /**
   * Jump the balloon to a new position, first muting the utteranceQueue, then updating position, then clearing the
   * queue and enabling it once more.  Finally, we will add a custom utterance to the queue describing the jump
   * interaction.
   * @param  {Vector2} center - new center position for the balloon
   * @public
   */
  jumpBalloon( center ) {
    this.model.jumping = true;

    // release balloon so that the jump is not associated with velocity
    this.model.setCenter( center );

    // clear the queue of utterances that collected as position changed
    this.forEachUtteranceQueue( utteranceQueue => utteranceQueue.clear() );

    // Send a custom alert, depending on where the balloon was moved to
    this.jumpingUtterance.alert = this.describer.movementDescriber.getJumpingDescription( center );
    this.alertDescriptionUtterance( this.jumpingUtterance );

    // reset forces in tracked values in describer that determine description for induced charge change
    this.describer.chargeDescriber.resetReferenceForces();
  }

  /**
   * Determine if the user attempted to move beyond the play area bounds with the keyboard.
   * @param {string} key
   * @returns {boolean}
   * @public
   */
  attemptToMoveBeyondBoundary( key ) {
    return (
      ( KeyboardDragListener.isLeftMovementKey( key ) && this.model.isTouchingLeftBoundary() ) ||
      ( KeyboardDragListener.isUpMovementKey( key ) && this.model.isTouchingTopBoundary() ) ||
      ( KeyboardDragListener.isRightMovementKey( key ) && this.model.isTouchingRightBoundary() ) ||
      ( KeyboardDragListener.isDownMovementKey( key ) && this.model.isTouchingBottomBoundary() )
    );
  }

  /**
   * @param {string} key
   * @returns {string}
   * @public
   */
  getAttemptedMovementDirection( key ) {
    let direction;
    if ( KeyboardDragListener.isLeftMovementKey( key ) ) {
      direction = BalloonDirectionEnum.LEFT;
    }
    else if ( KeyboardDragListener.isRightMovementKey( key ) ) {
      direction = BalloonDirectionEnum.RIGHT;
    }
    else if ( KeyboardDragListener.isUpMovementKey( key ) ) {
      direction = BalloonDirectionEnum.UP;
    }
    else if ( KeyboardDragListener.isDownMovementKey( key ) ) {
      direction = BalloonDirectionEnum.DOWN;
    }

    assert && assert( direction );
    return direction;
  }

  /**
   * Gets the available bounds for dragging, which will change when the wall becomes invisible.
   * @returns {Bounds2}
   * @private
   */
  getDragBounds() {
    const modelBounds = this.globalModel.playAreaBounds;
    const balloonWidth = this.model.width;
    const balloonHeight = this.model.height;
    return new Bounds2( modelBounds.minX, modelBounds.minY, modelBounds.maxX - balloonWidth, modelBounds.maxY - balloonHeight );
  }
}

/**
 * A node that mixes InteractiveHighlighting to support Interactive Highlights. The GrabDragInteraction implements
 * the highlights used for interaction and they are applied to a child of this Node. In order to use the
 * same highlights, InteractiveHighlighting is composed with the same Node that uses GrabDragInteraction.
 */
class InteractiveHighlightInteractionNode extends InteractiveHighlighting( Path ) {}

balloonsAndStaticElectricity.register( 'BalloonNode', BalloonNode );

export default BalloonNode;