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
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var BalloonLocationEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonLocationEnum' );
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var TVector2 = require( 'DOT/TVector2' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  // constants, most if not all of which were empirically determined to elicit the desired appearance and behavior
  var NEAR_SWEATER_DISTANCE = 25;
  var VELOCITY_ARRAY_LENGTH = 5;
  var THRESHOLD_SPEED = 0.025;
  var BALLOON_WIDTH = 134;
  var BALLOON_HEIGHT = 222;

  // collection of charge positions on the balloon, relative to the top left corners
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

  // determine average the Y position for the charges in the balloon
  var positionYSum = 0;
  for (var i = 0; i < POSITIONS.length; i++ ) {
    positionYSum += POSITIONS[ i ][ 1 ]; // y coordinate is second value
  }
  var AVERAGE_CHARGE_Y = ( positionYSum / POSITIONS.length );

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

    var self = this;

    //------------------------------------------------
    // Properties

    // @public {number}
    this.chargeProperty = new Property( 0, {
      tandem: tandem.createTandem( 'chargeProperty' ),
      phetioValueType: TNumber( { type: 'Integer', range: new Range( -POSITIONS.length, 0 ) } ),
      phetioInstanceDocumentation: 'this value is set internally by the simulation and should not be overridden'
    } );

    // @public {Vector2}
    this.velocityProperty = new Property( Vector2.ZERO, {
      tandem: tandem.createTandem( 'velocityProperty' ),
      phetioValueType: TVector2
    } );
    this.velocityProperty.areValuesEqual = function( a, b ) { return a.equals( b ); };

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

    // @public {Vector2} - location of the upper left corner of the rectangle that encloses the balloon
    this.locationProperty = new Property( new Vector2( x, y ), {
      tandem: tandem.createTandem( 'locationProperty' ),
      phetioValueType: TVector2
    } );
    this.locationProperty.areValuesEqual = function( a, b ) { return a.equals( b ); };

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
    this.dragVelocityProperty.areValuesEqual = function( a, b ) { return a.equals( b ); };

    //------------------------------------------------

    // @public (read-only) dimensions of the balloon
    this.width = BALLOON_WIDTH;
    this.height = BALLOON_HEIGHT;

    // @public {MovablePointChargeModel} - the closest minus charge to the balloon which is in the wall
    this.closestChargeInWall = null;

    // @public {boolean} - whether or not the balloon is currently inducing a charge in the wall, determined by
    this.inducingCharge = false;

    // @private (a11y) - the amount of time that has passed since balloon has been released
    this.timeSinceRelease = 0; // in ms

    // @public (read-only) - the old location of the balloon, used throughout the model and view to calculate
    // changes in position
    this.oldLocation = this.locationProperty.get().copy();

    // @private - positions of neutral atoms on balloon, don't change during simulation
    this.positionsOfStartCharges = [
      [ 44, 50 ],
      [ 88, 50 ],
      [ 44, 140 ],
      [ 88, 140 ]
    ];

    // @public - will emit an event when the balloon is reset
    this.resetEmitter = new Emitter();

    // @public - will emit when the user has completed an interaction with the balloon
    this.interactionEndEmitter = new Emitter();

    // @private - flag that is set to true once the user has completed an interaction
    this.announceInteraction = false;

    this.initialLocation = this.locationProperty.initialValue;
    this.plusCharges = [];
    this.minusCharges = [];
    this.balloonsAndStaticElectricityModel = balloonsAndStaticElectricityModel; // @private
    this.direction = ''; // the direction of movement of the balloon

    // a label for the balloon, not the accessible label but one of BalloonColorsEnum
    this.balloonLabel = labelString;

    // neutral pair of charges
    var plusChargesTandemGroup = tandem.createGroupTandem( 'plusCharges' );
    var minusChargesTandemGroup = tandem.createGroupTandem( 'minusCharges' );
    this.positionsOfStartCharges.forEach( function( entry ) {
      //plus
      var plusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ], plusChargesTandemGroup.createNextTandem(), false );
      self.plusCharges.push( plusCharge );

      //minus
      var minusCharge = new PointChargeModel(
        entry[ 0 ] + PointChargeModel.RADIUS,
        entry[ 1 ] + PointChargeModel.RADIUS,
        minusChargesTandemGroup.createNextTandem(),
        false
      );
      self.minusCharges.push( minusCharge );
    } );

    //charges that we can get from sweater
    POSITIONS.forEach( function( entry ) {
      //minus
      var minusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ], minusChargesTandemGroup.createNextTandem(), true );
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

    this.reset();

  }

  balloonsAndStaticElectricity.register( 'BalloonModel', BalloonModel );

  inherit( Object, BalloonModel, {

    /**
     * If the balloon is in the upper half of the play area, return true.
     *
     * @returns {boolean}
     */
    inUpperHalfOfPlayArea: function() {
      return this.getCenter().y < this.balloonsAndStaticElectricityModel.playArea.lowerRow.top;
    },

    /**
     * Return true if the balloon is near the wall without touching it.
     *
     * @returns {boolean}
     */
    nearWall: function() {
      var model = this.balloonsAndStaticElectricityModel;
      return ( this.getCenter().x > model.playArea.atNearWall && this.getCenter().x < model.playArea.atWall );
    },

    /**
     * findClosestCharge - description
     *
     * @returns {type}  description
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
        if ( charge.movedProperty.get() ) {
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
     * @returns {Vector2}
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
     * @param  {PointChargeModel} chargeModel
     * @returns {string}
     */
    getDirectionToCharge: function( chargeModel ) {
      var difference = chargeModel.location.minus( this.getDraggingCenter() );

      var diffX = difference.x;
      var diffY = difference.y;

      // direction string to be returned
      var direction;
      if ( diffX >= 0 && diffY >= 0 ) {
        // charge is up and to the right
        direction = BalloonDirectionEnum.DOWN_RIGHT;
      }
      else if ( diffX >= 0 && diffY < 0 ) {
        // charge is down and to the right
        direction = BalloonDirectionEnum.UP_RIGHT;
      }
      else if ( diffX < 0 && diffY >= 0 ) {
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
     * @returns {type}  description
     */
    onSweater: function() {
      var sweaterBounds = this.balloonsAndStaticElectricityModel.sweater.bounds;
      if ( sweaterBounds.eroded( 0 ).intersectsBounds( this.bounds ) ) {
        return true;
      }
      else { return false; }
    },

    /**
     * returns whether or not the center of the balloon is within the charged area of the sweater
     * @public
     * @returns {boolean}
     */
    centerInSweaterChargedArea: function() {
      return this.balloonsAndStaticElectricityModel.sweater.chargedArea.containsPoint( this.getCenter() );
    },

    /**
     * If the balloon is near the sweater, return true.  Considered near the sweater when
     * within NEAR_SWEATER_DISTANCE from touching the sweater.
     * @returns {boolean}
     * @public
     */
    nearSweater: function() {
      var minX = this.balloonsAndStaticElectricityModel.playArea.atNearSweater;
      var maxX = minX + NEAR_SWEATER_DISTANCE;

      return ( minX < this.getCenter().x && this.getCenter().x < maxX );
    },

    /**
     * Returns true if the balloon is touching the wall
     *
     * @returns {boolean}
     */
    touchingWall: function() {
      var atWall = this.getCenter().x === this.balloonsAndStaticElectricityModel.playArea.atWall;
      var wallVisible = this.balloonsAndStaticElectricityModel.wall.isVisibleProperty.get();
      return ( atWall && wallVisible );
    },

    /**
     * Returns true if the balloon is currently sticking to the wall. The balloon is sticking to the wall
     * when it is charged, touching the wall, and not being dragged.
     * @public
     * @return {boolean}
     */
    stickingToWall: function() {
      return ( this.chargeProperty.get() > 0 ) && this.touchingWall() && !this.isDraggedProperty.get();
    },

    /**
     * Get the distance from the center of this balloon to the wall.  Note that distances are all in ScreenView
     * coordinates for this simulation
     * @returns {number}
     */
    getDistanceToWall: function() {
      return this.getCenter().x - this.balloonsAndStaticElectricityModel.playArea.atWall;
    },

    /**
     * Set the center location of the balloon. Sets the location Property but with an offset to account
     * for the balloon dimenstions.
     *
     * @param {number} x
     * @param {number} y
     * @public
     */
    setCenter: function( center ) {
      this.locationProperty.set( new Vector2(
        center.x - this.width / 2,
        center.y - this.height /2
      ) );
    },

    /**
     * Get the center location of the balloon
     * @public
     * @returns {Vector2}
     */
    getCenter: function() {
      return new Vector2( this.locationProperty.get().x + this.width / 2, this.locationProperty.get().y + this.height / 2 );
    },

    /**
     * Get the vertical center of the balloon model.
     * @return {number} 
     */
    getCenterY: function() {
      return this.locationProperty.get().y + this.height / 2;
    },

    /**
     * Get the horizontal center location of the balloon.
     * @return {number}
     */
    getCenterX: function() {
      return this.locationProperty.get().x + this.width / 2;
    },

    /**
     * Balloon charges aren't evenly distributed throughout the balloon, they conform to the upper left edge of the
     * balloon image, placed by visual inspection.  This returns a Vector2 pointing to what is approximately the center
     * of the balloon charges.  In x, this remains the center of the model bounds.  In y, this is the top of the
     * balloon plus the average y position of the charges.
     * 
     * @public
     * @return {Vector2}
     */
    getChargeCenter: function() {
      var centerX = this.getCenter().x;
      var centerY = this.locationProperty.get().y + AVERAGE_CHARGE_Y;
      return new Vector2( centerX, centerY );
    },

    /**
     * Get the position of the touch point of the balloon on the wall.
     * @type {Vector2}
     */
    getWallTouchingCenter: function() {
      var centerX = this.locationProperty.get().x + this.width;
      var centerY = this.getCenter().y;
      return new Vector2( centerX, centerY );
    },

    /**
     * Get the position of the left touch point of the balloon against the sweater, assumed to be the left most
     * center of of the balloon.
     * @return {Vector2} [description]
     */
    getSweaterTouchingCenter: function() {
      var centerX = this.locationProperty.get().x;
      var centerY = this.getCenter().y;
      return new Vector2( centerX, centerY );
    },

    //reset balloon to initial state
    reset: function( notResetVisibility ) {
      //array of instantaneous velocity of balloon last 5 ticks
      //then we calculate average velocity and compares it with threshold velocity to check if we catch minus charge from sweater
      this.xVelocityArray = [ 0, 0, 0, 0, 0 ];
      this.xVelocityArray.counter = 0;
      assert && assert( this.xVelocityArray.length = VELOCITY_ARRAY_LENGTH, 'velocity array incorrectly initialized' );
      this.yVelocityArray = [ 0, 0, 0, 0, 0 ];
      this.yVelocityArray.counter = 0;
      assert && assert( this.yVelocityArray.length = VELOCITY_ARRAY_LENGTH, 'velocity array incorrectly initialized' );
      this.chargeProperty.reset();
      this.velocityProperty.reset();
      this.locationProperty.reset();

      if ( !notResetVisibility ) {
        this.isVisibleProperty.reset();
      }
      this.isDraggedProperty.reset();

      // broadcast a message when we are reset
      this.resetEmitter.emit();
    },

    /**
     * Steps the BalloonModel.
     * @param {BalloonsAndStaticElectricityModel} model
     * @param {number} dtSeconds elapsed time in seconds
     */
    step: function( model, dtSeconds ) {

      // seconds to milliseconds - really, the model is fairly 'unitless' but multiplying the
      // time step by 1000 makes the sim look and feel like the Java version
      var dt = dtSeconds * 1000;

      // limit large values of dt - they probably mean that the sim just regained focus
      if ( dt > 500 ) {
        dt = 1 / 60 * 1000; // nominal time stamp at 60 fps
      }

      if ( this.isDraggedProperty.get() ) {

        // drag the balloon, which may cause it to pick up charges
        this.dragBalloon( model, dt );

        // reset time since release to 0
        this.timeSinceRelease = 0;
      }
      else {
        this.applyForce( dt );

        // increment the time since release
        this.timeSinceRelease += dt;
      }

      if ( this.announceInteraction ) {
        // once an interaction is finished, notify that the descriptions should be updated
        // this must happen after dragBalloon is called so that the charges are correctly
        // described
        this.interactionEndEmitter.emit();

        // do not describe again until next interaction
        this.announceInteraction = false;
      }
      this.oldLocation = this.locationProperty.get().copy();
    },

    /**
     * When balloon is dragged, check to see if we catch a minus charge.  Returns a boolean
     * that indicates whether or not a charge was picked up.
     *
     * @param  {BalloonsAndStaticElectricityModel} model
     * @param  {number} dt
     * @returns {boolean} chargeFound
     */
    dragBalloon: function( model, dt ) {

      // Prevent a fuzzer error that tries to drag the balloon before step is called.
      if ( !this.oldLocation ) {
        return;
      }
      var vx = ( this.locationProperty.get().x - this.oldLocation.x ) / dt;
      var vy = ( this.locationProperty.get().y - this.oldLocation.y ) / dt;

      //calculate average velocity
      this.xVelocityArray[ this.xVelocityArray.counter++ ] = vx * vx;
      this.xVelocityArray.counter %= VELOCITY_ARRAY_LENGTH;
      this.yVelocityArray[ this.yVelocityArray.counter++ ] = vy * vy;
      this.yVelocityArray.counter %= VELOCITY_ARRAY_LENGTH;

      var averageX = 0;
      var averageY = 0;
      for ( var i = 0; i < VELOCITY_ARRAY_LENGTH; i++ ) {
        averageX += this.xVelocityArray[ i ];
        averageY += this.yVelocityArray[ i ];
      }
      averageX /= VELOCITY_ARRAY_LENGTH;
      averageY /= VELOCITY_ARRAY_LENGTH;

      // if average speed larger than threshold speed we try to move minus charges from sweater to balloon
      var speed = Math.sqrt( averageX * averageX + averageY * averageY );

      this.dragVelocityProperty.set( new Vector2( vx, vy ) );

      var chargeFound = false;
      if ( speed >= THRESHOLD_SPEED ) {
        chargeFound = model.sweater.checkAndTransferCharges( this );
      }

      return chargeFound;
    },

    /**
     * Get the force between this balloon and the sweater.
     *
     * @param  {SweaterModel} sweaterModel
     * @returns {Vector2}
     */
    getSweaterForce: function( sweaterModel ) {
      return BalloonModel.getForce(
        sweaterModel.center,
        this.getCenter(),
        -BalloonModel.FORCE_CONSTANT * sweaterModel.chargeProperty.get() * this.chargeProperty.get()
      );
    },

    /**
     * Get the name of the object that the balloon is currently attracted to.
     * @public
     *
     * @returns {string}
     */
    getAttractedDirection: function() {
      var force = this.getTotalForce();
      if ( force.x > 0 ) {
        return BalloonDirectionEnum.RIGHT;
      }
      else {
        return BalloonDirectionEnum.LEFT;
      }
    },

    /**
     * Returns whether or not the balloon is touching the boundary of the play area, including the bottom, left
     * and top edges, or the right edge or wall depending on wall visibility.
     * @return {string}
     */
    getTouchingBoundary: function() {
      return this.getTouchingRightBoundary() || this.getTouchingLeftBoundary() ||
            this.getTouchingBottomBoundary() || this.getTouchingTopBoundary();
    },

    /**
     * Returns whether or not the balloon is touching the right boundary of the play area.  If the wall 
     * is visible, this will be the location where the balloon is touching the wall, otherwise it will
     * be the location where the balloon is touching the right edge of the play area.
     * 
     * @return {boolean}
     */
    getTouchingRightBoundary: function() {
      var balloonX = this.getCenter().x;
      if ( this.balloonsAndStaticElectricityModel.wall.isVisibleProperty.get() ) {
        return PlayAreaMap.X_LOCATIONS.AT_WALL === balloonX;
      }
      else {
        return PlayAreaMap.X_LOCATIONS.AT_RIGHT_EDGE === balloonX;
      }
    },

    /**
     * Returns whether or not the balloon is touching the bottom boundary of the play area.
     * @return {boolean}
     */
    getTouchingBottomBoundary: function() {
      return PlayAreaMap.Y_LOCATIONS.AT_BOTTOM === this.getCenterY();
    },

    getTouchingLeftBoundary: function() {
      return PlayAreaMap.X_LOCATIONS.AT_LEFT_EDGE === this.getCenterX();
    },

    /**
     * Returns whether or not the balloon is touching the top boundary of the play area.
     * 
     * @return {boolean}
     */
    getTouchingTopBoundary: function() {
      return PlayAreaMap.Y_LOCATIONS.AT_TOP === this.getCenterY();
    },

    /**
     * Get the object that the balloon is touching.  If the balloon is in free space, return null.
     *
     * @returns {string}
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
    },

    /**
     * get a bounding rectangle
     * @returns {Bounds2}
     * @private
     */
    getBounds: function() {
      return new Bounds2(
        this.locationProperty.get().x,
        this.locationProperty.get().y,
        this.locationProperty.get().x + this.width,
        this.locationProperty.get().y + this.height
      );
    },

    /**
     * Apply a force on this balloon, and move it to new coordinates.  Also updates the velocity.
     * @private
     *
     * @param  {number} dt - in seconds
     */
    applyForce: function( dt ) {

      // only move if this balloon is not over the sweater
      var model = this.balloonsAndStaticElectricityModel;
      if ( !this.centerInSweaterChargedArea() ) {

        var rightBound = model.bounds.maxX;
        // var rightBound = model.wall.isVisibleProperty.get() ? model.bounds.maxX : model.bounds.maxX + model.wallWidth;
        var force = this.getTotalForce();
        var newVelocity = this.velocityProperty.get().plus( force.timesScalar( dt ) );
        var newLocation = this.locationProperty.get().plus( this.velocityProperty.get().timesScalar( dt ) );

        if ( newLocation.x + this.width >= rightBound ) {
          newLocation.x = rightBound - this.width;
          newVelocity.x = newVelocity.x > 0 ? 0 : newVelocity.x;
        }
        if ( newLocation.y + this.height >= model.bounds.maxY ) {
          newLocation.y = model.bounds.maxY - this.height;
          newVelocity.y = newVelocity > 0 ? 0 : newVelocity.y;
        }
        if ( newLocation.x <= model.bounds.minX ) {
          newLocation.x = model.bounds.minX;
          newVelocity.x = newVelocity.x < 0 ? 0 : newVelocity.x;
        }
        if ( newLocation.y <= model.bounds.minY ) {
          newLocation.y = model.bounds.minY;
          newVelocity.y = newVelocity < 0 ? 0 : newVelocity.y;
        }

        // once the balloon stops moving, notify observers that it has reached a resting destination
        if ( !this.isStoppedProperty.get() && ( this.locationProperty.get().equals( newLocation ) ) ) {
          this.isStoppedProperty.set( true );
        }

        this.velocityProperty.set( newVelocity );
        this.locationProperty.set( newLocation );
      }
      else {
        if ( !this.velocityProperty.get().equals( Vector2.ZERO ) ) {
          this.velocityProperty.set( Vector2.ZERO );
        }
      }
    },

    /**
     * Get the total force on this balloon.  The balloon will feel forces from all objects in the play area, including
     * the sweater, the wall, and the other balloon if it is visible.
     * @private
     * @returns {Vector2}
     */
    getTotalForce: function() {
      var model = this.balloonsAndStaticElectricityModel;
      if ( model.wall.isVisibleProperty.get() ) {
        var distFromWall = model.wall.x - this.locationProperty.get().x;

        // if the balloon has enough charge and is close enough to the wall, the wall attracts it more than the sweater
        if ( this.chargeProperty.get() < -5 ) {
          var relDist = distFromWall - this.width;
          var fright = 0.003;
          if ( relDist <= 40 + this.chargeProperty.get() / 8 ) {
            return new Vector2( -fright * this.chargeProperty.get() / 20.0, 0 );
          }
        }
      }

      var force = this.getSweaterForce( model.sweater );
      var other = this.getOtherBalloonForce();
      var sumOfForces = force.plus( other );

      // Don't allow the force to be too high or the balloon can jump across the screen in 1 step, see #67
      var mag = sumOfForces.magnitude();
      var max = 1E-2;
      if ( mag > max ) {
        sumOfForces.normalize();
        sumOfForces.multiplyScalar( max );
      }
      return sumOfForces;
    },

    /**
     * Get the force on this balloon model from another balloon model. If the other balloon is being dragged, or is
     * invisible, zero is returned. See getForce() for the actual force calculation
     * @public
     *
     * @returns {Vector2}
     */
    getOtherBalloonForce: function() {
      if ( this.isDraggedProperty.get() || !this.isVisibleProperty.get() || !this.other.isVisibleProperty.get() ) {
        return new Vector2( 0, 0 );
      }
      var kqq = BalloonModel.FORCE_CONSTANT * this.chargeProperty.get() * this.other.chargeProperty.get();
      return BalloonModel.getForce( this.getCenter(), this.other.getCenter(), kqq );
    }
  }, {

    /**
     * Calculate the force between to charged objects using Coulomb's law.  This allows the client to provide a
     * different value for the exponent used on the radius, which can be used to tweak the visual performance of the
     * simulation.
     *
     * @public
     * @static
     *
     * @param  {Vector2} p1 - position of the first object
     * @param  {Vector2} p2 - position of the second object
     * @param  {number} kqq - some constant times the two charges
     * @param  {number} [power] - optional, default of 2, but 1 is added so the acceleration is exaggerated
     * @returns {Vector2}
     */
    getForce: function( p1, p2, kqq, power ) {

      // power defaults to 2
      power = power || 2;

      // calculate a vector from one point to the other
      var difference = p1.minus( p2 );
      var r = difference.magnitude();

      // if the points are right on top of one another, return an attraction value of zero
      if ( r === 0 ) {
        return new Vector2( 0, 0 );
      }

      // make this a unit vector
      difference.setMagnitude( 1 );

      // scale by the force value
      return difference.timesScalar( kqq / ( Math.pow( r, power ) ) );
    },

    // @static - value for Coulomb's constant used in the calculations but NOT THE ACTUAL VALUE.  It has been tweaked in
    // order to get the visual behavior that we need in the sim.
    FORCE_CONSTANT: 0.05

  } );

  return BalloonModel;
} );
