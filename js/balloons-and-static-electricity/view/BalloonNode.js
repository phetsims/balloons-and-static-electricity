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
  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Input = require( 'SCENERY/input/Input' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var KeyboardDragHandler = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/KeyboardDragHandler' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );
  var BalloonDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/BalloonDescriber' );
  var Line = require( 'SCENERY/nodes/Line' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );

  // constants
  var DROPPED_FOCUS_HIGHLIGHT_COLOR = 'rgba( 250, 40, 135, 0.9 )';
  var GRABBED_FOCUS_HIGHLIGHT_COLOR = 'black';

  // strings
  var balloonButtonHelpString = BASEA11yStrings.balloonButtonHelpString;
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

    var accessibleButtonLabel = StringUtils.fillIn( grabBalloonPatternString, {
      balloon: accessibleLabelString
    } );

    // a11y - a type that generates descriptions for the balloon 
    this.describer = new BalloonDescriber( globalModel, globalModel.wall, model );

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

    // create the balloon image, but don't add it just yet
    // as a child, the image node implements much of the accessilbe content
    var balloonImageNode = new Image( imgsrc, {
      tandem: tandem.createTandem( 'balloonImageNode' ),

      // a11y
      tagName: 'button',
      parentContainerTagName: 'div',
      accessibleLabel: accessibleButtonLabel,
      accessibleDescription: balloonButtonHelpString,
      focusHighlight: focusHighlightNode,
      focusable: true
    } );

    // @private - the drag handler needs to be updated in a step function, see KeyboardDragHandler for more
    // information
    this.keyboardDragHandler = new KeyboardDragHandler( model.locationProperty, {
      dragBounds: this.getDragBounds(),
      shiftKeyMultiplier: 0.25
    } );

    // add some jumping key functionality
    this.keyboardDragHandler.addHotkeyGroup( {
      keys: [ Input.KEY_J, Input.KEY_W ],
      callback: function() {
        model.locationProperty.set( new Vector2( 0, 0 ) );
      }
    } );
    
    var accessibleDropBalloon = function() {
      balloonImageNode.mutate( {
        tagName: 'button',
        accessibleLabel: accessibleButtonLabel,
        accessibleDescription: balloonButtonHelpString
      } );

      // remove the drag handler and pickup listener
      balloonImageNode.removeAccessibleInputListener( self.keyboardDragHandler );
      balloonImageNode.removeAccessibleInputListener( keyboardDropListener );

      // pick up again on 'enter' and 'spacebar'
      keyboardPickUpListener = balloonImageNode.addAccessibleInputListener( keyboardPickUpListener );

      endDragListener();
      self.keyboardDragHandler.reset();
    };


    // the ballooon can be dropped with enter, spacebar, and tab.  If with enter, we set a flag that prevents
    // the balloon from being picked up immediately again when the accessible content changes to a button and
    // the 'enter' key is still down.  
    var dropWithEnter = false;
    var keyboardDropListener = {
      keyup: function( event ) {
        if ( event.keyCode === Input.KEY_SPACE ) {
          accessibleDropBalloon();
          balloonImageNode.focus();
        }
      },
      keydown: function( event ) {
        if ( event.keyCode === Input.KEY_ENTER ) { dropWithEnter = true; }
        if ( event.keyCode === Input.KEY_ENTER || event.keyCode === Input.KEY_TAB ) {
          accessibleDropBalloon();
          balloonImageNode.focus();
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
          accessibleDescription: null,
          accessibleLabel: self.accessibleLabel
        } );
        balloonImageNode.removeAccessibleInputListener( keyboardPickUpListener );

        balloonImageNode.addAccessibleInputListener( self.keyboardDragHandler );
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

    //if change charge, show more minus charges
    model.chargeProperty.link( function updateCharge( chargeVal ) {
      var numVisibleMinusCharges = Math.abs( chargeVal );

      for ( var i = 0; i < addedNodes.length; i++ ) {
        addedNodes[ i ].visible = i < numVisibleMinusCharges;
      }
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

    if ( BalloonsAndStaticElectricityQueryParameters.showBalloonChargeCenter ) {
      var parentToLocalChargeCenter = this.parentToLocalPoint( model.getChargeCenter() );
      this.addChild( new Rectangle( 0, 0, 5, 5, { fill: 'green', center: parentToLocalChargeCenter } ) ); 
      this.addChild( new Line( -500, parentToLocalChargeCenter.y, 500, parentToLocalChargeCenter.y, { stroke: 'green' } ) );
    }
  }

  balloonsAndStaticElectricity.register( 'BalloonNode', BalloonNode );

  return inherit( Node, BalloonNode, {

    getPositionOnSweaterDescription: function() {
      return 'Please implement this function or delete.';
    },

    getDragBounds: function() {
      var modelBounds = this.globalModel.bounds;
      var balloonWidth = this.model.width;
      var balloonHeight = this.model.height;
      return new Bounds2( modelBounds.minX, modelBounds.minY, modelBounds.maxX - balloonWidth, modelBounds.maxY - balloonHeight );
    }
  } );
} );
