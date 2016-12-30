// Copyright 2013-2015, University of Colorado Boulder

/**
 * Model of a balloon, which can have charge, position and velocity.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg(PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Emitter = require( 'AXON/Emitter' );
  var Range = require( 'DOT/Range' );
  var BalloonLocationEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonLocationEnum' );
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var BalloonDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/BalloonDescriber' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TVector2 = require( 'ifphetio!PHET_IO/types/dot/TVector2' );

  var NEAR_SWEATER_DISTANCE = 25;

  // collection of charge positions on the balloon
  // charges will appear in these positions as the balloon collects electrons
  var POSITIONS = [
    [ 14, 70 ],
    [ 18, 60 ],
    [ 14, 90 ],
    [ 24, 130 ],
    [ 22, 120 ],
    [ 14, 79 ],
    [ 25, 140 ],
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
  ];

  /**
   * Constructor
   * @param {number} x - initial x position
   * @param {number} y - initial y position
   * @param {BalloonsAndStaticElectricityModel} balloonsAndStaticElectricityModel - ensure balloon is in valid position in model coordinates
   * @param {boolean} defaultVisibility - is the balloon visible by default?
   * @param {string} labelString - label for the balloon
   * @param {Tandem} tandem
   * @constructor
   */
  function BalloonModel( x, y, balloonsAndStaticElectricityModel, defaultVisibility, labelString, tandem ) {

    //------------------------------------------------
    // Properties

    // @public {number}
    this.chargeProperty = new Property( 0, {
      tandem: tandem.createTandem( 'chargeProperty' ),
      phetioValueType: TNumber( { type: 'Integer', range: new Range( -POSITIONS.length, 0 ) } ),
      phetioInstanceDocumentation: 'this value is set internally by the simulation and should not be overridden'
    } );

    // @public {Vector2}
    this.velocityProperty = new Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'velocityProperty' ),
      phetioValueType: TVector2
    } );

    // @public {number}
    this.isVisibleProperty = new Property( defaultVisibility, {
      tandem: tandem.createTandem( 'isVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    // @public {boolean}
    this.isDraggedProperty = new Property( false, {
      tandem: tandem.createTandem( 'isDraggedProperty' ),
      phetioValueType: TBoolean
    } );

    // @public {Vector2}
    this.locationProperty = new Property( new Vector2( x, y ), {
      tandem: tandem.createTandem( 'locationProperty' ),
      phetioValueType: TVector2
    } );

    // @public {boolean} - Property that tracks when the balloon has stopped moving
    this.isStoppedProperty = new Property( false, {
      tandem: tandem.createTandem( 'isStoppedProperty' ),
      phetioValueType: TBoolean
    } );

    // @public {Vector2} - velocity of the balloon while dragging
    this.dragVelocityProperty = new Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'dragVelocityProperty' ),
      phetioValueType: TVector2
    } );

    //------------------------------------------------

    // @public (read-only) dimensions of the balloon
    this.width = 134;
    this.height = 222;

    // @private - minimum speed needed to pick up charges on the sweater
    this.thresholdSpeed = 0.025;

    // @private - positions of neutral atoms on balloon, don't change during simulation
    this.positionsOfStartCharges = [
      [ 44, 50 ],
      [ 88, 50 ],
      [ 44, 140 ],
      [ 88, 140 ]
    ];

    // @public - will emit when the user has completed an interaction with the balloon
    this.interactionEndEmitter = new Emitter();

    // @private - flag that is set to true once the user has completed an interaction
    this.announceInteraction = false;

    var self = this;

    // @public (read-only)- track when a charge is picked up so we can describe when a charge is and is not
    // picked up.
    this.chargePickedUpInDrag = false;

    this.initialLocation = this.locationProperty.initialValue;
    this.defaultVisibily = defaultVisibility;
    this.plusCharges = [];
    this.minusCharges = [];
    this.balloonsAndStaticElectricityModel = balloonsAndStaticElectricityModel; // @private
    this.direction = ''; // the direction of movement of the balloon

    // a label for the balloon, not the acccessible label but one of BalloonColorsEnum
    this.balloonLabel = labelString;

    //neutral pair of charges
    var plusChargesTandemGroup = tandem.createGroupTandem( 'plusCharges' );
    var minusChargesTandemGroup = tandem.createGroupTandem( 'minusCharges' );
    this.positionsOfStartCharges.forEach( function( entry ) {
      //plus
      var plusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ], plusChargesTandemGroup.createNextTandem() );
      self.plusCharges.push( plusCharge );

      //minus
      var minusCharge = new PointChargeModel(
        entry[ 0 ] + PointChargeModel.radius,
        entry[ 1 ] + PointChargeModel.radius,
        minusChargesTandemGroup.createNextTandem()
      );
      self.minusCharges.push( minusCharge );
    } );

    //charges that we can get from sweater
    POSITIONS.forEach( function( entry ) {
      //minus
      var minusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ], minusChargesTandemGroup.createNextTandem() );
      self.minusCharges.push( minusCharge );
    } );

    // model bounds, updated when position changes
    this.bounds = new Bounds2(
      this.locationProperty.get().x,
      this.locationProperty.get().y,
      this.locationProperty.get().x + this.width,
      this.locationProperty.get().y + this.height
    );
    this.locationProperty.link( function( location ) {
      self.bounds.setMinMax( location.x, location.y, location.x + self.width, location.y + self.height );
    } );

    // a11y - describes the balloon based on its model properties
    this.balloonDescriber = new BalloonDescriber(
      balloonsAndStaticElectricityModel,
      balloonsAndStaticElectricityModel.wall,
      this,
      tandem.createTandem( 'balloonDescriber' )
    );

    this.reset();

  }

  balloonsAndStaticElectricity.register( 'BalloonModel', BalloonModel );

  inherit( Object, BalloonModel, {

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

        var distX = charge.locationProperty.get().x - centerX;
        var distY = charge.locationProperty.get().y - centerY;
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
      var difference = chargeModel.locationProperty.get().minus( this.getDraggingCenter() );

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
      return new Vector2( this.locationProperty.get().x + this.width / 2, this.locationProperty.get().y + this.height / 2 );
    },
    //reset balloon to initial state
    reset: function( notResetVisibility ) {
      //array of instantaneous velocity of balloon last 5 ticks
      //then we calculate average velocity and compares it with threshold velocity to check if we catch minus charge from sweater
      this.xVelocityArray = [ 0, 0, 0, 0, 0 ];
      this.xVelocityArray.counter = 0;
      this.yVelocityArray = [ 0, 0, 0, 0, 0 ];
      this.yVelocityArray.counter = 0;
      this.chargeProperty.set( 0 );
      this.velocityProperty.set( new Vector2( 0, 0 ) );
      this.locationProperty.set( this.initialLocation.copy() );

      if ( !notResetVisibility ) {
        this.isVisibleProperty.set( this.defaultVisibily );
      }
      this.isDraggedProperty.set( false );

      // reset the accessible describer
      this.balloonDescriber.reset();
    },
    step: function( model, dt ) {
      if ( dt > 0 ) {

        if ( this.isDraggedProperty.get() ) {

          // check to see if we can catch any minus charges
          var chargePickedUp = this.dragBalloon( model, dt );

          if ( chargePickedUp ) {
            this.chargePickedUpInDrag = true;
          }
        }
        else {
          BalloonModel.applyForce( model, this, dt );
        }

        if ( this.announceInteraction ) {
          // once an interaction is finished, notify that the descriptions should be updated
          // this must happen after dragBalloon is called so that the charges are correctly
          // described
          this.interactionEndEmitter.emit();

          // do not describe again until next interaction
          this.announceInteraction = false;
        }
      }


      this.oldLocation = this.locationProperty.get().copy();
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
      var dx = ( this.locationProperty.get().x - this.oldLocation.x) / dt;
      var dy = ( this.locationProperty.get().y - this.oldLocation.y) / dt;

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
      if ( this.locationProperty.get().x > sweaterModel.center.x ) {
        retValue = BalloonModel.getForce( sweaterModel.center, this.getCenter(), -BalloonModel.coeff * sweaterModel.chargeProperty.get() * this.chargeProperty.get() );
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
      if ( !this.balloonsAndStaticElectricityModel.wall.isVisibleProperty.get() && centerX === playArea.atRightEdgeOfPlayArea ) {
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
      if ( balloonModel.isDraggedProperty.get() || !balloonModel.isVisibleProperty.get() || !balloonModel.other.isVisibleProperty.get() ) {
        return new Vector2( 0, 0 );
      }
      var kqq = BalloonModel.coeff * balloonModel.chargeProperty.get() * balloonModel.other.chargeProperty.get();
      return BalloonModel.getForce( balloonModel.getCenter(), balloonModel.other.getCenter(), kqq );
    };
    //sum of all forces applying to balloons
    BalloonModel.getTotalForce = function( model, balloonModel ) {
      if ( model.wall.isVisibleProperty.get() ) {
        var distFromWall = model.wall.x - balloonModel.locationProperty.get().x;
        //if balloon have enough charge and close enough to wall, wall attracts it more than sweater
        if ( balloonModel.chargeProperty.get() < -5 ) {
          var relDist = distFromWall - balloonModel.width;
          var fright = 0.003;
          if ( relDist <= 40 + balloonModel.chargeProperty.get() / 8 ) {
            return new Vector2( -fright * balloonModel.chargeProperty.get() / 20.0, 0 );
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
      var rightBound = model.wall.isVisibleProperty.get() ? model.bounds.maxX : model.bounds.maxX + model.wallWidth;

      var isStopped = false;

      var force = BalloonModel.getTotalForce( model, balloonModel );
      var newVelocity = balloonModel.velocityProperty.get().add( force.timesScalar( dt ) );
      var newLocation = balloonModel.locationProperty.get().plus( balloonModel.velocityProperty.get().timesScalar( dt ) );

      //if new position inside sweater, don't move it
      if ( newLocation.x + balloonModel.width < model.sweater.x + model.sweater.width ) {
        newVelocity = new Vector2();
        newLocation = balloonModel.locationProperty.get();
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
      if ( !balloonModel.isStoppedProperty.get() && ( balloonModel.locationProperty.get().equals( newLocation ) ) ) {
        balloonModel.isStoppedProperty.set( true );
      }

      balloonModel.velocityProperty.set( newVelocity );
      balloonModel.locationProperty.set( newLocation );

      if ( isStopped ) {
        balloonModel.velocityProperty.set( new Vector2( 0, 0 ) );
      }
    };
    BalloonModel.coeff = 0.1;
  }

  return BalloonModel;
} );
