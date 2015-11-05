// Copyright 2002-2013, University of Colorado Boulder

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
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var DragListener = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/DragListener' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Input = require( 'SCENERY/input/Input' );

  function BalloonNode( x, y, model, imgsrc, globalModel ) {
    var self = this;

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

    this.x = x;
    this.y = y;

    this.accessibleId = this.id; // @private, for identifying the representation of this node in the accessibility tree.

    var startChargesNode = new Node( { pickable: false } );
    var addedChargesNode = new Node( { pickable: false } );

    var property = {

      //Set only to the legal positions in the frame
      set: function( location ) { model.location = globalModel.checkBalloonRestrictions( location, model.width, model.height ); },

      //Get the location of the model
      get: function() { return model.location; }
    };

    //When dragging, move the balloon
    var balloonDragHandler = new DragListener( property, {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function() {
        model.isDragged = true;
      },
      end: function() {
        model.isDragged = false;
        model.velocity = new Vector2( 0, 0 );
      },
      //Translate on drag events
      translate: function( args ) {
        //balloonDragHandler.endDrag();
        var newLocation = globalModel.checkBalloonRestrictions( args.position, model.width, model.height );
        model.location = newLocation;
      }
    } );

    this.addInputListener( balloonDragHandler );

    // add the Balloon image
    this.addChild( new Image( imgsrc ) );

    //rope
    //TODO: For performance, move this out of BalloonNode and into a separate layer ?
    var customShape = new Shape();
    customShape.moveTo( model.width / 2, model.height - 2 );
    customShape.lineTo( 440 - model.location.x + model.width / 2, 50 + globalModel.height - model.location.y );
    var path = new Path( customShape, {
      stroke: '#000000',
      lineWidth: 1,
      pickable: false
    } );
    this.addChild( path );

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
        model.minusCharges[ model.plusCharges.length - 1 - chargeVal - 1 ].view.visible = true;
      }
    } );

    //changes visual position
    model.locationProperty.link( function updateLocation( location ) {
      self.translation = location;
      customShape = new Shape();
      customShape.moveTo( model.width / 2, model.height - 2 );
      customShape.lineTo( 440 - model.location.x + model.width / 2, 50 + globalModel.height - model.location.y );
      path.shape = customShape;
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

    // outfit with accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        /*
         * The content should look like the following in the parallel DOM:
         * <div> </div> // TODO: Update once you know what this should be.
         */
        var domElement = document.createElement( 'div' );
        domElement.tabIndex = '0';
        domElement.setAttribute( 'aria-grabbed', 'false' );
        domElement.draggable = true;
        domElement.className = 'Balloon';
        domElement.hidden = !model.isVisible;
        domElement.id = self.accessibleId;

        // keyboard interaction sets the keyState object to track press and hold and multiple key presses
        domElement.addEventListener( 'keydown', function( event ) {

          // update the keyState object for keyboard interaction
          model.keyState[ event.keyCode || event.which ] = true;

          // if the user presses any of the arrow keys, immediately pick up the balloon for drag and drop
          if ( model.keyState[ Input.KEY_RIGHT_ARROW ] || model.keyState[ Input.KEY_LEFT_ARROW ] ||
               model.keyState[ Input.KEY_UP_ARROW ] || model.keyState[ Input.KEY_DOWN_ARROW ] ) {
            // pick up the balloon
            model.isDragged = true;
          }
        } );
        domElement.addEventListener( 'keyup', function( event ) {
          // update the keyState object for keyboard interaction
          model.keyState[ event.keyCode || event.which ] = false;
        } );


        return new AccessiblePeer( accessibleInstance, domElement );
      }
    };

    // TODO: it is starting to look like this kind of thing needs to be handled entirely by scenery
    model.isVisibleProperty.lazyLink( function( isVisible ) {
      var accessibleBalloonPeer = document.getElementById( self.accessibleId );
      accessibleBalloonPeer.hidden = !isVisible;
    } );

    model.view = this;
  }

  return inherit( Node, BalloonNode );
} );
