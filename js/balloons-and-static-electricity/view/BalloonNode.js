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
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Range = require( 'DOT/Range' );
  var AriaHerald = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AriaHerald' );
  var StringMaps = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/StringMaps' );
  var BalloonModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonModel' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // constants
  var DROPPED_FOCUS_HIGHLIGHT_COLOR = 'rgba( 250, 40, 135, 0.9 )';
  var GRABBED_FOCUS_HIGHLIGHT_COLOR = 'black';

  // strings
  var balloonGrabCueString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloonGrabCue' );
  var grabPatternString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/grabPattern' );
  var greenBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloon.label' );
  var yellowBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/yellowBalloon.label' );

  var wallString = 'wall';
  var sweaterString = 'sweater';
  var balloonReleasedPatternString = 'Balloon released. Moved {0} to {1}.';
  var balloonReleasedNoChangePatternString = 'Balloon Released. {0}';
  var noChangeInPositionOrChargeString = 'No change in position.  No change in charge.';
  var greenBalloonRemovedString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloonRemoved' );
  var greenBalloonAddedString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloonAdded' );

  // 0 - loction of balloon on sweater
  // 1 - discoverability cue for where additional charges can be found.
  // var noChargesPickedUpStringPattern = 'No change in charges. {0}. {1}';
  var morePairsOfChargesStringPattern = 'More pairs of charges {0}';

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
  function BalloonNode( x, y, model, imgsrc, globalModel, balloonColor ) {
    var self = this;

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

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
    model.chargeProperty.link( function updateLocation( chargeVal ) {
      if ( chargeVal ) {
        model.minusCharges[ model.plusCharges.length - 1 - chargeVal ].view.visible = true;
      }
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

    // a flag to track whether or not a charge was picked up for dragging
    self.draggableNode = new AccessibleDragNode( balloonImageNode.bounds, model.locationProperty, {
      parentContainerType: 'div',
      focusHighlight: focusHighlightNode,
      focusable: false, // this is only focusable by pressing the button, should not be in navigation order
      hidden: !model.isVisible,
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
        }
      ],
      onKeyUp: function() {
        // on key up, we want the user to receive information about the drag interaction

        // if no charges were picked up, anounce a description that describes no change, position of balloon, and
        // where additional charges are
        if ( !self.model.chargePickedUpInDrag && self.model.onSweater() ) {
          var balloonPositionString = self.getPositionOnSweaterDescription();
          var moreChargesString = self.getChargePositionCue();

          var combinedDescriptionPattern = '{0}. {1}';
          self.ariaHerald.announceAssertive( StringUtils.format( combinedDescriptionPattern, balloonPositionString, moreChargesString ) );
        }

        // reset flag for tracking successful charge pickup
        self.model.chargePickedUpInDrag = false;
      },
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
      }
    } );

    // this node will contain the 'Grab Balloon' button
    var balloonLabel;
    if ( balloonColor === 'green' ) {
      balloonLabel = StringUtils.format( grabPatternString, greenBalloonLabelString );
    }
    else {
      balloonLabel = StringUtils.format( grabPatternString, yellowBalloonLabelString );
    }

    var accessibleButtonNode = new AccessibleNode( balloonImageNode.bounds, {
      tagName: 'button', // representative type
      parentContainerType: 'div', // contains representative element, label, and description
      focusHighlight: focusHighlightNode,
      label: balloonLabel,
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
      ],
      hidden: !model.isVisible
    } );

    this.addChild( accessibleButtonNode );
    this.addChild( self.draggableNode );

    // the balloon is hidden from AT when invisible, and an alert is announced to let the user know
    model.isVisibleProperty.lazyLink( function( isVisible ) {
      self.draggableNode.setHidden( !isVisible );
      accessibleButtonNode.setHidden( !isVisible );

      var alertDescription = isVisible ? greenBalloonAddedString : greenBalloonRemovedString;
      self.ariaHerald.announceAssertiveWithAlert( alertDescription );
    } );

    // the focus highlight changes color when grabbed
    model.isDraggedProperty.link( function( isDragged ) {
      focusHighlightNode.stroke = isDragged ? GRABBED_FOCUS_HIGHLIGHT_COLOR : DROPPED_FOCUS_HIGHLIGHT_COLOR;

      // when the balloon is no longer being dragged, it should be removed from the focus order
      self.draggableNode.setFocusable( isDragged );
    } );
  }

  balloonsAndStaticElectricity.register( 'BalloonNode', BalloonNode );

  return inherit( Node, BalloonNode, {

    getPositionOnSweaterDescription: function() {
      return 'On body of sweater';
    },

    getChargePositionCue: function() {

      if ( this.globalModel.sweater.charge < 57 ) {
        // get the closest charge that has not been picked up
        var closestCharge = this.model.getClosestCharge();
        var directionToCharge = this.model.getDirectionToCharge( closestCharge );

        var directionCueString = StringMaps.DIRECTION_MAP[ directionToCharge ];
        assert && assert( directionCueString, 'no direction found for nearest charge' );

        return StringUtils.format( morePairsOfChargesStringPattern, directionCueString );
      }
      else {
        return 'No more charges remaining on sweater.';
      }

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
     * Get a description of the balloon after it has been released.
     * This description id dependent on the position.
     * @return {string}
     */
    getReleaseDescription: function() {

      var descriptionString = '';
      if ( this.model.charge === 0 ) {
        // when the charge is zero, we want to hear the balloon Label, release position, no change in position,
        // no change in charges, button label

        descriptionString = StringUtils.format( balloonReleasedNoChangePatternString, noChangeInPositionOrChargeString );
      }
      else {
        // otherwise, we want to hear direction and speed of balloon movement.
        var velocityDescription = this.getVelocityDescription();

        // determine which object the balloon is moving toward
        var attractedObject = this.getAttractedObject();

        // put it together
        descriptionString = StringUtils.format( balloonReleasedPatternString, velocityDescription, attractedObject );
      }

      return descriptionString;
    },

    /**
     * Get a description of how quickly the balloon moves to another object in the play area
     * as a function of the charge.
     * @param  {number} charge
     * @return {string}
     */
    getVelocityDescription: function() {
      var velocityDescription = '';

      // map the charges to ranges
      var verySlowRange = new Range( 1, 14 );
      var slowRange = new Range( 15, 29 );
      var quickRange = new Range( 30, 44 );
      var veryQuickRange = new Range( 45, 57 );
      var absCharge = Math.abs( this.model.charge );

      if ( verySlowRange.contains( absCharge ) ) {
        velocityDescription = 'very slowly';
      }
      else if ( slowRange.contains( absCharge ) ) {
        velocityDescription = 'slowly';
      }
      else if ( quickRange.contains( absCharge ) ) {
        velocityDescription = 'quickly';
      }
      else if ( veryQuickRange.contains( absCharge ) ) {
        velocityDescription = 'very quickly';
      }
      return velocityDescription;
    },

    /**
     * Get the name of the object that the balloon is curently attracted to.
     *
     * @return {string}
     */
    getAttractedObject: function() {
      var force = BalloonModel.getTotalForce( this.globalModel, this.model );
      if ( force.x > 0 ) {
        return wallString;
      }
      else {
        return sweaterString;
      }
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
      var releaseDescription = this.getReleaseDescription();
      this.ariaHerald.announcePolite( releaseDescription );
    }
  } );
} );
