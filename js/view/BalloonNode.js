// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the Balloon of the model.
 *
 *
 @author Vasily Shakhov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var PlusChargeNode = require( 'view/PlusChargeNode' );
  var MinusChargeNode = require( 'view/MinusChargeNode' );
  var Vector2 = require( 'DOT/Vector2' );

  function BalloonNode( x, y, model, imgsrc, globalModel ) {
    var self = this;

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

    this.x = x;
    this.y = y;

    var startChargesNode = new Node();
    var addedChargesNode = new Node();

    //When dragging, move the balloon
    var balloonDragHandler = new SimpleDragHandler( {
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
    var customShape = new Shape();
    customShape.moveTo( model.width / 2, model.height - 2 );
    customShape.lineTo( 440 - model.location.x + model.width / 2, 50 + globalModel.height - model.location.y );
    var path = new Path( {
                           shape: customShape,
                           stroke: '#000000',
                           lineWidth: 1
                         } );
    this.addChild( path );

    // static charges
    for ( var i = 0; i < model.plusCharges.length; i++ ) {
      model.plusCharges[i].view = new PlusChargeNode( model.plusCharges[i].location );
      startChargesNode.addChild( model.plusCharges[i].view );

      model.minusCharges[i].view = new MinusChargeNode( model.minusCharges[i].location );
      startChargesNode.addChild( model.minusCharges[i].view );
    }

    //possible charges
    for ( i = model.plusCharges.length; i < model.minusCharges.length; i++ ) {
      model.minusCharges[i].view = new MinusChargeNode( model.minusCharges[i].location );
      model.minusCharges[i].view.visible = false;
      addedChargesNode.addChild( model.minusCharges[i].view );
    }

    this.addChild( startChargesNode );
    this.addChild( addedChargesNode );

    //if change charge, show more minus charges
    model.link( 'charge', function updateLocation( chargeVal ) {
      if ( chargeVal ) {
        model.minusCharges[model.plusCharges.length - 1 - chargeVal - 1].view.visible = true;
      }
    } );

    //changes visual position
    model.link( 'location', function updateLocation( location ) {
      self.translation = location;
      customShape = new Shape();
      customShape.moveTo( model.width / 2, model.height - 2 );
      customShape.lineTo( 440 - model.location.x + model.width / 2, 50 + globalModel.height - model.location.y );
      path.shape = customShape;
    } );

    //hides balloon
    model.link( 'isVisible', function updateVisibility( booleanValue ) {
      self.visible = booleanValue;
    } );

    //show charges based on showCharges property
    globalModel.link( 'showCharges', function updateChargesVisibilityOnBalloon( value ) {
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
  }

  inherit( Node, BalloonNode ); // prototype chaining

  return BalloonNode;
} );