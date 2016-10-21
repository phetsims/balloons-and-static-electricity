// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the Balloon of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var AccessibleNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleNode' );
  var AccessibleDragNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleDragNode' );
  // var Path = require( 'SCENERY/nodes/Path' );
  // var Shape = require( 'KITE/Shape' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var AriaHerald = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AriaHerald' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // constants
  var DROPPED_FOCUS_HIGHLIGHT_COLOR = 'rgba( 250, 40, 135, 0.9 )';
  var GRABBED_FOCUS_HIGHLIGHT_COLOR = 'black';

  // strings
  var balloonGrabCueString = 'Once grabbed, get ready to drag balloon.  Press W, A, S, or D key to drag up, left, down, or right.  To let go, press Spacebar.';
  var grabPatternString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/grabPattern' );
  var greenBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloon.label' );
  var yellowBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/yellowBalloon.label' );

  var greenBalloonRemovedString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloonRemoved' );
  var greenBalloonAddedString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloonAdded' );

  /**
   * Constructor for the balloon
   *
   * @param  {number} x
   * @param  {number} y
   * @param  {BalloonModel} model
   * @param  {Image} imgsrc - image source from the Image plugin
   * @param  {BalloonsAndStaticElectricityModel} globalModel
   * @param  {string} balloonColor - 'yellow'|'green'
   * @constructor
   */
  function BalloonNode( x, y, model, imgsrc, globalModel, balloonColor, keyboardHelpDialog ) {
    var self = this;

    var balloonButtonLabel;
    var balloonDraggableLabel;
    if ( balloonColor === 'green' ) {
      balloonButtonLabel = StringUtils.format( grabPatternString, greenBalloonLabelString );
      balloonDraggableLabel = greenBalloonLabelString;
    }
    else {
      balloonButtonLabel = StringUtils.format( grabPatternString, yellowBalloonLabelString );
      balloonDraggableLabel = yellowBalloonLabelString;
    }

    // super constructor
    AccessibleNode.call( this, null, { 
      cursor: 'pointer',

      // a11y
      tagName: 'div',
      labelTagName: 'h3',
      label: balloonDraggableLabel,
      childContainerTagName: 'div',
      hidden: !model.isVisibleProperty.value

    } );

    this.x = x;
    this.y = y;

    // @private
    this.model = model;
    this.globalModel = globalModel;

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

        model.dragVelocity.set( new Vector2( 0, 0 ) );
      }
    } );

    this.addInputListener( balloonDragHandler );

    // add the Balloon image
    var balloonImageNode = new Image( imgsrc );
    this.addChild( balloonImageNode );

    //rope
    //TODO: For performance, move this out of BalloonNode and into a separate layer ?
    // var customShape = new Shape();
    // customShape.moveTo( model.width / 2, model.height - 2 );
    // customShape.lineTo( 440 - model.location.x + model.width / 2, 50 + globalModel.height - model.location.y );
    // var path = new Path( customShape, {
    //   stroke: '#000000',
    //   lineWidth: 1,
    //   pickable: false
    // } );
    // this.addChild( path );

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
    model.chargeProperty.link( function updateCharge( chargeVal ) {
      if ( chargeVal ) {
        model.minusCharges[ model.plusCharges.length - 1 - chargeVal ].view.visible = true;
      }

      // update the charge description
      model.balloonDescriber.getDescription( model );
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

    model.view = this;

    // a11y
    // focus highlight - turns black when balloon is picked up for dragging
    var lineWidth = 4 / balloonImageNode.transform.transformDelta2( Vector2.X_UNIT ).magnitude();
    var focusHighlightNode = new Rectangle( 0, 0, balloonImageNode.width, balloonImageNode.height, {
      lineWidth: lineWidth,
      stroke: DROPPED_FOCUS_HIGHLIGHT_COLOR
    } );

    // the herald that will anounce alerts via screen reader
    this.ariaHerald = new AriaHerald();

    // the balloon is dragged in model coordinates, adjusted for dimensions of the balloon body
    var balloonDragBounds = new Bounds2( 0, 0, globalModel.playArea.maxX - this.model.width, globalModel.playArea.maxY - this.model.height );

    // a flag to track whether or not a charge was picked up for dragging
    self.draggableNode = new AccessibleDragNode( balloonImageNode.bounds, model.locationProperty, {
      dragBounds: balloonDragBounds,
      parentContainerTagName: 'div',
      label: balloonDraggableLabel,
      focusHighlight: focusHighlightNode,
      focusable: false, // this is only focusable by pressing the button, should not be in navigation order
      events: [
        {
          eventName: 'keyup',
          eventFunction: function( event ) {
            if ( event.keyCode === 32 ) {
              accessibleButtonNode.focus();

              // release the balloon
              self.releaseBalloon();
            }
          }
        },
        {
          eventName: 'keydown',
          eventFunction: function( event ) {
            if ( event.keyCode === 72 /* key h */ ) {
              keyboardHelpDialog.activeElement = self.draggableNode.domElement;
              keyboardHelpDialog.show();
            }
          }
        }
      ],
      onTab: function( event ) {

        // if the user presses 'tab' we want the focus to go to the next element in the
        // navigation order, and then we want the screen reader to anounce something specific
        // the balloon should also be released from dragging
        if ( event.shiftKey ) {
          // if shift key is down, focus the previous element in the navigation order
          self.draggableNode.getPreviousFocusable().focus();
        }
        else {
          // focus the nest element in the navigation order
          self.draggableNode.getNextFocusable().focus();
        }

        self.releaseBalloon();
      },
      ariaDescribedBy: this.getDescriptionElementID()
    } );

    this.draggableNode.keyUpEmitter.addListener( function( event ) {
      if ( self.draggableNode.draggableKeyUp( event.keyCode ) ) {
        self.ariaHerald.announceAssertive( model.balloonDescriber.getDraggingDescription( self.model, event.keyCode ) );
      }
    } );

    this.draggableNode.balloonJumpingEmitter.addListener( function( event ) {
      self.ariaHerald.announceAssertive( model.balloonDescriber.getJumpingDescription( self.model, event.keyCode ) );
    } );

    var accessibleButtonNode = new AccessibleNode( balloonImageNode.bounds, {
      tagName: 'button', // representative type
      parentContainerTagName: 'div', // contains representative element, label, and description
      focusHighlight: focusHighlightNode,
      label: balloonButtonLabel,
      description: balloonGrabCueString,
      events: [
        {
          eventName: 'click',
          eventFunction: function() {
            model.isDragged = true;
            self.draggableNode.setGrabbedState( true );

            // grab and focus the draggable element
            self.draggableNode.focus();

            // reset the velocity when picked up
            model.velocityProperty.set( new Vector2( 0, 0 ) );
          }
        }
      ]
    } );

    this.addChild( accessibleButtonNode );
    this.addChild( self.draggableNode );

    // the balloon is hidden from AT when invisible, and an alert is announced to let the user know
    model.isVisibleProperty.lazyLink( function( isVisible ) {
      self.setHidden( !isVisible );
      // self.draggableNode.setHidden( !isVisible );
      // accessibleButtonNode.setHidden( !isVisible );

      var alertDescription = isVisible ? greenBalloonAddedString : greenBalloonRemovedString;
      self.ariaHerald.announceAssertive( alertDescription );
    } );

    // the focus highlight changes color when grabbed
    model.isDraggedProperty.link( function( isDragged ) {
      focusHighlightNode.stroke = isDragged ? GRABBED_FOCUS_HIGHLIGHT_COLOR : DROPPED_FOCUS_HIGHLIGHT_COLOR;

      // when the balloon is no longer being dragged, it should be removed from the focus order
      self.draggableNode.setFocusable( isDragged );

      // a11y - update the navigation cue when the balloon is picked up
      var locationDescription = model.balloonDescriber.getDescription( model, isDragged );
      self.setDescription( locationDescription );

      // reset the describer flags
      model.balloonDescriber.reset();
    } );

    // TODO: Balloon 'string' removevd for now, we gitare investigating ways of removing confusion involving buoyant forces
    // see https://github.com/phetsims/balloons-and-static-electricity/issues/127
    //changes visual position
    model.locationProperty.link( function updateLocation( location ) {
      self.translation = location;
      // customShape = new Shape();
      // customShape.moveTo( model.width / 2, model.height - 2 );
      // customShape.lineTo( 440 - model.location.x + model.width / 2, 50 + globalModel.height - model.location.y );
      // path.shape = customShape;

      // a11y - update the description when the location changes (only found with cursor keys)
      var locationDescription = model.balloonDescriber.getDescription( model, model.isDraggedProperty.get() );
      self.setDescription( locationDescription );

    } );

    globalModel.wall.isVisibleProperty.link( function( isVisible ) {
      // an adjustment to the draggable width depending on whether or not the wall is visible
      var boundsAdjustment = isVisible ? globalModel.wallWidth : 0;
      var boundsWidth = globalModel.playArea.maxX - self.model.width - boundsAdjustment;
      var boundsHeight = globalModel.playArea.maxY - self.model.height;

      var balloonDragBounds = new Bounds2( 0, 0, boundsWidth, boundsHeight );
      self.draggableNode.setDragBounds( balloonDragBounds );

      // get a description for the changing balloon in case it moves when the wall is made invisible
      // should only be announced if the balloon had a charge, was touching the wall, and the wall is 
      // made invisible
      if ( model.chargeProperty.get() < 0 && !isVisible && model.touchingWall() ) {
        var balloonDescription = model.balloonDescriber.getWallRemovedDescription( !isVisible );
        self.ariaHerald.announceAssertive( balloonDescription );
      }
    } );
  }

  balloonsAndStaticElectricity.register( 'BalloonNode', BalloonNode );

  return inherit( AccessibleNode, BalloonNode, {

    getPositionOnSweaterDescription: function() {
      return 'On body of sweater';
    },

    /**
     * Step the draggable node for drag functionality
     *
     * @param  {number} dt
     */
    step: function( dt ) {
      this.draggableNode.step( dt );
    },

    /**
     * Release the balloon from a dragging state with the keyboard.  Calling this function
     * will set the model dragging property and anounce alert description.s
     *
     * @return {type}  description
     */
    releaseBalloon: function() {
      // release the balloon
      this.model.isDraggedProperty.set( false );

      // anounce the release description
      var releaseDescription = this.model.balloonDescriber.getReleaseDescription();
      this.ariaHerald.announcePolite( releaseDescription );
    }
  } );
} );
