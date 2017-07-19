// Copyright 2013-2015, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var AriaHerald = require( 'SCENERY_PHET/accessibility/AriaHerald' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Shape = require( 'KITE/Shape' );
  var Emitter = require( 'AXON/Emitter' );
  var Input = require( 'SCENERY/input/Input' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var KeyboardDragHandler = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/KeyboardDragHandler' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );
  var BalloonDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BalloonDescriber' );
  var Line = require( 'SCENERY/nodes/Line' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );

  // a11y - critical x locations for the balloon
  var X_LOCATIONS = PlayAreaMap.X_LOCATIONS;
  var DESCRIPTION_REFRESH_RATE = 3000; // in ms
  var RELEASE_DESCRIPTION_TIME_DELAY = 25; // in ms

  // strings
  var grabBalloonPatternString = BASEA11yStrings.grabBalloonPatternString;

  /**
   * Constructor for the balloon
   *
   * @param  {number} x
   * @param  {number} y
   * @param  {BalloonModel} model
   * @param  {Image} imgsrc - image source from the image plugin
   * @param  {BalloonsAndStaticElectricityModel} globalModel
   * @param  {Tandem} tandem
   * @constructor
   */
  function BalloonNode( x, y, model, imgsrc, globalModel, accessibleLabelString, tandem, options ) {
    var self = this;

    // @public (a11y) - emits an event when the balloon receives focus
    // TODO: should Accessibility.js emit events for such things?
    this.focusEmitter = new Emitter();
    this.blurEmitter = new Emitter();
    this.dragNodeFocusedEmitter = new Emitter();
    this.dragNodeBlurredEmitter = new Emitter();

    options = _.extend( {
      cursor: 'pointer',

      // a11y - this node will act as a container for more accessible content, its children will implement
      // most of the keyboard navigation
      parentContainerTagName: 'div',
      tagName: 'div',
      labelTagName: 'h3',
      accessibleLabel: accessibleLabelString,
      prependLabels: true
    }, options );

    // super constructor
    Node.call( this, options );

    this.x = x;
    this.y = y;

    // @private
    this.model = model;
    this.globalModel = globalModel;

    // @public (a11y, read-only) - increments when there is a successful drag interaction with the keyboard,
    // used by the BalloonInteractionCueNode
    this.keyboardDragCount = 0;

    var accessibleButtonLabel = StringUtils.fillIn( grabBalloonPatternString, {
      balloon: accessibleLabelString
    } );

    // a11y - a type that generates descriptions for the balloon 
    this.describer = new BalloonDescriber( globalModel, globalModel.wall, model, accessibleLabelString );

    // @private (a11y) - if this time is greater than DESCRIPTION_REFRESH_RATE and the balloon
    // is moving due to an applied force, we will alert a new description, intially the refresh rate
    // so that the first movement is described
    this.timeSincePositionAlert = DESCRIPTION_REFRESH_RATE; // in ms

    // @private (a11y) - a flag that tracks if the initial movmement of the balloon after release has
    // been described. Gets reset whenever the balloon is picked up.
    this.initialMovementDescribed = false;

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

    var endDragListener = function() {
      model.isDraggedProperty.set( false );
      model.velocityProperty.set( new Vector2( 0, 0 ) );
      model.dragVelocityProperty.set( new Vector2( 0, 0 ) );
    };

    //When dragging, move the balloon
    var dragHandler = new MovableDragHandler( property, {

      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      startDrag: function() {
        model.isDraggedProperty.set( true );
      },
      endDrag: function() {
        endDragListener();
      },
      tandem: tandem.createTandem( 'dragHandler' )
    } );

    this.addInputListener( dragHandler );

    var balloonImageNode = new Image( imgsrc, {
      tandem: tandem.createTandem( 'balloonImageNode' ),
      pickable: false, // custom touch areas applied to parent

      // a11y
      tagName: 'button',
      accessibleLabel: accessibleButtonLabel
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

      // translate the node to the new location
      self.translation = location;

      // everything else for a11y - compose the alert that needs to be sent to assistive technology
      if ( oldLocation ) {
        if ( self.model.isVisibleProperty.get() ) {
          if ( !self.model.isDraggedProperty.get() ) {

            var alert;
            if ( !self.initialMovementDescribed ) {
              if ( self.model.timeSinceRelease > RELEASE_DESCRIPTION_TIME_DELAY ) {

                // get the initial description of balloon movement
                self.initialMovementDescribed = true;
                alert = self.describer.getInitialMovementDescription( location, oldLocation );
              }
            }
            else if ( self.timeSincePositionAlert > DESCRIPTION_REFRESH_RATE ) {

              // TODO
              // get subsequent descriptions of movement ("still moving...")
              // var alert = self.describer.getContinuousMovementDescription();
              // self.timeSincePositionAlert = 0;
            }

            alert && AriaHerald.announcePolite( alert );
          }
          else {

            // balloon is moving due to dragging
            if ( self.timeSincePositionAlert > DESCRIPTION_REFRESH_RATE ) {

              // get the movement direction description
              var directionString = self.describer.getMovementDirectionDescription( location, oldLocation );

              // just announce direction always for now
              AriaHerald.announcePolite( directionString );

              // reset timer
              self.timeSincePositionAlert = 0;
            }
          }
        }
      }
    } );

    //show charges based on showCharges property
    globalModel.showChargesProperty.link( function updateChargesVisibilityOnBalloon( value ) {
      if ( value === 'diff' ) {
        originalChargesNode.visible = false;
        addedChargesNode.visible = true;
      }
      else {
        var visiblity = (value === 'all');
        originalChargesNode.visible = visiblity;
        addedChargesNode.visible = visiblity;
      }
    } );

    // a11y
    balloonImageNode.focusHighlight = Shape.rectangle( 0, 0, balloonImageNode.width, balloonImageNode.height );

    // a11y - the balloon is hidden from AT when invisible, and an alert is announced to let the user know
    model.isVisibleProperty.link( function( isVisible ) {
      self.setAccessibleHidden( !isVisible );
    } );

    // a11y - when the balloon charge, location, or model.showChargesProperty changes, the balloon needs a new
    // description for assistive technology
    var updateAccessibleDescription = function() {
      self.accessibleDescription = self.describer.getBalloonDescription( model );
    };
    model.locationProperty.link( updateAccessibleDescription );
    model.chargeProperty.link( updateAccessibleDescription );
    model.isDraggedProperty.link( updateAccessibleDescription );
    globalModel.showChargesProperty.link( updateAccessibleDescription );

    // @private - the drag handler needs to be updated in a step function, see KeyboardDragHandler for more
    // information
    this.keyboardDragHandler = new KeyboardDragHandler( model.locationProperty, {
      dragBounds: this.getDragBounds(),
      shiftKeyMultiplier: 0.25,
      onDrag: function() {
        if ( self.keyboardDragCount === 0 ) {
          self.keyboardDragCount++;
        }
      },
      endDrag: function( event ) {

        // when we complete a keyboard drag, set timer to refresh rate so that we trigger a new
        // description next time we press a key
        self.timeSincePositionAlert = DESCRIPTION_REFRESH_RATE;
      },
      startDrag: function( event ) {

        // if touching a boundary, anounce an indication of this
        if ( self.attemptToMoveBeyondBoundary( event.keyCode ) ) {
          AriaHerald.announcePolite( self.describer.getTouchingBoundaryDescription() );
        }
      }
    } );

    // jump to the wall on 'J + W'
    this.keyboardDragHandler.addHotkeyGroups( [
      {
        keys: [ Input.KEY_J, Input.KEY_W ],
        callback: function() {
          model.setCenter( new Vector2( X_LOCATIONS.AT_WALL, model.getCenterY() ) );
        }
      },
      {
        keys: [ Input.KEY_J, Input.KEY_S ],
        callback: function() {
          model.setCenter( new Vector2( X_LOCATIONS.AT_NEAR_SWEATER, model.getCenterY() ) );
        }
      },
      {
        keys: [ Input.KEY_J, Input.KEY_N ],
        callback: function() {
          model.setCenter( new Vector2( X_LOCATIONS.AT_NEAR_WALL, model.getCenterY() ) );
        }
      },
      {
        keys: [ Input.KEY_J, Input.KEY_C ],
        callback: function() {
          model.setCenter( new Vector2( X_LOCATIONS.AT_CENTER_PLAY_AREA, model.getCenterY() ) );
        }
      }
    ] );    

    var dragHighlightNode = new Rectangle( 0, 0, balloonImageNode.width, balloonImageNode.height, {
      lineWidth: 3,
      stroke: 'rgba(250,40,135,0.9)',
      lineDash: [ 7, 7 ],
      tandem: tandem.createTandem( 'dragHighlightNode' )
    } );

    // A node that receives focus and handles keyboard draging
    var accessibleDragNode = new Node( {
      tagName: 'div',
      focusable: false,
      accessibleHidden: true,
      pickable: false,
      ariaRole: 'application',
      focusHighlight: dragHighlightNode
    } );
    this.addChild( accessibleDragNode );

    // add the keyboard drag handler to the node that will handle this
    accessibleDragNode.addAccessibleInputListener( this.keyboardDragHandler );

    // add a listener that emits events when accessible drag node is blurred and focused
    accessibleDragNode.addAccessibleInputListener( {
      focus: function() {
        self.dragNodeFocusedEmitter.emit();
      },
      blur: function() {
        self.dragNodeBlurredEmitter.emit();
      }
    } );

    // update the drag bounds when wall visibility changes
    globalModel.wall.isVisibleProperty.link( function( isVisible ) {
      self.keyboardDragHandler.dragBounds = self.getDragBounds();
    } );

    // when the "Grab Balloon" button is pressed, focus the dragable node and set to dragged state
    balloonImageNode.addAccessibleInputListener( {
      click: function( event ) {

        // make unhidden and focusable
        accessibleDragNode.accessibleHidden = false;
        accessibleDragNode.focusable = true;

        // focus
        accessibleDragNode.focus();

        // the balloon is picked up for dragging
        model.isDraggedProperty.set( true );
      },
      focus: function( event ) {
        self.focusEmitter.emit1( self.focused );
      },
      blur: function( event ) {
        self.blurEmitter.emit();
      }
    } );

    // when the dragable balloon is released,
    accessibleDragNode.addAccessibleInputListener( {
      keydown: function( event ) {
        if ( event.keyCode === Input.KEY_SPACE || event.keyCode === Input.KEY_ENTER ) {

          // release the balloon
          endDragListener();

          // focus the grab balloon button
          balloonImageNode.focus();

          // the draggable node should no longer be focusable
          accessibleDragNode.focusable = false;
          accessibleDragNode.accessibleHidden = true;

          // reset the key state of the drag handler
          self.keyboardDragHandler.reset();
        }
      },
      focus: function() {
        self.dragNodeFocusedEmitter.emit();
      },
      blur: function( event ) {
        endDragListener();

        // the draggable node should no longer be focusable
        accessibleDragNode.focusable = false;
        accessibleDragNode.accessibleHidden = true;

        // reset the key state of the drag handler
        self.keyboardDragHandler.reset();

        self.dragNodeBlurredEmitter.emit();
      }
    } );

    // when reset, reset the interaction trackers
    model.resetEmitter.addListener( function() {
      self.keyboardDragCount = 0;
    } );

    // a11y - when the balloon is picked up or released, generate and announce an alert that indicates
    // the interaction and the balloons state
    model.isDraggedProperty.link( function( isDragged ) {
      var alert;
      if ( isDragged ) {
        alert = self.describer.getDraggedAlert();
      }
      else {
        alert = self.describer.getReleasedAlert();
      }
      AriaHerald.announcePolite( alert );

      // reset flags that track description content
      self.initialMovementDescribed = false;
    } );

    if ( BalloonsAndStaticElectricityQueryParameters.showBalloonChargeCenter ) {
      var parentToLocalChargeCenter = this.parentToLocalPoint( model.getChargeCenter() );
      this.addChild( new Rectangle( 0, 0, 5, 5, { fill: 'green', center: parentToLocalChargeCenter } ) ); 
      this.addChild( new Line( -500, parentToLocalChargeCenter.y, 500, parentToLocalChargeCenter.y, { stroke: 'green' } ) );
    }
  }

  balloonsAndStaticElectricity.register( 'BalloonNode', BalloonNode );

  return inherit( Node, BalloonNode, {

    /**
     * Also, step the keyboard drag handler to track how long keys have been pressed down.
     * 
     * @public
     * @param  {number} dt
     */
    step: function( dt ) {
      this.keyboardDragHandler.step( dt );

      // increment timer tracking time since alert description
      this.timeSincePositionAlert += dt * 1000;
    },

    getPositionOnSweaterDescription: function() {
      return 'Please implement this function or delete.';
    },

    /**
     * Determine if the user attempted to move beyond the play area bounds with the keyboard.
     * @return {[type]} [description]
     */
    attemptToMoveBeyondBoundary: function( keyCode ) {
      return (
        ( KeyboardDragHandler.isLeftMovementKey( keyCode ) && this.model.isTouchingLeftBoundary() ) ||
        ( KeyboardDragHandler.isUpMovementKey( keyCode ) && this.model.isTouchingTopBoundary() ) ||
        ( KeyboardDragHandler.isRightMovementKey( keyCode ) && this.model.isTouchingRightBoundary() ) ||
        ( KeyboardDragHandler.isDownMovementKey( keyCode ) && this.model.isTouchingBottomBoundary() )
      );
    },

    getDragBounds: function() {
      var modelBounds = this.globalModel.bounds;
      var balloonWidth = this.model.width;
      var balloonHeight = this.model.height;
      return new Bounds2( modelBounds.minX, modelBounds.minY, modelBounds.maxX - balloonWidth, modelBounds.maxY - balloonHeight );
    }
  } );
} );
