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

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import GrabDragInteraction from '../../../../scenery-phet/js/accessibility/GrabDragInteraction.js';
import FocusHighlightFromNode from '../../../../scenery/js/accessibility/FocusHighlightFromNode.js';
import KeyboardUtils from '../../../../scenery/js/accessibility/KeyboardUtils.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import PitchedPopGenerator from '../../../../tambo/js/sound-generators/PitchedPopGenerator.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import grabBalloonSound from '../../../sounds/balloon-grab-004_mp3.js';
import balloonHitsSweaterSound from '../../../sounds/balloon-hit-sweater_mp3.js';
import releaseBalloonSound from '../../../sounds/balloon-release-004_mp3.js';
import balloonHitsWallSound from '../../../sounds/wall-contact_mp3.js';
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
      balloonVelocitySoundGeneratorOptions: {},

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
    this.describer = new BalloonDescriber( globalModel, globalModel.wall, model, accessibleLabelString, otherAccessibleLabelString );

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

    // Create the sound generators for grab and release of the balloons.
    const grabBalloonSoundPlayer = new SoundClip( grabBalloonSound, {
      initialOutputLevel: GRAB_RELEASE_SOUND_LEVEL
    } );
    soundManager.addSoundGenerator( grabBalloonSoundPlayer );
    const releaseBalloonSoundPlayer = new SoundClip( releaseBalloonSound, {
      initialOutputLevel: GRAB_RELEASE_SOUND_LEVEL
    } );
    soundManager.addSoundGenerator( releaseBalloonSoundPlayer );

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
      end: () => {
        endDragListener();
        model.draggingWithPointer = false;
      },
      tandem: tandem.createTandem( 'dragHandler' )
    } );
    this.addInputListener( dragHandler );

    const balloonImageNode = new Image( imageSource, {
      tandem: tandem.createTandem( 'balloonImageNode' )
    } );

    // now add the balloon, so that the tether is behind it in the z order
    this.addChild( balloonImageNode );

    // custom elliptical touch/mouse areas so the balloon is easier to grab when under the other balloon
    this.mouseArea = Shape.ellipse( balloonImageNode.centerX, balloonImageNode.centerY, balloonImageNode.width / 2, balloonImageNode.height / 2, 0 );
    this.touchArea = this.mouseArea;

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

    // sound generation for when the balloon is being rubbed on the sweater
    soundManager.addSoundGenerator(
      new BalloonRubbingSoundGenerator( model.dragVelocityProperty, model.onSweaterProperty, model.touchingWallProperty )
    );

    // sound generation for when the balloon contacts the sweater
    const balloonHitsSweaterSoundClip = new SoundClip( balloonHitsSweaterSound, {
      initialOutputLevel: 0.1
    } );
    soundManager.addSoundGenerator( balloonHitsSweaterSoundClip );
    model.velocityProperty.lazyLink( ( currentVelocity, previousVelocity ) => {
      const currentSpeed = currentVelocity.magnitude;
      const previousSpeed = previousVelocity.magnitude;
      if ( currentSpeed === 0 && previousSpeed > 0 && model.onSweaterProperty.value ) {
        balloonHitsSweaterSoundClip.play();
      }
    } );

    // sound generation for when the balloon hits the wall
    const balloonHitsWallSoundClip = new SoundClip( balloonHitsWallSound, {
      initialOutputLevel: 0.6
    } );
    soundManager.addSoundGenerator( balloonHitsWallSoundClip );
    model.touchingWallProperty.link( touchingWall => {
      if ( touchingWall ) {
        balloonHitsWallSoundClip.play();
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

    // @private - the drag handler needs to be updated in a step function, see KeyboardDragHandler for more information
    const boundaryUtterance = new Utterance();
    this.keyboardDragHandler = new KeyboardDragListener( {
      downDelta: 0,
      shiftDownDelta: 0,
      dragVelocity: 300, // in view coordinates per second
      shiftDragVelocity: 100, // in view coordinates per second
      dragBounds: this.getDragBounds(),
      positionProperty: model.positionProperty,
      shiftKeyMultiplier: 0.25,
      start: event => {
        const key = KeyboardUtils.getKeyDef( event.domEvent );

        // if already touching a boundary when dragging starts, announce an indication of this
        if ( this.attemptToMoveBeyondBoundary( key ) ) {
          const attemptedDirection = this.getAttemptedMovementDirection( key );
          boundaryUtterance.alert = this.describer.movementDescriber.getTouchingBoundaryDescription( attemptedDirection );
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
    const grabDragInteraction = new GrabDragInteraction( balloonImageNode, this.keyboardDragHandler, {
      objectToGrabString: accessibleLabelString,
      dragCueNode: interactionCueNode,

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

      // hides the interactionCueNode cue if this returns true
      showDragCueNode: () => model.positionProperty.get().equals( model.positionProperty.initialValue ),

      tandem: tandem.createTandem( 'grabDragInteraction' )
    } );

    // jump to the wall on 'J + W'
    this.keyboardDragHandler.addHotkeys( [
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
    ] );

    // update the drag bounds when wall visibility changes
    globalModel.wall.isVisibleProperty.link( () => {
      this.keyboardDragHandler._dragBounds = this.getDragBounds();
    } );

    model.resetEmitter.addListener( () => {

      // if reset, release the balloon from dragging
      dragHandler.interrupt();

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
    phet.joist.sim.utteranceQueue.clear();

    // Send a custom alert, depending on where the balloon was moved to
    this.jumpingUtterance.alert = this.describer.movementDescriber.getJumpingDescription( center );
    phet.joist.sim.utteranceQueue.addToBack( this.jumpingUtterance );

    // reset forces in tracked values in describer that determine description for induced charge change
    this.describer.chargeDescriber.resetReferenceForces();
  }

  /**
   * Determine if the user attempted to move beyond the play area bounds with the keyboard.
   * @param {KeyDef} key
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
   * @param {KeyDef} key
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

balloonsAndStaticElectricity.register( 'BalloonNode', BalloonNode );

export default BalloonNode;