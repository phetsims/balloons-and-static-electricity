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
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Input = require( 'SCENERY/input/Input' );

  // constants
  var KEY_J = 74; // the user can press J to go into a 'jump' mode for the balloon

  function BalloonNode( x, y, model, imgsrc, globalModel, options ) {
    var self = this;

    options = _.extend( {
      accessibleDescription: '',
      accessibleLabel: ''
    }, options );

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
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        //  content for the accessibility tree should look like
        //  <div id="balloon" aria-labelledby="balloon-label" aria-describedby="balloon-description" tabindex="0">
        //    <h3 id="balloon-label">Balloon</h3>
        //    <!-- Parts of the Balloon description change dynamically. Let's discuss this further. Multiple ids can be associated in aria-describedby. --> 
        //    <div id="balloon-description">
        //      <p id="balloon-charge">The balloon has a neutral charge, no more negative charges than positive ones.</p>
        //      <p id="balloon-position">Currently, positioned at equal distance between sweater and wall. The sweater is to the left and the wall is to the right. The top of the balloon is level with the chest area of the sweater.</p> 
        //      <p id="balloon-nav-help">Select any Arrow key to grab the balloon and start dragging. Select Tab for next item. Select K or question mark for keyboard help.</p>
        //    </div>
        //  </div>

        // create the element for the balloon, initialize its hidden state
        var domElement = document.createElement( 'button' );
        domElement.setAttribute( 'role', 'slider' );
        domElement.setAttribute( 'title', 'Balloon');
        domElement.id = 'balloon-' + uniqueId;
        // domElement.tabIndex = '0';
        domElement.draggable = true;
        // domElement.setAttribute( 'aria-grabbed', 'false' );
        domElement.className = 'Balloon';
        domElement.hidden = !model.isVisible;

        // create the accessible label
        var labelElement = document.createElement( 'h3' );
        labelElement.id = 'balloon-label-' + uniqueId;
        labelElement.textContent = options.accessibleLabel;        
        domElement.setAttribute( 'aria-labelledby', labelElement.id );

        // create a container for the accessible descriptions
        var descriptionElement = document.createElement( 'div' );
        descriptionElement.id = 'balloon-description-' + uniqueId;
        domElement.setAttribute( 'aria-describedby', descriptionElement.id );

        var descriptionParagraphElement = document.createElement( 'p' );
        descriptionParagraphElement.textContent = options.accessibleDescription;

        // structure the domElement and its accessible descriptions
        domElement.appendChild( labelElement );
        domElement.appendChild( descriptionElement );
        descriptionElement.appendChild( descriptionParagraphElement );


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
          else if ( model.keyState[ KEY_J ] ) {
            model.isJumping = true;
            model.isDragged = true;
          }
        } );
        domElement.addEventListener( 'keyup', function( event ) {
          // update the keyState object for keyboard interaction
          model.keyState[ event.keyCode || event.which ] = false;
        } );

        // TODO: it is starting to look like this kind of thing needs to be handled entirely by scenery
        model.isVisibleProperty.lazyLink( function( isVisible ) {
          var accessibleBalloonPeer = document.getElementById( domElement.id );
          accessibleBalloonPeer.hidden = !isVisible;
        } );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    };
    
    model.view = this;
  }

  return inherit( Node, BalloonNode );
} );
