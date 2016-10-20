// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a balloon.
 * Balloon can have charge, position and velocity.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var BalloonLocationEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonLocationEnum' );
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var BalloonDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/BalloonDescriber' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  var NEAR_SWEATER_DISTANCE = 25;

  /**
   * Constructor
   * @param {number} x
   * @param {number} y
   * @param {BalloonsAndStaticElectricityModel} balloonsAndStaticElectricityModel - ensure balloon is in valid position in model coordinates
   * @param {boolean} defaultVisibility - is the balloon visible by default?
   * @param {string} labelString - label for the balloon
   * @constructor
   */
  function BalloonModel( x, y, balloonsAndStaticElectricityModel, defaultVisibility, labelString ) {
    PropertySet.call( this, {
      charge: 0,
      velocity: 0,
      isVisible: true,
      isDragged: false,
      width: 134,
      height: 222,
      location: new Vector2( 0, 0 ),
      isStopped: false,
      dragVelocity: new Vector2( 0, 0 ), // velocity when dragging

      //Speed the balloon must be dragged at to pick up charges, see https://github.com/phetsims/balloons-and-static-electricity/issues/28
      thresholdSpeed: 0.025,

      //positions of caught minus charges on balloon
      // each new minus charge appears at positions[charge-1] coords
      //should be at left side of balloon and look like java model
      positions: [
        [ 14, 70 ],
        [ 18, 60 ],
        [ 14, 90 ],
        [ 24, 130 ],
        [ 22, 120 ],
        [ 14, 79 ],
        [ 22, 120 ],
        [ 18, 108 ],
        [ 19, 50 ],
        [ 44, 150 ],
        [ 16, 100 ],
        [ 20, 80 ],
        [ 50, 160 ],
        [ 34, 140 ],
        [ 50, 20 ],
        [ 30, 30 ],
        [ 22, 72 ],
        [ 24, 105 ],
        [ 20, 110 ],
        [ 40, 150 ],
        [ 26, 110 ],
        [ 30, 115 ],
        [ 24, 87 ],
        [ 24, 60 ],
        [ 24, 40 ],
        [ 38, 24 ],
        [ 30, 80 ],
        [ 30, 50 ],
        [ 34, 82 ],
        [ 32, 130 ],
        [ 30, 108 ],
        [ 30, 50 ],
        [ 40, 94 ],
        [ 30, 100 ],
        [ 35, 90 ],
        [ 24, 95 ],
        [ 34, 100 ],
        [ 35, 40 ],
        [ 30, 60 ],
        [ 32, 72 ],
        [ 30, 105 ],
        [ 34, 140 ],
        [ 30, 120 ],
        [ 30, 130 ],
        [ 30, 85 ],
        [ 34, 77 ],
        [ 35, 90 ],
        [ 40, 85 ],
        [ 34, 90 ],
        [ 35, 50 ],
        [ 46, 34 ],
        [ 32, 72 ],
        [ 30, 105 ],
        [ 34, 140 ],
        [ 34, 120 ],
        [ 30, 60 ],
        [ 30, 85 ],
        [ 34, 77 ]
      ],
      //positions of neutral atoms on balloon, don't change during simulation
      positionsOfStartCharges: [
        [ 44, 50 ],
        [ 88, 50 ],
        [ 44, 140 ],
        [ 88, 140 ]
      ]
    } );

    var self = this;

    // @public (read-only)- track when a charge is picked up so we can describe when a charge is and is not
    // picked up.
    this.chargePickedUpInDrag = false;

    this.location = new Vector2( x, y );
    this.initialLocation = this.location.copy();
    this.defaultVisibily = defaultVisibility;
    this.plusCharges = [];
    this.minusCharges = [];
    this.balloonsAndStaticElectricityModel = balloonsAndStaticElectricityModel; // @private
    this.direction = ''; // the direction of movement of the balloon

    // a label for the balloon, not the acccessible label but one of BalloonColorsEnum
    this.balloonLabel = labelString;

    //neutral pair of charges
    this.positionsOfStartCharges.forEach( function( entry ) {
      //plus
      var plusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ] );
      self.plusCharges.push( plusCharge );

      //minus
      var minusCharge = new PointChargeModel( entry[ 0 ] + PointChargeModel.radius, entry[ 1 ] + PointChargeModel.radius );
      self.minusCharges.push( minusCharge );
    } );

    //charges that we can get from sweater
    this.positions.forEach( function( entry ) {
      //minus
      var minusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ] );
      self.minusCharges.push( minusCharge );
    } );

    // Track key presses in a keyState object for accessibility.
    // TODO: This should eventually be internal.  It seems all keyboard interaction should use such an object.
    // this.keyState = {};

    // model bounds, updated when position changes
    this.bounds = new Bounds2( this.location.x, this.location.y, this.location.x + this.width, this.location.y + this.height );
    this.locationProperty.link( function( location ) {
      self.bounds.setMinMax( location.x, location.y, location.x + self.width, location.y + self.height );
    } );

    // a11y - describes the balloon based on its model properties
    this.balloonDescriber = new BalloonDescriber( balloonsAndStaticElectricityModel, balloonsAndStaticElectricityModel.wall, this );

    this.reset();

  }

  balloonsAndStaticElectricity.register( 'BalloonModel', BalloonModel );

  inherit( PropertySet, BalloonModel, {

    /**
     * If the balloon is in the upper half of the play area, return true.
     *
     * @return {boolean}
     */
    inUpperHalfOfPlayArea: function() {
      if ( this.getCenter().y < this.balloonsAndStaticElectricityModel.playArea.lowerRow.top ) {
        return true;
      }
      else {
        return false;
      }
    },

    /**
     * Return true if the balloon is near the wall without touching it.
     *
     * @return {boolean}
     */
    nearWall: function() {
      var model = this.balloonsAndStaticElectricityModel;
      return ( this.getCenter().x > model.playArea.atNearWall && this.getCenter().x < model.playArea.atWall );
    },

    inUpperRightOfPlayArea: function() {
      var locationBounds = this.balloonsAndStaticElectricityModel.playArea.getPointBounds( this.getCenter() );

      if ( locationBounds === BalloonLocationEnum.TOP_RIGHT_PLAY_AREA || BalloonLocationEnum.UPPER_RIGHT_PLAY_AREA ) {
        return true;
      }
      else {
        return false;
      }
    },

    /**
     * findClosestCharge - description
     *
     * @return {type}  description
     */
    getClosestCharge: function() {
      // find the closest charge to the balloon that has not yet been picked up
      var sweater = this.balloonsAndStaticElectricityModel.sweater;

      // the closest charge is described relative to the center of this rectangle
      // which is what is used to pick up charges
      var balloonLocation = this.locationProperty.get();
      var x1 = balloonLocation.x - 5;
      var x2 = balloonLocation.x + 50;
      var y1 = balloonLocation.y - 10;
      var y2 = balloonLocation.y + this.height + 10;
      var centerX = ( x1 + x2 ) / 2;
      var centerY = ( y1 + y2 ) / 2;

      // loop through the charges to find the next closest one
      var difference = new Vector2( 0, 0 ); // allocated once to avoid burden to memory
      var minDistance = Number.POSITIVE_INFINITY;
      var closestCharge;
      for ( var i = 0; i < sweater.minusCharges.length; i++ ) {

        var charge = sweater.minusCharges[ i ];

        // if the charge has been moved already, skip it
        if ( charge.moved ) {
          continue;
        }

        var distX = charge.location.x - centerX;
        var distY = charge.location.y - centerY;
        difference.setXY( distX, distY );

        if ( difference.magnitude() < minDistance ) {
          minDistance = difference.magnitude();
          closestCharge = charge;
        }
      }

      assert && assert( closestCharge, 'Tried to find closest charge when no more charges remain on sweater.' );
      return closestCharge;
    },

    /**
     * Center of a rectangular area that defines the bounds of the balloon
     * that must drag acrosss the sweater to pick up a charge.
     * 
     * @return {Vector2}
     */
    getDraggingCenter: function() {
      var balloonLocation = this.locationProperty.get();
      var x1 = balloonLocation.x - 5;
      var x2 = balloonLocation.x + 50;
      var y1 = balloonLocation.y - 10;
      var y2 = balloonLocation.y + this.height + 10;

      var centerX = balloonLocation.x + ( ( x2 - x1 ) / 2 );
      var centerY = balloonLocation.y + ( ( y2 - y1 ) / 2 );

      return new Vector2( centerX, centerY );
    },

    /**
     * Get a direction from the balloon center to the charge.
     *
     * @param  {type} chargeModel description
     * @return {type}             description
     */
    getDirectionToCharge: function( chargeModel ) {
      var difference = chargeModel.location.minus( this.getDraggingCenter() );

      var diffX = difference.x;
      var diffY = difference.y;

      // direction string to be returned
      var direction;
      if ( diffX > 0 && diffY > 0 ) {
        // charge is up and to the right
        direction = BalloonDirectionEnum.DOWN_RIGHT;
      }
      else if ( diffX > 0 && diffY < 0 ) {
        // charge is down and to the right
        direction = BalloonDirectionEnum.UP_RIGHT;
      }
      else if ( diffX < 0 && diffY > 0 ) {
        // charge is up and to the left
        direction = BalloonDirectionEnum.DOWN_LEFT;
      }
      else if ( diffX < 0 && diffY < 0 ) {
        // charge is down and to the lefts
        direction = BalloonDirectionEnum.UP_LEFT;
      }


      assert && assert( direction, 'A direction must be defined' );
      return direction;

    },

    /**
     * Determine if the balloon is on the sweater.  The balloon is considered to be rubbing on the sweater
     * if its left edge is inside the right edge of the sweater bounds.
     *
     * @return {type}  description
     */
    onSweater: function() {
      var sweaterBounds = this.balloonsAndStaticElectricityModel.sweater.bounds;
      if ( sweaterBounds.eroded( 0 ).intersectsBounds( this.bounds ) ) {
        return true;
      }
      else { return false; }
    },

    centerInSweater: function() {
      var sweaterBounds = this.balloonsAndStaticElectricityModel.sweater.bounds;
      return this.getCenter().x < sweaterBounds.maxX; 
    },

    /**
     * If the balloon is near the sweater, return true.  Considered near the sweater when 
     * within NEAR_SWEATER_DISTANCE from touching the sweater.
     * @return {boolean}
     */
    nearSweater: function() {
      var minX = this.balloonsAndStaticElectricityModel.playArea.atNearSweater;
      var maxX = minX + NEAR_SWEATER_DISTANCE;

      return ( minX < this.getCenter().x && this.getCenter().x < maxX );
    },

    /**
     * Returns true if the balloon is touching the wall
     * 
     * @return {boolean}
     */
    touchingWall: function() {
      return ( this.getCenter().x === this.balloonsAndStaticElectricityModel.playArea.atWall );
    },

    getDistanceToWall: function() {
      return this.getCenter().x - this.balloonsAndStaticElectricityModel.playArea.atWall;
    },

    //get center of Balloon
    getCenter: function() {
      return new Vector2( this.location.x + this.width / 2, this.location.y + this.height / 2 );
    },
    //reset balloon to initial state
    reset: function( notResetVisibility ) {
      //array of instantaneous velocity of balloon last 5 ticks
      //then we calculate average velocity and compares it with threshold velocity to check if we catch minus charge from sweater
      this.xVelocityArray = [ 0, 0, 0, 0, 0 ];
      this.xVelocityArray.counter = 0;
      this.yVelocityArray = [ 0, 0, 0, 0, 0 ];
      this.yVelocityArray.counter = 0;
      this.charge = 0;
      this.velocity = new Vector2( 0, 0 );
      this.location = this.initialLocation.copy();

      for ( var i = this.plusCharges.length; i < this.minusCharges.length; i++ ) {
        if ( this.minusCharges[ i ].view ) {
          this.minusCharges[ i ].view.visible = false;
        }
      }
      if ( !notResetVisibility ) {
        this.isVisible = this.defaultVisibily;
      }
      this.isDragged = false;

      // reset the accessible describer
      this.balloonDescriber.reset();
    },
    step: function( model, dt ) {
      if ( dt > 0 ) {

        // if ( this.isJumping ) {
        //   var halfWidth = this.width / 2;
        //   var balloonYValue = this.locationProperty.value.y;
        //   var jumpingKey;

        //   // determine where the user wants the balloon to go based on the next key press
        //   // If location is defined by the press, exit jumping mode
        //   if( this.keyState[ KEY_W ] ) {
        //     // Move the balloon over to the wall
        //     this.locationProperty.set( new Vector2( model.playArea.atWall - halfWidth, balloonYValue ) );
        //     jumpingKey = KEY_W;
        //   }
        //   if( this.keyState[ KEY_S ] ) {
        //     // move the balloon over to the edge of the sweater
        //     this.locationProperty.set( new Vector2( model.playArea.atNearSweater - halfWidth, balloonYValue ) );
        //     jumpingKey = KEY_S;
        //   }
        //   if( this.keyState[ KEY_C ] ) {
        //     // move the balloon back to its initial x location
        //     this.locationProperty.set( new Vector2( model.playArea.atCenter - halfWidth, balloonYValue ) );
        //     jumpingKey = KEY_C;
        //   }
        //   if( this.keyState[ KEY_N ] ) {
        //     // move the balloon close to the wall, but not touching it
        //     this.locationProperty.set( new Vector2( model.playArea.atNearWall - halfWidth, balloonYValue ) );
        //     jumpingKey = KEY_N;
        //   }

        //   // as soon as the jumping key is up, stop jumping
        //   if ( !this.keyState[ jumpingKey ] ) {
        //     this.isJumping = false;
        //   }
        // }

        if ( this.isDragged ) {

        //   // determine if the user wants to move the balloon quickly or slowly by pressing 'shift'
        //   var positionDelta = 7;
        //   if ( this.keyState[ Input.KEY_SHIFT ] ) {
        //     positionDelta = 15;
        //   }

        //   var deltaX = 0;
        //   var deltaY = 0;

        //   // Temporarily replace arrow keys for WASD keys, see
        //   // https://github.com/phetsims/balloons-and-static-electricity/issues/108

        //   // handle balloon position changes due to keyboard navigation
        //   // if the user presses any arrow key, pick it up immediately
        //   // if ( this.keyState[ Input.KEY_LEFT_ARROW ] ) {
        //   //   deltaX = -positionDelta;
        //   // }
        //   // if ( this.keyState[ Input.KEY_RIGHT_ARROW ] ) {
        //   //   deltaX = +positionDelta;
        //   // }
        //   // if ( this.keyState[ Input.KEY_UP_ARROW ] ) {
        //   //   deltaY = -positionDelta;
        //   // }
        //   // if ( this.keyState[ Input.KEY_DOWN_ARROW ] ) {
        //   //   deltaY = +positionDelta;
        //   // }
        //   if ( this.keyState[ KEY_A ] ) {
        //     deltaX = -positionDelta;
        //   }
        //   if ( this.keyState[ KEY_D ] ) {
        //     deltaX = +positionDelta;
        //   }
        //   if ( this.keyState[ KEY_W ] ) {
        //     deltaY = -positionDelta;
        //   }
        //   if ( this.keyState[ KEY_S ] ) {
        //     deltaY = +positionDelta;
        //   }

        //   // set the new location from keyboard deltas, checking to make sure that the balloon is in a valid position
        //   var newLocation = this.locationProperty.value.plusXY( deltaX, deltaY );
        //   if ( newLocation !== this.locationProperty.value ) {
        //     newLocation = this.balloonsAndStaticElectricityModel.checkBalloonRestrictions( newLocation, this.width, this.height );
        //     this.locationProperty.set( newLocation );
        //   }

        //   // if the user presses shift + enter, release the balloon to observe the force of charges
        //   if ( this.keyState[ Input.KEY_SPACE ] ) {
        //     this.isDragged = false;
        //   }

          // check to see if we can catch any minus charges
          var chargePickedUp = this.dragBalloon( model, dt );

          if ( chargePickedUp ) {
            this.chargePickedUpInDrag = true;
          }
        }
        else {
          BalloonModel.applyForce( model, this, dt );
        }
      }
      this.oldLocation = this.location.copy();
    },

    /**
     * When balloon is dragged, check to see if we catch a minus charge.  Returns a boolean
     * that indicates whether or not a charge was picked up.
     *
     * @param  {BalloonsAndStaticElectricityModel} model
     * @param  {number} dt
     * @return {boolean} chargeFound
     */
    dragBalloon: function( model, dt ) {

      // Prevent a fuzzer error that tries to drag the balloon before step is called.
      if ( !this.oldLocation ) {
        return;
      }
      var dx = (this.location.x - this.oldLocation.x) / dt;
      var dy = (this.location.y - this.oldLocation.y) / dt;

      //calculate average velocity
      this.xVelocityArray[ this.xVelocityArray.counter++ ] = dx * dx;
      this.xVelocityArray.counter %= 5;
      this.yVelocityArray[ this.yVelocityArray.counter++ ] = dy * dy;
      this.yVelocityArray.counter %= 5;

      var averageX = 0;
      var averageY = 0;
      for ( var i = 0; i < 5; i++ ) {
        averageX += this.xVelocityArray[ 0 ];
        averageY += this.yVelocityArray[ 0 ];
      }
      averageX /= 5;
      averageY /= 5;

      //if average speed larger than thresholdSpeed - we try to move minus charges from sweater to balloon
      var speed = Math.sqrt( averageX * averageX + averageY * averageY );

      this.dragSpeed = speed;
      this.dragVelocityProperty.set( new Vector2( dx, dy ) );

      var chargeFound = false;
      if ( speed >= this.thresholdSpeed ) {
        chargeFound = model.sweater.findIntersection( this );
      }

      return chargeFound;
    },
    //force between sweater and balloon
    getSweaterForce: function( sweaterModel ) {
      var retValue = new Vector2();
      if ( this.location.x > sweaterModel.center.x ) {
        retValue = BalloonModel.getForce( sweaterModel.center, this.getCenter(), -BalloonModel.coeff * sweaterModel.charge * this.charge );
      }
      return retValue;
    },

    /**
     * Get the name of the object that the balloon is curently attracted to.
     *
     * @return {string}
     */
    getAttractedDirection: function() {
      var force = BalloonModel.getTotalForce( this.balloonsAndStaticElectricityModel, this );
      if ( force.x > 0 ) {
        return BalloonDirectionEnum.RIGHT;
      }
      else {
        return BalloonDirectionEnum.LEFT;
      }
    },

    /**
     * Get the object that the balloon is touching.  If the balloon is in free space, return null.
     *
     * @return {type}  description
     */
    getBoundaryObject: function() {
      var playArea = this.balloonsAndStaticElectricityModel.playArea;
      var balloonCenter = this.getCenter();
      var centerX = balloonCenter.x;
      if ( !this.balloonsAndStaticElectricityModel.wall.isVisible && centerX === playArea.atRightEdgeOfPlayArea ) {
        return BalloonLocationEnum.RIGHT_EDGE;
      }
      else if ( playArea.leftColumn.containsPoint( balloonCenter ) ) {
        return BalloonLocationEnum.LEFT_EDGE;
      }
      else if ( playArea.topRow.containsPoint( balloonCenter ) ) {
        return BalloonLocationEnum.TOP_EDGE;
      }
      else if ( playArea.bottomRow.containsPoint( balloonCenter ) ) {
        return BalloonLocationEnum.BOTTOM_EDGE;
      }
      else if ( playArea.rightArmColumn.containsPoint( balloonCenter ) && this.direction === BalloonDirectionEnum.LEFT ) {
        // only announce that we are on the sweater if we are moving left
        return BalloonLocationEnum.ON_SWEATER;
      }
      else if ( playArea.atWall === centerX && this.balloonsAndStaticElectricityModel.wall.isVisible ) {
        return BalloonLocationEnum.AT_WALL;
      }
      else {
        return null;
      }
    }
  } );

  {
    //force between two objects with positions p1 and p2, kqq - coefficient, F = kqq / (distance^power)
    BalloonModel.getForce = function( p1, p2, kqq, power ) {
      power = power || 2;
      var diff = p1.minus( p2 );
      var r = diff.magnitude();
      if ( r === 0 ) {
        return new Vector2( 0, 0 );
      }
      var fa = diff.timesScalar( kqq / ( Math.pow( r, power + 1 ) ) );
      return fa;
    };

    //force between two balloons
    BalloonModel.getOtherForce = function( balloonModel ) {
      if ( balloonModel.isDragged || !balloonModel.isVisible || !balloonModel.other.isVisible ) {
        return new Vector2( 0, 0 );
      }
      var kqq = BalloonModel.coeff * balloonModel.charge * balloonModel.other.charge;
      return BalloonModel.getForce( balloonModel.getCenter(), balloonModel.other.getCenter(), kqq );
    };
    //sum of all forces applying to balloons
    BalloonModel.getTotalForce = function( model, balloonModel ) {
      if ( model.wall.isVisible ) {
        var distFromWall = model.wall.x - balloonModel.location.x;
        //if balloon have enough charge and close enough to wall, wall attracts it more than sweater
        if ( balloonModel.charge < -5 ) {
          var relDist = distFromWall - balloonModel.width;
          var fright = 0.003;
          if ( relDist <= 40 + balloonModel.charge / 8 ) {
            return new Vector2( -fright * balloonModel.charge / 20.0, 0 );
          }
        }
      }

      var force = balloonModel.getSweaterForce( model.sweater );
      var other = BalloonModel.getOtherForce( balloonModel );
      var sumOfForces = force.plus( other );

      //Don't allow the force to be too high or the balloon can jump across the screen in 1 step, see #67
      var mag = sumOfForces.magnitude();
      var max = 1E-2;
      if ( mag > max ) {
        sumOfForces.normalize();
        sumOfForces.multiplyScalar( max );
      }
      return sumOfForces;
    };
    //applying force and move balloon to new coords each step
    BalloonModel.applyForce = function( model, balloonModel, dt ) {
      var rightBound = model.wall.isVisible ? model.bounds.maxX : model.bounds.maxX + model.wallWidth;

      var isStopped = false;

      var force = BalloonModel.getTotalForce( model, balloonModel );
      var newVelocity = balloonModel.velocity.add( force.timesScalar( dt ) );
      var newLocation = balloonModel.location.plus( balloonModel.velocity.timesScalar( dt ) );

      //if new position inside sweater, don't move it
      if ( newLocation.x + balloonModel.width < model.sweater.x + model.sweater.width ) {
        newVelocity = new Vector2();
        newLocation = balloonModel.location;
      }


      if ( newLocation.x + balloonModel.width > rightBound ) {
        isStopped = true;
        newLocation.x = rightBound - balloonModel.width;
      }

      if ( newLocation.y + balloonModel.height > model.bounds.maxY ) {
        isStopped = true;
        newLocation.y = model.bounds.maxY - balloonModel.height;
      }
      if ( newLocation.x < model.bounds.minX ) {
        isStopped = true;
        newLocation.x = model.bounds.minX;
      }
      if ( newLocation.y < model.bounds.minY ) {
        isStopped = true;
        newLocation.y = model.bounds.minY;
      }

      // once the balloon stops moving, notify observers that it has reached a resting
      // destination
      if ( !balloonModel.isStopped && ( balloonModel.location.equals( newLocation ) ) ) {
        balloonModel.isStoppedProperty.set( true );
      }

      balloonModel.velocity = newVelocity;
      balloonModel.location = newLocation;

      if ( isStopped ) {
        balloonModel.velocity = new Vector2( 0, 0 );
      }
    };
    BalloonModel.coeff = 0.1;
  }

  return BalloonModel;
} );
