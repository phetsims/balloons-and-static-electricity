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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Range = require( 'DOT/Range' );

  // constants - to monitor the direction of dragging
  var UP = 'UP';
  var DOWN = 'DOWN';
  var LEFT = 'LEFT';
  var RIGHT = 'RIGHT';
  
  // strings
  var neutralString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/neutral' );
  var netNegativeString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/netNegative' );
  var noString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/no' );
  var aFewString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/aFew' );
  var severalString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/several' );
  var manyString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/many' );
  var balloonNavigationCuesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloon.navigationCues' );
  var grabPatternString = require ('string!BALLOONS_AND_STATIC_ELECTRICITY/grabPattern' );

  // constants
  var KEY_J = 74; // keycode for the 'j' key
  var KEY_H = 72; // keypress keycode for '?'

  function BalloonNode( x, y, model, imgsrc, globalModel, keyboardHelpDialog, options ) {
    var self = this;

    options = _.extend( {
      accessibleDescriptionPatternString: '',
      accessibleLabel: ''
    }, options );

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

    this.x = x;
    this.y = y;

    this.accessibleId = this.id; // @private, for identifying the representation of this node in the accessibility tree.
    this.initialGrab = true;

    var startChargesNode = new Node( { pickable: false } );
    var addedChargesNode = new Node( { pickable: false } );

    // flag for accessibility so that keyboard and mouse events can work together
    var mouseDown = false;

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

        mouseDown = true;

        // if there is mouse interaction, we need to change the content so the appropriate description is created
        self.accessibleContent = applicationContent;
        self.accessibleInstances[0].peer.domElement.focus();

      },
      endDrag: function() {
        mouseDown = false;
        model.isDragged = false;
        model.velocity = new Vector2( 0, 0 );

        // accessible content needs to be set to the button
        // dispose of the application content
        applicationContent.dispose();
        self.accessibleContent = buttonContent;
        self.accessibleInstances[0].peer.domElement.focus();

      }
    } );

    this.addInputListener( balloonDragHandler );

    // add the Balloon image
    var balloonImageNode = new Image( imgsrc );
    this.addChild( balloonImageNode );

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


    // create a unique node for the balloon's focus highlight so that the stroke can change when the balloon is being
    // dragged.
    // @private
    this.buttonHightlightNode = new Rectangle( 0, 0, balloonImageNode.width, balloonImageNode.height, {
        lineWidth: 4 / balloonImageNode.transform.transformDelta2( Vector2.X_UNIT ).magnitude(),
        stroke: 'rgba( 250, 40, 135, 0.9 )'
    } ); 

    this.applicationHighlightNode = new Rectangle( 0, 0, balloonImageNode.width, balloonImageNode.height, {
        lineWidth: 4 / balloonImageNode.transform.transformDelta2( Vector2.X_UNIT ).magnitude(),
        stroke: 'black'
    } ); 

    // initial accesible representation for balloon.  A 'button' that is pressed to begin interaction
    // once user decided to interact with balloon, it becomes a highly interactive 'application' div
    // releasing the balloon with spacebar or ctrl+enter will set content back accessible button representation
    var buttonContent = {
      focusHighlight: self.buttonHightlightNode,
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        var domElement = document.createElement( 'button' );
        var grabBalloonString = StringUtils.format( grabPatternString, options.accessibleLabel );
        domElement.innerText = grabBalloonString;
        domElement.id = 'balloon-button-' + uniqueId;

        // @private (a11y) - allow for lookup of element within view
        self.domElement = domElement;

        model.isVisibleProperty.link( function( isVisible ) {
          domElement.hidden = !isVisible;
        } );

        // self.focusHighlightNode.stroke = 'rgba( 250, 40, 135, 0.9 )';

        domElement.addEventListener( 'click', function() {
          self.accessibleContent = applicationContent;

          // reset the velocity when picked up
          model.velocityProperty.set( new Vector2( 0, 0 ) );

          model.isDragged = true;
          self.accessibleInstances[0].peer.domElement.focus();
        } );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    };
    this.accessibleContent = buttonContent;

    // outfit with accessible content.
    var applicationContent = {
      dispose: function() {
        // TODO: Lets test out this pattern for disposal!
        model.isVisibleProperty.unlink( this.visibleObserver );
        model.chargeProperty.unlink( this.chargeObserver );
        model.locationProperty.unlink( this.locationObserver );
      },

      focusHighlight: self.applicationHighlightNode,
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        // update the stroke of the focus highlight
        // self.focusHighlightNode.stroke = 'rgba(0, 0, 0, 0.9)';

        // create the element for the balloon, initialize its hidden state
        var domElement = document.createElement( 'div' );
        domElement.tabIndex = '0';
        domElement.setAttribute( 'role', 'application' );
        domElement.id = 'balloon-' + uniqueId;
        domElement.name = domElement.id;
        domElement.setAttribute( 'draggable', 'true' );
        domElement.setAttribute( 'aria-grabbed', 'true' );
        domElement.className = 'Balloon';
        domElement.hidden = !model.isVisible;

        // create the accessible label 
        var labelElement = document.createElement( 'h3' );
        labelElement.id = 'balloon-label-' + uniqueId;
        labelElement.textContent = options.accessibleLabel;
        domElement.setAttribute( 'aria-labelledby', labelElement.id );

        // create the accessible charge description
        var chargeDescriptionElement = document.createElement( 'p' );
        chargeDescriptionElement.setAttribute( 'aria-live', 'polite' );
        chargeDescriptionElement.id = 'balloon-description-' + uniqueId;
        chargeDescriptionElement.textContent = options.accessibleDescription;

        // create the accessible position description
        var locationDescriptionElement = document.createElement( 'p' );
        locationDescriptionElement.setAttribute( 'aria-live', 'polite' );
        locationDescriptionElement.id = 'position-descripton-' + uniqueId;
        locationDescriptionElement.hidden = true;
        // create a location description that is assertive, only updates when the balloon
        // is initially moved or changes directions
        var assertiveLocationDescriptionElement = document.createElement( 'p' );
        assertiveLocationDescriptionElement.setAttribute( 'aria-live', 'assertive' );
        assertiveLocationDescriptionElement.id = 'assertive-description-' + uniqueId;
        assertiveLocationDescriptionElement.hidden = true;

        var navigationDescriptionElement = document.createElement( 'p' );
        navigationDescriptionElement.id = 'navigation-description-' + uniqueId;
        navigationDescriptionElement.textContent = balloonNavigationCuesString;

        domElement.setAttribute( 'aria-describedby', chargeDescriptionElement.id + ' ' + navigationDescriptionElement.id + ' ' + locationDescriptionElement.id );

        domElement.appendChild( labelElement );
        domElement.appendChild( chargeDescriptionElement );
        domElement.appendChild( locationDescriptionElement );
        domElement.appendChild( navigationDescriptionElement );
        domElement.appendChild( assertiveLocationDescriptionElement );

        // build up the correct charge description based on the state of the model
        var createChargeDescription = function( charge ) {
          var chargeNeutralityDescriptionString = charge < 0 ? netNegativeString : neutralString;

          var chargeAmountString;
          if( charge === 0 ) {
            chargeAmountString = noString;
          }
          else if( charge >= -15 ) {
            chargeAmountString = aFewString;
          }
          else if( charge >= -40 && charge < -10 ) {
            chargeAmountString = severalString;
          }
          else if ( charge < -40 ) {
            chargeAmountString = manyString;
          }
          assert && assert( chargeAmountString, 'String charge amount description not defined.' );

          return StringUtils.format( options.accessibleDescriptionPatternString, chargeNeutralityDescriptionString, chargeAmountString );
        };

        /**
         * Create the description for the balloon.  The description is dependent on the state of the balloon,
         * its location, and whether it is focussed and grabbed.
         * 
         * @param  {Vector2}
         * @return {[type]}          [description]
         */
        var updateLocationDescriptions = function( location, oldLocation ) {
          // perspective 2 - focused and grabbed
          if ( document.activeElement === self.accessibleInstances[0].peer.domElement && model.isDragged ) {
            var assertiveText;
            var politeText;

            // TODO: should the model track this?
            self.draggingDirection = self.getDraggingDirection( location, oldLocation );

            // update assertive portion
            var objectString;
            var directionString;
            if ( self.draggingDirection === UP ) {
              directionString = 'up';
              objectString = 'top of play area';
            }
            else if ( self.draggingDirection === DOWN ) {
              directionString = 'down';
              objectString = 'bottom of play area';
            }
            else if ( self.draggingDirection === RIGHT ) {
              objectString = globalModel.wall.isVisible ? 'wall' : 'right of play area';
              directionString = 'right';
            }
            else if ( self.draggingDirection === LEFT ) {
              objectString = 'sweater';
              directionString = 'left';
            }

            var politeString;
            if ( self.draggingDirection === UP || self.draggingDirection === DOWN ) {
              var middleRange = new Range( 65, 150 );
              var upperRange = new Range( 0, 65 );
              var bottomRange = new Range( 235, 350 );
              politeString = middleRange.contains( location.y ) ? 'halfway ' :
                              upperRange.contains( location.y ) ? 'at very top of play area' :
                              bottomRange.contains( location.y ) ? 'at very bottom of play area' :
                              'closer';
            }
            else {
              // where is the balloon relative to other objects in the play area?
              var inSweaterRange = new Range( 0, 250 );
              var nearSweaterRange = new Range( 250, 350 );
              var middleXRange = new Range( 415, 460 );
              var atWallRange = new Range( 554, 650 );

              var rightEdgeString = globalModel.wall.isVisible ? 'at wall' : 'at edge of play area';

              politeString = inSweaterRange.contains( location.x ) ? 'on sweater.' :
                              atWallRange.contains( location.x ) ? rightEdgeString :
                              nearSweaterRange.contains( location.x ) ? 'at edge of sweater' :
                              middleXRange.contains( location.x ) ? 'halfway' :
                              'closer';
            }

            politeText = politeString;
            assertiveText = options.accessibleLabel + ', grabbed, moves ' + directionString + ' towards ' + objectString;

            // if this not is the first interaction with the balloon, add 'Now' to the beginning of the assertive string
            if ( !self.initialGrab ) {
              assertiveText = 'Now, ' + assertiveText;
            }
            self.initialGrab = false;

            // if there is assertive text, it should override the polite text
            locationDescriptionElement.textContent = politeText;
            assertiveLocationDescriptionElement.textContent = assertiveText;
          }
        };

        // whenever the model charge changes, update the accesible description
        // this needs to be unlinked when accessible content changes to prevent a memory leak
        this.chargeObserver = function( charge ) {
          chargeDescriptionElement.textContent = createChargeDescription( charge );
        };
        model.chargeProperty.lazyLink( this.chargeObserver );

        this.locationObserver = function( location, oldLocation ) {
          // only run through this function if necessary
          if ( !location.equals( oldLocation ) ) {
            updateLocationDescriptions( location, oldLocation );
          } 
        };
        model.locationProperty.lazyLink( this.locationObserver );

        // TODO: it is starting to look like this kind of thing needs to be handled entirely by scenery
        // this needs to be unlinked when accessible content changes to prevent a memory leak
        this.visibleObserver = function( isVisible ) {
          domElement.hidden = !isVisible;
        };
        model.isVisibleProperty.link( this.visibleObserver );

        // @private (a11y) - allow for lookup of element within view
        self.domElement = domElement;

        // keyboard interaction sets the keyState object to track press and hold and multiple key presses
        domElement.addEventListener( 'keydown', function( event ) {

          // update the keyState object for keyboard interaction
          model.keyState[ event.keyCode || event.which ] = true;

          // If the user presses j, enter jumping mode and pick the balloon up
          if ( model.keyState[ KEY_J ] ) {
            model.isJumping = true;
          }

          if ( model.keyState[ KEY_H ] ) {
            // blur the balloon immediately
            document.activeElement.blur();
          
            keyboardHelpDialog.activeElement = self.accessibleInstances[0].peer.domElement;
            keyboardHelpDialog.shownProperty.set( true );
          }
        } );

        domElement.addEventListener( 'keyup', function( event ) {
          // update the keyState object for keyboard interaction 
          model.keyState[ event.keyCode || event.which ] = false;

          // if the user presses spacebar, set accessible content back to button
          // this is done on key up so that model.keyState can be properly updated
          if ( event.keyCode === Input.KEY_SPACE ) {
            self.accessibleContent = buttonContent;
            model.isDragged = false;
            self.accessibleInstances[0].peer.domElement.focus();
          }
        } );

        // release the balloon when the user shifts focus
        var thisContent = this;

        domElement.addEventListener( 'blur', function( event ) {

          // reset the initialGrab variable
          self.initialGrab = true;

          if( !mouseDown ) {

          // if( !model.isDragged ) {

            // disose of the content to unlink the model events
            thisContent.dispose();

            // balloon has been released, it is no longer being dragged.  Reset the accessible content to the button 
            // and reset the keystate object
            model.keyState = {};
            self.accessibleContent = buttonContent;
            model.isDraggedProperty.set( false );

          }
        } );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    };
    
    model.view = this;
  }

  return inherit( Node, BalloonNode, {

    /**
     * Get the direction of dragging.  TODO: Do we need to handle diagonal dragging?
     * 
     * @param  {} location
     * @param  {} oldLocations
     * @return {string}
     */
    getDraggingDirection: function( location, oldLocation ) {

      var deltaX = location.x - oldLocation.x;
      var deltaY = location.y - oldLocation.y;

      if ( deltaX > 0 ) {
        return RIGHT;
      }
      else if ( deltaX < 0 ) {
        return LEFT;
      }
      else if ( deltaY < 0 ) {
        return UP;
      }
      else if ( deltaY > 0 ) {
        return DOWN;
      }
      else {
        assert && assert( 'case not supported in getDraggingDirection' );
      }
    }
  } );
} );
