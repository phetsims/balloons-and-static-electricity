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
  // var Path = require( 'SCENERY/nodes/Path' );
  // var Shape = require( 'KITE/Shape' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var AccessibleButtonNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleButtonNode' );
  var AccessibleDragNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleDragNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // strings
  var balloonGrabCueString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloonGrabCue' );

  function BalloonNode( x, y, model, imgsrc, globalModel ) {
    var self = this;

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

    this.x = x;
    this.y = y;

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
    // focus highlight nodes for each accessible representation of the balloon
    var lineWidth = 4 / balloonImageNode.transform.transformDelta2( Vector2.X_UNIT ).magnitude();
    this.buttonHightlightNode = new Rectangle( 0, 0, balloonImageNode.width, balloonImageNode.height, {
        lineWidth: lineWidth,
        stroke: 'rgba( 250, 40, 135, 0.9 )'
    } );

    this.applicationHighlightNode = new Rectangle( 0, 0, balloonImageNode.width, balloonImageNode.height, {
        lineWidth: lineWidth,
        stroke: 'black'
    } );

    // @private
    this.draggableNode = new AccessibleDragNode( model.locationProperty, {
      focusHighlight: this.applicationHighlightNode,
      label: '',
      description: ''
    } );

    // this node will contain the 'Grab Balloon' button
    var accessibleButtonNode = new AccessibleButtonNode( {
      focusHighlight: this.buttonHightlightNode,
      label:'',
      description: balloonGrabCueString,
      onClick: function() {
        model.isDragged = true;

        // grab and focus the element draggable element
        self.draggableNode.focus(); // implement this!

        // reset the velocity when picked up
        model.velocityProperty.set( new Vector2( 0, 0 ) );
      }
    } );
    this.addChild( accessibleButtonNode );
    this.addChild( this.draggableNode );
  }

  return inherit( Node, BalloonNode, {
    step: function( dt ) {
      this.draggableNode.step( dt );
    }
  } );
} );
