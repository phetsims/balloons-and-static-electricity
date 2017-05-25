// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the Balloon of the model.
 *
 * The accessible content for the balloon looks like this for assistive technology:
 * <div>
 *   <h3>Yellow Balloon</h3>
 *   <p>Description of the balloon</p?
 *   <div>
 *     <button>Grab Yellow Balloon</button>
 *     <div role="application"></div>
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
  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Input = require( 'SCENERY/input/Input' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var KeyboardDragHandler = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/KeyboardDragHandler' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // constants
  var DROPPED_FOCUS_HIGHLIGHT_COLOR = 'rgba( 250, 40, 135, 0.9 )';
  var GRABBED_FOCUS_HIGHLIGHT_COLOR = 'black';

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
  function BalloonNode( x, y, model, imgsrc, globalModel, accessibleButtonLabel, tandem, options ) {
    var self = this;

    options = _.extend( {
      cursor: 'pointer',

      // a11y - this node will act as a container for more accessible content, its children will implement
      // the keyboard navigation
      parentContainerTagName: 'div',
      tagName: 'div',
      labelTagName: 'h3',
      prependLabels: true
    }, options );

    // super constructor
    Node.call( this, options );

    this.x = x;
    this.y = y;

    // @private
    this.model = model;
    this.globalModel = globalModel;

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
    // as a child, the image node implements much of the accessilbe content
    var balloonImageNode = new Image( imgsrc, {
      tandem: tandem.createTandem( 'balloonImageNode' ),

      // a11y
      tagName: 'button',
      accessibleLabel: accessibleButtonLabel,
      focusHighlight: focusHighlightNode,
      focusable: true
    } );

    // @private - the drag handler needs to be updated in a step function, see KeyboardDragHandler for more
    // information
    this.keyboardDragHandler = new KeyboardDragHandler( model.locationProperty, {
      dragBounds: this.getDragBounds(),
      shiftKeyMultiplier: 0.25
    } );

    // a flag that will prevent the balloon from being picked up again immediately after dropping with 'enter'
    // when dropped with 'enter', enter is still down on the balloon so a click event will be registered immediately
    var dropWithEnter = false;
    var keyboardDropListener = {
      keyup: function( event ) {
        if ( event.keyCode === Input.KEY_SPACE ) {
          balloonImageNode.mutate( {
            tagName: 'button',
            accessibleLabel: accessibleButtonLabel,
          } );

          // remove the drag handler and pickup listener
          balloonImageNode.removeAccessibleInputListener( self.keyboardDragHandler );
          balloonImageNode.removeAccessibleInputListener( keyboardDropListener );

          // pick up again on 'enter' and 'spacebar'
          keyboardPickUpListener = balloonImageNode.addAccessibleInputListener( keyboardPickUpListener );

          balloonImageNode.focus();
          model.isDraggedProperty.set( false );
        }
      },
      keydown: function( event ) {
        if ( event.keyCode === Input.KEY_ENTER ) {

          dropWithEnter = true;
          balloonImageNode.mutate( {
            tagName: 'button',
            accessibleLabel: accessibleButtonLabel,
          } );

          // remove the drag handler and pickup listener
          balloonImageNode.removeAccessibleInputListener( self.keyboardDragHandler );
          balloonImageNode.removeAccessibleInputListener( keyboardDropListener );

          // pick up again on 'enter' and 'spacebar'
          keyboardPickUpListener = balloonImageNode.addAccessibleInputListener( keyboardPickUpListener );

          balloonImageNode.focus();
          model.isDraggedProperty.set( false );
        }
      }
    };

    var keyboardPickUpListener = {
      click: function( event ) {

        // if we dropped the balloon with enter, refrain from picking up immediately - enter will be 'down' on
        // the dropped balloon and a click event will be triggered immediately
        if ( dropWithEnter ) {
          dropWithEnter = false;
          return;
        }

        balloonImageNode.mutate( {
          tagName: 'div',
          ariaRole: 'application',
          accessibleLabel: self.accessibleLabel
        } );
        balloonImageNode.removeAccessibleInputListener( keyboardPickUpListener );

        // drag handler
        balloonImageNode.addAccessibleInputListener( self.keyboardDragHandler );

        // drop the balloon on 'enter' and 'spacebar'
        keyboardDropListener = balloonImageNode.addAccessibleInputListener( keyboardDropListener );

        balloonImageNode.focus();
        model.isDraggedProperty.set( true );
      }
    };

    // when the button is clicked, the accessible content should change to 
    // the div with the ARIA application role
    keyboardPickUpListener = balloonImageNode.addAccessibleInputListener( keyboardPickUpListener );

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

    // update the drag bounds when wall visibility changes
    globalModel.wall.isVisibleProperty.link( function( isVisible ) {
      self.keyboardDragHandler.dragBounds = self.getDragBounds();
    } );

    //if change charge, show more minus charges and update the description
    model.chargeProperty.link( function updateCharge( chargeVal ) {
      var numVisibleMinusCharges = Math.abs( chargeVal );

      for ( var i = 0; i < addedNodes.length; i++ ) {
        addedNodes[ i ].visible = i < numVisibleMinusCharges;
      }

      // a11y
      var locationDescription = model.balloonDescriber.getDescription( model, model.isDraggedProperty.get() );
      self.setAccessibleDescription( locationDescription );
    } );

    // link the position of this node to the model
    model.locationProperty.link( function updateLocation( location ) {
      self.translation = location;
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
    var focusHighlightNode = new Rectangle( 0, 0, balloonImageNode.width, balloonImageNode.height, {
      lineWidth: 3,
      stroke: DROPPED_FOCUS_HIGHLIGHT_COLOR,
      tandem: tandem.createTandem( 'focusHighlightNode' )
    } );
    balloonImageNode.focusHighlight = focusHighlightNode;

    // the balloon is hidden from AT when invisible, and an alert is announced to let the user know
    model.isVisibleProperty.link( function( isVisible ) {
      self.setAccessibleHidden( !isVisible );
    } );

    model.isDraggedProperty.link( function( isDragged ) {
      focusHighlightNode.stroke = isDragged ? GRABBED_FOCUS_HIGHLIGHT_COLOR : DROPPED_FOCUS_HIGHLIGHT_COLOR;
    } );
  }

  balloonsAndStaticElectricity.register( 'BalloonNode', BalloonNode );

  return inherit( Node, BalloonNode, {

    getPositionOnSweaterDescription: function() {
      return 'Please implement this function or delete.';
    },

    /**
     * Release the balloon from a dragging state with the keyboard.  Calling this function
     * will set the model dragging property and anounce alert description.s
     *
     * @returns {type}  description
     */
    releaseBalloon: function() {

      // release the balloon
      this.model.isDraggedProperty.set( false );
    },

    getDragBounds: function() {
      var modelBounds = this.globalModel.bounds;
      var balloonWidth = this.model.width;
      var balloonHeight = this.model.height;
      return new Bounds2( modelBounds.minX, modelBounds.minY, modelBounds.maxX - balloonWidth, modelBounds.maxY - balloonHeight );
    }
  } );
} );
