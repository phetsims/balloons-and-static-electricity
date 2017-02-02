// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the Balloon of the model.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var TandemNode = require( 'TANDEM/scenery/nodes/TandemNode' );
  var TandemImage = require( 'TANDEM/scenery/nodes/TandemImage' );
  var AccessibleNode = require( 'SCENERY/accessibility/AccessibleNode' );
  var AccessibleDragNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleDragNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TandemRectangle = require( 'TANDEM/scenery/nodes/TandemRectangle' );
  var AriaHerald = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AriaHerald' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var DROPPED_FOCUS_HIGHLIGHT_COLOR = 'rgba( 250, 40, 135, 0.9 )';
  var GRABBED_FOCUS_HIGHLIGHT_COLOR = 'black';
  var KEY_SPACE = 32; // keycode for 'spacebar'

  /**
   * Constructor for the balloon
   *
   * @param  {number} x
   * @param  {number} y
   * @param  {BalloonModel} model
   * @param  {Image} imgsrc - image source from the image plugin
   * @param  {BalloonsAndStaticElectricityModel} globalModel
   * @param  {string} balloonColor - 'yellow'|'green'
   * @param  {Tandem} tandem
   * @constructor
   */
  function BalloonNode( x, y, model, imgsrc, globalModel, balloonColor, tandem ) {
    var self = this;

    var balloonButtonLabel;
    var balloonDraggableLabel;
    if ( balloonColor === 'green' ) {
      balloonButtonLabel = StringUtils.format( BASEA11yStrings.grabPatternString, BASEA11yStrings.greenBalloonLabelString );
      balloonDraggableLabel = BASEA11yStrings.greenBalloonLabelString;
    }
    else {
      balloonButtonLabel = StringUtils.format( BASEA11yStrings.grabPatternString, BASEA11yStrings.yellowBalloonLabelString );
      balloonDraggableLabel = BASEA11yStrings.yellowBalloonLabelString;
    }

    // super constructor
    AccessibleNode.call( this, {
      cursor: 'pointer',

      // a11y
      tagName: 'div',
      labelTagName: 'h3',
      descriptionTagName: 'p',
      label: balloonDraggableLabel,
      childContainerTagName: 'div',
      hidden: !model.isVisibleProperty.value
    } );

    this.x = x;
    this.y = y;

    // @private
    this.model = model;
    this.globalModel = globalModel;

    var originalChargesNode = new TandemNode( {
      pickable: false,
      tandem: tandem.createTandem( 'originalChargesNode' )
    } );
    var addedChargesNode = new TandemNode( { pickable: false, tandem: tandem.createTandem( 'addedChargesNode' ) } );

    var property = {

      //Set only to the legal positions in the frame
      set: function( location ) { model.locationProperty.set( globalModel.checkBalloonRestrictions( location, model.width, model.height ) ); },

      //Get the location of the model
      get: function() { return model.locationProperty.get(); }
    };

    //When dragging, move the balloon
    var dragHandler = new MovableDragHandler( property, {

      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      startDrag: function() {
        model.isDraggedProperty.set( true );
      },
      endDrag: function() {
        model.isDraggedProperty.set( false );
        model.velocityProperty.set( new Vector2( 0, 0 ) );
        model.dragVelocityProperty.set( new Vector2( 0, 0 ) );
      },
      tandem: tandem.createTandem( 'dragHandler' )
    } );

    this.addInputListener( dragHandler );

    // create the balloon image, but don't add it just yet
    var balloonImageNode = new TandemImage( imgsrc, { tandem: tandem.createTandem( 'balloonImageNode' ) } );

    // add the tether (a.k.a. 'string', 'rope' or 'line') that goes from the balloon to the bottom of the frame
    //TODO: For performance, move this out of BalloonNode and into a separate layer ?
    //var tetherNode = new Path( null, {
    //  stroke: '#000000',
    //  lineWidth: 1,
    //  pickable: false
    //} );
    //this.addChild( tetherNode );
    //var connectionPoint = new Vector2( model.width / 2, model.height );
    //debugger;
    //var anchorPoint = new Vector2( globalModel.width / 2, globalModel.height );
    //model.locationProperty.link( function( location ) {
    //  var tetherShape = new Shape()
    //    .moveToPoint( connectionPoint )
    //    .lineToPoint( self.globalToParentPoint( anchorPoint ) );
    //    //.lineTo(
    //    //  440 - model.locationProperty.get().x + model.width / 2,
    //    //  50 + globalModel.height - model.locationProperty.get().y
    //    //);
    //  tetherNode.shape = tetherShape;
    //} );

    // now add the balloon, so that the tether is behind it in the z order
    this.addChild( balloonImageNode );

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

    //if change charge, show more minus charges and update the description
    model.chargeProperty.link( function updateCharge( chargeVal ) {
      var numVisibleMinusCharges = Math.abs( chargeVal );

      for ( var i = 0; i < addedNodes.length; i++ ) {
        addedNodes[ i ].visible = i < numVisibleMinusCharges;
      }

      // a11y
      var locationDescription = model.balloonDescriber.getDescription( model, model.isDraggedProperty.get() );
      self.setDescription( locationDescription );
    } );

    // TODO: Balloon 'string' removevd for now, we are investigating ways of removing confusion involving buoyant forces
    // see https://github.com/phetsims/balloons-and-static-electricity/issues/127
    //changes visual position
    model.locationProperty.link( function updateLocation( location ) {
      self.translation = location;
      // tetherShape = new Shape();
      // tetherShape.moveTo( model.width / 2, model.height - 2 );
      // tetherShape.lineTo( 440 - model.location.x + model.width / 2, 50 + globalModel.height - model.location.y );
      // path.shape = tetherShape;

      // update the charge description
      model.balloonDescriber.getDescription( model );
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
    // focus highlight - turns black when balloon is picked up for dragging
    var lineWidth = 4 / balloonImageNode.transform.transformDelta2( Vector2.X_UNIT ).magnitude();
    var focusHighlightNode = new TandemRectangle( 0, 0, balloonImageNode.width, balloonImageNode.height, {
      lineWidth: lineWidth,
      stroke: DROPPED_FOCUS_HIGHLIGHT_COLOR,
      tandem: tandem.createTandem( 'focusHighlightNode' )
    } );

    // the balloon is dragged in model coordinates, adjusted for dimensions of the balloon body
    var balloonDragBounds = new Bounds2( 0, 0, globalModel.playArea.maxX - this.model.width, globalModel.playArea.maxY - this.model.height );

    // a flag to track whether or not a charge was picked up for dragging
    self.accessibleDragNode = new AccessibleDragNode( model.locationProperty, tandem.createTandem( 'accessibleDragNode' ), {
      dragBounds: balloonDragBounds,
      label: balloonDraggableLabel,
      labelTagName: 'p',
      descriptionTagName: 'p',
      parentContainerTagName: 'div',
      focusHighlight: focusHighlightNode,
      focusable: false, // this is only focusable by pressing the button, should not be in navigation order
      onKeyUp: function( event ) {
        if ( event.keyCode === KEY_SPACE ) {

          // release the balloon and set focus to button
          self.releaseBalloon();
          accessibleButtonNode.focus();
        }
      },
      onTab: function( event ) {

        // if the user presses 'tab' we want the focus to go to the next element in the
        // navigation order, and then we want the screen reader to anounce something specific
        // the balloon should also be released from dragging
        if ( event.shiftKey ) {

          // if shift key is down, focus the previous element in the navigation order
          self.accessibleDragNode.getPreviousFocusable().focus();
        }
        else {

          // focus the nest element in the navigation order
          self.accessibleDragNode.getNextFocusable().focus();
        }

        self.releaseBalloon();
      },
      ariaDescribedBy: this.getDescriptionElementID(),
      ariaLabelledBy: this.getLabelElementID()
    } );

    this.accessibleDragNode.keyUpEmitter.addListener( function( keyCode ) {
      if ( self.accessibleDragNode.draggableKeyUp( keyCode ) ) {
        // on the next animation frame (after balloon has moved and picked up all charges)
        // announce the interaction in an alert
        model.announceInteraction = true;
      }
    } );

    // when an interaction has ended, update the user with the results through an assertive alert  
    model.interactionEndEmitter.addListener( function() {
      AriaHerald.announceAssertive( model.balloonDescriber.getDraggingDescription( model.locationProperty.get(), model.oldLocation ) );
    } );

    this.accessibleDragNode.balloonJumpingEmitter.addListener( function( keyCode ) {
      AriaHerald.announceAssertive( model.balloonDescriber.getJumpingDescription( self.model, keyCode ) );
    } );

    var accessibleButtonNode = new AccessibleNode( {
      tagName: 'button', // representative type
      parentContainerTagName: 'div', // contains representative element, label, and description
      focusHighlight: focusHighlightNode,
      label: balloonButtonLabel,
      descriptionTagName: 'p',
      focusable: true,
      description: BASEA11yStrings.balloonGrabCueString,
      events: {
        click: function( event ) {
          model.isDraggedProperty.set( true );

          // grab and focus the draggable element
          self.accessibleDragNode.focus();

          // reset the velocity when picked up
          model.velocityProperty.set( new Vector2( 0, 0 ) );
        }
      }
    } );

    this.addChild( accessibleButtonNode );
    this.addChild( self.accessibleDragNode );

    // the balloon is hidden from AT when invisible, and an alert is announced to let the user know
    model.isVisibleProperty.lazyLink( function( isVisible ) {
      self.setHidden( !isVisible );

      var alertDescription = isVisible ? BASEA11yStrings.greenBalloonAddedString : BASEA11yStrings.greenBalloonRemovedString;
      AriaHerald.announceAssertive( alertDescription );
    } );

    // the focus highlight changes color when grabbed
    model.isDraggedProperty.link( function( isDragged ) {
      focusHighlightNode.stroke = isDragged ? GRABBED_FOCUS_HIGHLIGHT_COLOR : DROPPED_FOCUS_HIGHLIGHT_COLOR;

      // when the balloon is no longer being dragged, it should be removed from the focus order
      self.accessibleDragNode.setFocusable( isDragged );

      // the button node must be hidden first
      accessibleButtonNode.setHidden( isDragged );
      self.accessibleDragNode.setHidden( !isDragged );

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
      // tetherShape = new Shape();
      // tetherShape.moveTo( model.width / 2, model.height - 2 );
      // tetherShape.lineTo( 440 - model.location.x + model.width / 2, 50 + globalModel.height - model.location.y );
      // path.shape = tetherShape;

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
      self.accessibleDragNode.setDragBounds( balloonDragBounds );

      // get a description for the changing balloon in case it moves when the wall is made invisible
      // should only be announced if the balloon had a charge, was touching the wall, and the wall is 
      // made invisible
      if ( model.chargeProperty.get() < 0 && !isVisible && model.touchingWall() ) {
        var balloonDescription = model.balloonDescriber.getWallRemovedDescription( !isVisible );
        AriaHerald.announceAssertive( balloonDescription );
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
      this.accessibleDragNode.step( dt );
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
      AriaHerald.announcePolite( releaseDescription );
    }
  } );
} );
