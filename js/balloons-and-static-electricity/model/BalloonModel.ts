// Copyright 2013-2025, University of Colorado Boulder

/**
 * Model of a balloon, which can have charge, position and velocity.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg(PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEConstants from '../BASEConstants.js';
import BalloonDirectionEnum from './BalloonDirectionEnum.js';
import PlayAreaMap from './PlayAreaMap.js';
import PointChargeModel from './PointChargeModel.js';
import MovablePointChargeModel from './MovablePointChargeModel.js';
import SweaterModel from './SweaterModel.js';
import type BASEModel from './BASEModel.js';

// constants, most if not all of which were empirically determined to elicit the desired appearance and behavior
const VELOCITY_ARRAY_LENGTH = 5;
const BALLOON_WIDTH = 134;
const BALLOON_HEIGHT = 222;

// threshold for diagonal movement is +/- 15 degrees from diagonals
const DIAGONAL_MOVEMENT_THRESHOLD = 15 * Math.PI / 180;

// map that determines if the balloon is moving up, down, horizontally or along a diagonal between two points
const DIRECTION_MAP = {
  UP: new Range( -3 * Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD, -Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD ),
  DOWN: new Range( Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD, 3 * Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD ),
  RIGHT: new Range( -Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD, Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD ),

  // atan2 wraps around PI, so we will use absolute value in checks
  LEFT: new Range( 3 * Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD, Math.PI ),

  UP_LEFT: new Range( -3 * Math.PI - DIAGONAL_MOVEMENT_THRESHOLD, -3 * Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD ),
  DOWN_LEFT: new Range( 3 * Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD, 3 * Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD ),
  UP_RIGHT: new Range( -Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD, -Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD ),
  DOWN_RIGHT: new Range( Math.PI / 4 - DIAGONAL_MOVEMENT_THRESHOLD, Math.PI / 4 + DIAGONAL_MOVEMENT_THRESHOLD )
};
const DIRECTION_MAP_KEYS = Object.keys( DIRECTION_MAP );

// collection of charge positions on the balloon, relative to the top left corners
// charges will appear in these positions as the balloon collects electrons
const POSITIONS = [
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

// determine average Y position for the charges in the balloon, used to calculate the average vertical position of
// the visual charge center
let positionYSum = 0;
for ( let i = 0; i < POSITIONS.length; i++ ) {
  positionYSum += POSITIONS[ i ][ 1 ]; // y coordinate is second value
}
const AVERAGE_CHARGE_Y = ( positionYSum / POSITIONS.length );

class BalloonModel {

  // charge on the balloon, range goes from negative values to 0
  public readonly chargeProperty: NumberProperty;

  // The velocity of the balloon when moving freely, i.e. NOT when it is being dragged
  public readonly velocityProperty: Vector2Property;

  public readonly isVisibleProperty: BooleanProperty;
  public readonly isDraggedProperty: BooleanProperty;

  // whether or not this balloon is being dragged with a mouse or touch pointer
  public draggingWithPointer = false;

  // position of the upper left corner of the rectangle that encloses the balloon
  public readonly positionProperty: Vector2Property;

  // velocity of the balloon while dragging
  public readonly dragVelocityProperty: Vector2Property;

  // whether or not the balloon is on the sweater
  public readonly onSweaterProperty: BooleanProperty;

  // whether or not the balloon is touching the wall
  public readonly touchingWallProperty: BooleanProperty;

  // the current column of the play area the balloon is in
  public readonly playAreaColumnProperty: Property<string | null>;

  // the current row of the play area that the balloon is in
  public readonly playAreaRowProperty: Property<string | null>;

  // if the balloon is in a landmark position, this Property will be a key of PlayAreaMap.LANDMARK_RANGES
  public readonly playAreaLandmarkProperty: Property<string | null>;

  // the direction of movement, can be one of BalloonDirectionEnum
  public readonly directionProperty: Property<string | null>;

  // whether or not the balloon is currently inducing a charge in the wall
  public readonly inducingChargeProperty: BooleanProperty;

  // array of instantaneous velocity of balloon last 5 ticks
  private xVelocityArray: number[] & { counter: number } = Object.assign( [ 0, 0, 0, 0, 0 ], { counter: 0 } );
  private yVelocityArray: number[] & { counter: number } = Object.assign( [ 0, 0, 0, 0, 0 ], { counter: 0 } );

  // whether or not the balloon is currently 'jumping'
  private jumping = false;

  // flag that indicates whether the balloon has successfully been picked up since the last reset
  public successfulPickUp = false;

  // dimensions of the balloon
  public readonly width = BALLOON_WIDTH;
  public readonly height = BALLOON_HEIGHT;

  // the closest minus charge to the balloon which is in the wall
  public closestChargeInWall: MovablePointChargeModel | null = null;

  // in ms, the amount of time that has passed since balloon has been released
  public timeSinceRelease = 0;

  // the old position of the balloon, used throughout the model and view
  public oldPosition: Vector2;

  // positions of neutral atoms on balloon, don't change during simulation
  private readonly positionsOfStartCharges = [
    [ 44, 50 ],
    [ 88, 50 ],
    [ 44, 140 ],
    [ 88, 140 ]
  ];

  // will emit an event when the balloon is reset
  public readonly resetEmitter: Emitter;

  public readonly plusCharges: PointChargeModel[] = [];
  public readonly minusCharges: PointChargeModel[] = [];

  private readonly balloonsAndStaticElectricityModel: BASEModel;

  // model bounds, updated when position changes
  public readonly bounds: Bounds2;

  // reference to the other balloon, assigned externally
  public other!: BalloonModel;

  // static properties
  public static readonly FORCE_CONSTANT = 0.05;
  public static readonly BALLOON_WIDTH = BALLOON_WIDTH;

  /**
   * Constructor
   * @param x - initial x position
   * @param y - initial y position
   * @param balloonsAndStaticElectricityModel - ensure balloon is in valid position in model coordinates
   * @param defaultVisibility - is the balloon visible by default?
   * @param tandem
   */
  public constructor( x: number, y: number, balloonsAndStaticElectricityModel: BASEModel, defaultVisibility: boolean, tandem: Tandem ) {

    this.chargeProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( -POSITIONS.length, 0 ),
      tandem: tandem.createTandem( 'chargeProperty' ),
      phetioReadOnly: true
    } );

    this.velocityProperty = new Vector2Property( Vector2.ZERO, {
      tandem: tandem.createTandem( 'velocityProperty' ),
      valueComparisonStrategy: 'equalsFunction'
    } );

    this.isVisibleProperty = new BooleanProperty( defaultVisibility, {
      tandem: tandem.createTandem( 'isVisibleProperty' )
    } );

    this.isDraggedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isDraggedProperty' )
    } );

    this.positionProperty = new Vector2Property( new Vector2( x, y ), {
      tandem: tandem.createTandem( 'positionProperty' ),
      valueComparisonStrategy: 'equalsFunction'
    } );

    this.dragVelocityProperty = new Vector2Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'dragVelocityProperty' ),
      valueComparisonStrategy: 'equalsFunction'
    } );

    this.onSweaterProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'onSweaterProperty' )
    } );

    this.touchingWallProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'touchingWallProperty' )
    } );

    this.playAreaColumnProperty = new Property<string | null>( null );

    this.playAreaRowProperty = new Property<string | null>( null );

    this.playAreaLandmarkProperty = new Property<string | null>( null );

    this.directionProperty = new Property<string | null>( null, {
      tandem: tandem.createTandem( 'directionProperty' ),
      phetioValueType: NullableIO( StringIO )
    } );

    this.inducingChargeProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'inducingChargeProperty' )
    } );

    this.oldPosition = this.positionProperty.get().copy();

    this.resetEmitter = new Emitter();

    this.balloonsAndStaticElectricityModel = balloonsAndStaticElectricityModel;

    // neutral pair of charges
    this.positionsOfStartCharges.forEach( entry => {
      const plusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ], Tandem.OPT_OUT, false );
      this.plusCharges.push( plusCharge );

      // minus charges at same position of positive charge, shifted down and to the right by charge radius
      const minusCharge = new PointChargeModel(
        entry[ 0 ] + PointChargeModel.RADIUS,
        entry[ 1 ] + PointChargeModel.RADIUS,
        Tandem.OPT_OUT,
        false
      );
      this.minusCharges.push( minusCharge );
    } );

    // charges that we can get from sweater, only negative charges
    POSITIONS.forEach( entry => {
      const minusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ], Tandem.OPT_OUT, false );
      this.minusCharges.push( minusCharge );
    } );

    this.bounds = new Bounds2(
      this.positionProperty.get().x,
      this.positionProperty.get().y,
      this.positionProperty.get().x + this.width,
      this.positionProperty.get().y + this.height
    );

    // When the position changes, update the bounds of balloon, direction of movement, and whether or not the the
    // balloon is touching an object.  No need to dispose as balloons exist for life of sim.
    this.positionProperty.link( ( position, oldPosition ) => {
      this.bounds.setMinMax( position.x, position.y, position.x + this.width, position.y + this.height );

      if ( oldPosition ) {

        // the direction from the old position to the newPosition
        this.directionProperty.set( BalloonModel.getDirection( position, oldPosition ) || null );

        // update whether or not the balloon is on the sweater
        if ( this.onSweater() !== this.onSweaterProperty.get() ) {
          this.onSweaterProperty.set( this.onSweater() );
        }

        // Update whether or not we are touching the wall.
        if ( this.touchingWall() !== this.touchingWallProperty.get() ) {
          this.touchingWallProperty.set( this.touchingWall() );
        }
      }
    } );

    this.isDraggedProperty.lazyLink( isDragged => {

      // When the user starts dragging a balloon, set its non-dragging velocity to zero.
      if ( isDragged ) {
        this.velocityProperty.set( Vector2.ZERO );
      }

      // When the balloon is released, reset the timer that indicates when it was released.
      if ( !isDragged ) {
        this.timeSinceRelease = 0;
      }
    } );

    this.reset();
  }

  /**
   * Return true if the balloon is near the wall without touching it, and the wall is visible.
   */
  public nearWall(): boolean {
    return PlayAreaMap.LANDMARK_RANGES.AT_NEAR_WALL.contains( this.getCenter().x );
  }

  /**
   * Determine if the balloon is on the sweater.  The balloon is considered to be rubbing on the sweater
   * if its center is in the charged area.
   */
  public onSweater(): boolean {
    const sweaterBounds = this.balloonsAndStaticElectricityModel.sweater.bounds;
    return sweaterBounds.intersectsBounds( this.bounds );
  }

  /**
   * Returns whether or not the center of the balloon is within the charged area of the sweater.
   */
  public centerInSweaterChargedArea(): boolean {
    return this.balloonsAndStaticElectricityModel.sweater.chargedArea.containsPoint( this.getCenter() );
  }

  /**
   * If the balloon is near the sweater, return true.  Considered near the sweater when the center of the balloon
   * is within the LANDMARK_RANGES.AT_NEAR_SWEATER range of the PlayAreaMap.
   */
  public nearSweater(): boolean {
    return PlayAreaMap.LANDMARK_RANGES.AT_NEAR_SWEATER.contains( this.getCenter().x );
  }

  /**
   * Return true if the balloon is near the right edge of the play area without touching it
   */
  public nearRightEdge(): boolean {
    return PlayAreaMap.LANDMARK_RANGES.AT_NEAR_RIGHT_EDGE.contains( this.getCenterX() );
  }

  /**
   * Returns whether or not the right edge of the balloon is at the wall position, regardless of
   * balloon or wall visibility.  Useful for checking whether the balloon is at the wall position
   * when the wall is removed.
   */
  public rightAtWallPosition(): boolean {
    return this.getCenterX() === PlayAreaMap.X_POSITIONS.AT_WALL;
  }

  /**
   * Returns whether or not this balloon is at the right edge of the play area.
   */
  public atRightEdge(): boolean {
    return this.getCenterX() === PlayAreaMap.X_BOUNDARY_POSITIONS.AT_RIGHT_EDGE;
  }

  /**
   * Returns whether or not this balloon is at the left edge of the play area.
   */
  public atLeftEdge(): boolean {
    return this.getCenterX() === PlayAreaMap.X_BOUNDARY_POSITIONS.AT_LEFT_EDGE;
  }

  /**
   * Returns whether or not this balloon is in the center of the play area horizontally. Does not consider vertical
   * position.
   */
  public inCenterPlayArea(): boolean {
    return PlayAreaMap.COLUMN_RANGES.CENTER_PLAY_AREA.contains( this.getCenterX() );
  }

  /**
   * Returns whether or not the balloon is very close to an object in the play area. Will return true if the center
   * is withing one of the "very close" ranges in the play area.
   */
  public veryCloseToObject(): boolean {
    const centerX = this.getCenterX();
    return PlayAreaMap.LANDMARK_RANGES.AT_VERY_CLOSE_TO_SWEATER.contains( centerX ) ||
           PlayAreaMap.LANDMARK_RANGES.AT_VERY_CLOSE_TO_WALL.contains( centerX ) ||
           PlayAreaMap.LANDMARK_RANGES.AT_VERY_CLOSE_TO_RIGHT_EDGE.contains( centerX );
  }

  /**
   * Returns true if the balloon is touching the wall.
   */
  public touchingWall(): boolean {
    const atWall = this.getCenterX() === PlayAreaMap.X_POSITIONS.AT_WALL;
    const wallVisible = this.balloonsAndStaticElectricityModel.wall.isVisibleProperty.get();
    return ( atWall && wallVisible );
  }

  /**
   * Returns true if the balloon is moving horizontally, left or right.
   */
  public movingHorizontally(): boolean {
    const direction = this.directionProperty.get();
    return direction === BalloonDirectionEnum.LEFT || direction === BalloonDirectionEnum.RIGHT;
  }

  /**
   * Returns true if the balloon is movingv vertically, up or down
   */
  public movingVertically(): boolean {
    const direction = this.directionProperty.get();
    return direction === BalloonDirectionEnum.UP || direction === BalloonDirectionEnum.DOWN;
  }

  /**
   * Returns true if the balloon is moving horizontally, left or right.
   */
  public movingDiagonally(): boolean {
    const direction = this.directionProperty.get();
    return direction === BalloonDirectionEnum.UP_LEFT ||
           direction === BalloonDirectionEnum.UP_RIGHT ||
           direction === BalloonDirectionEnum.DOWN_LEFT ||
           direction === BalloonDirectionEnum.DOWN_RIGHT;
  }

  /**
   * Get whether or not the balloon is s moving to the right.
   */
  public movingRight(): boolean {
    const direction = this.directionProperty.get();
    return direction === BalloonDirectionEnum.RIGHT ||
           direction === BalloonDirectionEnum.UP_RIGHT ||
           direction === BalloonDirectionEnum.DOWN_RIGHT;
  }

  /**
   * Get whether or not the balloon is moving to the left.
   */
  public movingLeft(): boolean {
    const direction = this.directionProperty.get();
    return direction === BalloonDirectionEnum.LEFT ||
           direction === BalloonDirectionEnum.UP_LEFT ||
           direction === BalloonDirectionEnum.DOWN_LEFT;
  }

  /**
   * Returns a proportion of this balloon's movement through a region in the play area, dependent
   * on the direction of movement.  Returns a number out of 1 (full range of the region).  If moving
   * horizontally, progress will be proportion of width.  If moving vertically, progress will be
   * a proportion of the height.
   */
  public getProgressThroughRegion(): number {

    let range;
    let difference;
    if ( this.movingHorizontally() || this.movingDiagonally() ) {
      // @ts-expect-error
      range = PlayAreaMap.COLUMN_RANGES[ this.playAreaColumnProperty.get() ];
        difference = this.getCenter().x - range.min;
    }
    else if ( this.movingVertically() ) {
      // @ts-expect-error
      range = PlayAreaMap.ROW_RANGES[ this.playAreaRowProperty.get() ];
        difference = this.getCenter().y - range.min;
    }

    // TODO: This seems too downstream to be a good solution. Why don't we apply to the above cases during phet-io-state fuzz? https://github.com/phetsims/balloons-and-static-electricity/issues/575
    if ( !range ) {
      return 0;
    }

    // determine how far we are through the region
    // @ts-expect-error
    let progress = difference / range.getLength();

    // progress is the difference of the calculated proportion if moving to the left or up
    const direction = this.directionProperty.get();
    if ( direction === BalloonDirectionEnum.LEFT || direction === BalloonDirectionEnum.UP ) {
      progress = 1 - progress;
    }

    assert && assert( typeof progress === 'number' && progress >= 0, 'no progress through play area region was determined.' );
    return progress;
  }

  /**
   * Set the center position of the balloon. Sets the position Property but with an offset to account
   * for the balloon dimensions.
   * @param center
   */
  public setCenter( center: Vector2 ): void {
    this.positionProperty.set( new Vector2(
      center.x - this.width / 2,
      center.y - this.height / 2
    ) );
  }

  /**
   * Get the center position of the balloon.
   */
  public getCenter(): Vector2 {
    return new Vector2( this.positionProperty.get().x + this.width / 2, this.positionProperty.get().y + this.height / 2 );
  }

  /**
   * Get the vertical center of the balloon model.
   */
  public getCenterY(): number {
    return this.positionProperty.get().y + this.height / 2;
  }

  /**
   * Get the horizontal center position of the balloon.
   */
  public getCenterX(): number {
    return this.positionProperty.get().x + this.width / 2;
  }

  /**
   * Get the right edge of the balloon.
   */
  public getRight(): number {
    return this.positionProperty.get().x + this.width;
  }

  /**
   * Get the model position of the left edge of the balloon.
   */
  public getLeft(): number {
    return this.positionProperty.get().x;
  }

  /**
   * Balloon charges aren't evenly distributed throughout the balloon, they conform to the upper left edge of the
   * balloon image, placed by visual inspection.  This returns a Vector2 pointing to what is approximately the center
   * of the balloon charges.  In x, this remains the center of the model bounds.  In y, this is the top of the
   * balloon plus the average y position of the charges.
   */
  public getChargeCenter(): Vector2 {
    const centerX = this.getCenter().x;
    const centerY = this.positionProperty.get().y + AVERAGE_CHARGE_Y;
    return new Vector2( centerX, centerY );
  }

  /**
   * Get the position of the left touch point of the balloon against the sweater. If the balloon center is to the
   * right of the sweater edge, use  the left edge of the balloon. Otherwise, use the balloon center.
   */
  public getSweaterTouchingCenter(): Vector2 {
    const sweater = this.balloonsAndStaticElectricityModel.sweater;
    const sweaterRight = sweater.x + sweater.width;

    let centerX;
    if ( this.getCenter().x > sweaterRight ) {
      centerX = this.positionProperty.get().x;
    }
    else {
      centerX = this.getCenter().x;
    }

    return new Vector2( centerX, this.getCenterY() );
  }

  /**
   * Returns whether or not this balloon has any charge. Just a helper function for convenience and readability.
   */
  public isCharged(): boolean {

    // value will be negative (electrons)
    return this.chargeProperty.get() < 0;
  }

  /**
   * Returns true if this balloon is both inducing charge and visible. Helper function for readability.
   */
  public inducingChargeAndVisible(): boolean {
    return this.isVisibleProperty.get() && this.inducingChargeProperty.get();
  }

  /**
   * Whether this balloon is inducing charge in the wall. For the balloon to be inducing charge in the wall, this
   * balloon must be visible, the wall must be visible, and the force between wall and balloon must be large enough.
   */
  public inducingCharge( wallVisible: boolean ): boolean {

    // if there is no charge close to the balloon, immediately return false
    if ( !this.closestChargeInWall ) {
      return false;
    }

    // otherwise, wall and balloon must be visible, and force must be large enough
    const balloonForce = BalloonModel.getForceToClosestWallCharge( this );
    const forceLargeEnough = this.balloonsAndStaticElectricityModel.wall.forceIndicatesInducedCharge( balloonForce );
    return wallVisible && this.isVisibleProperty.get() && forceLargeEnough;
  }

  /**
   * Reset balloons to initial position and uncharged state. By default, this will also reset visibility.
   * @param notResetVisibility - if true, visibility will NOT be reset
   */
  public reset( notResetVisibility?: boolean ): void {
    this.xVelocityArray = Object.assign( [ 0, 0, 0, 0, 0 ], { counter: 0 } );
    assert && assert( this.xVelocityArray.length = VELOCITY_ARRAY_LENGTH, 'velocity array incorrectly initialized' );

    this.yVelocityArray = Object.assign( [ 0, 0, 0, 0, 0 ], { counter: 0 } );
    assert && assert( this.yVelocityArray.length = VELOCITY_ARRAY_LENGTH, 'velocity array incorrectly initialized' );

    this.chargeProperty.reset();
    this.velocityProperty.reset();
    this.positionProperty.reset();
    this.directionProperty.reset();
    if ( !notResetVisibility ) {
      this.isVisibleProperty.reset();
    }
    this.isDraggedProperty.reset();

    this.successfulPickUp = false;

    // broadcast a message when we are reset
    this.resetEmitter.emit();
  }

  /**
   * Steps the BalloonModel.
   * @param model
   * @param dtSeconds - elapsed time in seconds
   */
  public step( model: BASEModel, dtSeconds: number ): void {

    // seconds to milliseconds - really, the model is fairly 'unitless' but multiplying the
    // time step by 1000 makes the sim look and feel like the Java version
    let dt = dtSeconds * 1000;

    // limit large values of dt - they probably mean that the sim just regained focus
    if ( dt > 500 ) {
      dt = 1 / 60 * 1000; // nominal time stamp at 60 fps
    }

    if ( this.isDraggedProperty.get() ) {

      // drag the balloon, which may cause it to pick up charges
      this.dragBalloon( model, dt );
    }
    else {
      this.applyForce( dt );

      // increment the time since release
      this.timeSinceRelease += dt;
    }
    this.oldPosition = this.positionProperty.get().copy();
  }

  /**
   * When balloon is dragged, check to see if we catch a minus charge.  Returns a boolean
   * that indicates whether or not a charge was picked up.
   * @param model
   * @param dt
   * @returns chargeFound
   */
  public dragBalloon( model: BASEModel, dt: number ): boolean {

    // Prevent a fuzzer error that tries to drag the balloon before step is called.
    if ( !this.oldPosition ) {
      return false;
    }
    const vx = ( this.positionProperty.get().x - this.oldPosition.x ) / dt;
    const vy = ( this.positionProperty.get().y - this.oldPosition.y ) / dt;

    // calculate average velocity
    this.xVelocityArray[ this.xVelocityArray.counter++ ] = vx * vx;
    this.xVelocityArray.counter %= VELOCITY_ARRAY_LENGTH;
    this.yVelocityArray[ this.yVelocityArray.counter++ ] = vy * vy;
    this.yVelocityArray.counter %= VELOCITY_ARRAY_LENGTH;

    let averageX = 0;
    let averageY = 0;
    for ( let i = 0; i < VELOCITY_ARRAY_LENGTH; i++ ) {
      averageX += this.xVelocityArray[ i ];
      averageY += this.yVelocityArray[ i ];
    }
    averageX /= VELOCITY_ARRAY_LENGTH;
    averageY /= VELOCITY_ARRAY_LENGTH;

    // if average speed larger than threshold speed we try to move minus charges from sweater to balloon
    const speed = Math.sqrt( averageX * averageX + averageY * averageY );

    this.dragVelocityProperty.set( new Vector2( vx, vy ) );

    let chargeFound = false;
    if ( speed > 0 ) {
      chargeFound = model.sweater.checkAndTransferCharges( this );
    }

    return chargeFound;
  }

  /**
   * Get the force between this balloon and the sweater.
   * @param sweaterModel
   */
  public getSweaterForce( sweaterModel: SweaterModel ): Vector2 {
    return BalloonModel.getForce(
      sweaterModel.center,
      this.getCenter(),
      -BalloonModel.FORCE_CONSTANT * sweaterModel.chargeProperty.get() * this.chargeProperty.get()
    );
  }

  /**
   * Returns whether or not the balloon is touching the boundary of the play area, including the bottom, left
   * and top edges, or the right edge or wall depending on wall visibility.
   */
  public isTouchingBoundary(): boolean {
    return this.isTouchingRightBoundary() || this.isTouchingLeftBoundary() ||
           this.isTouchingBottomBoundary() || this.isTouchingTopBoundary();
  }

  /**
   * Returns whether or not the balloon is touching the right boundary of the play area.  If the wall
   * is visible, this will be the position where the balloon is touching the wall, otherwise it will
   * be the position where the balloon is touching the right edge of the play area.
   */
  public isTouchingRightBoundary(): boolean {
    const balloonX = this.getCenter().x;
    if ( this.balloonsAndStaticElectricityModel.wall.isVisibleProperty.get() ) {
      return PlayAreaMap.X_POSITIONS.AT_WALL === balloonX;
    }
    else {
      return PlayAreaMap.X_BOUNDARY_POSITIONS.AT_RIGHT_EDGE === balloonX;
    }
  }

  /**
   * Returns whether or not the balloon is touching the right most edge of the play area (should be impossible
   * if the wall is invisible)
   */
  public isTouchingRightEdge(): boolean {
    const balloonX = this.getCenterX();
    return PlayAreaMap.X_BOUNDARY_POSITIONS.AT_RIGHT_EDGE === balloonX;
  }

  /**
   * Returns whether or not the balloon is touching the bottom boundary of the play area.
   */
  public isTouchingBottomBoundary(): boolean {
    return PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_BOTTOM === this.getCenterY();
  }

  public isTouchingLeftBoundary(): boolean {
    return PlayAreaMap.X_BOUNDARY_POSITIONS.AT_LEFT_EDGE === this.getCenterX();
  }

  /**
   * Returns whether or not the balloon is touching the top boundary of the play area.
   */
  public isTouchingTopBoundary(): boolean {
    return PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_TOP === this.getCenterY();
  }

  /**
   * Apply a force on this balloon, and move it to new coordinates.  Also updates the velocity.
   * @param dt - in seconds
   */
  private applyForce( dt: number ): void {

    // only move if this balloon is not over the sweater
    const model = this.balloonsAndStaticElectricityModel;
    if ( !this.centerInSweaterChargedArea() ) {

      const rightBound = model.playAreaBounds.maxX;
      const force = this.getTotalForce();
      const newVelocity = this.velocityProperty.get().plus( force.timesScalar( dt ) );
      const newPosition = this.positionProperty.get().plus( this.velocityProperty.get().timesScalar( dt ) );

      if ( newPosition.x + this.width >= rightBound ) {

        // trying to go beyond right bound
        newPosition.x = rightBound - this.width;

        if ( newVelocity.x > 0 ) {
          newVelocity.x = 0;

          // If this balloon is pushing up against the wall and it is being stopped from moving in the X direction as a
          // result, stop it from moving in the Y direction too.  This is realistic, since there would likely be a fair
          // amount of friction at the balloon/wall interface, and helps to prevent some odd behaviors, see
          // https://github.com/phetsims/balloons-and-static-electricity/issues/544.
          if ( this.touchingWallProperty.value ) {
            newVelocity.y = 0;
          }
        }
      }
      if ( newPosition.y + this.height >= model.playAreaBounds.maxY ) {

        // trying to go beyond bottom bound
        newPosition.y = model.playAreaBounds.maxY - this.height;
        newVelocity.y = newVelocity.y > 0 ? 0 : newVelocity.y;
      }
      if ( newPosition.x <= model.playAreaBounds.minX ) {

        // trying to go  beyond left bound
        newPosition.x = model.playAreaBounds.minX;
        newVelocity.x = newVelocity.x < 0 ? 0 : newVelocity.x;
      }
      if ( newPosition.y <= model.playAreaBounds.minY ) {
        newPosition.y = model.playAreaBounds.minY;
        newVelocity.y = newVelocity.y < 0 ? 0 : newVelocity.y;
      }

      // update position before velocity so that listeners associated with velocity can reference the correct
      // position on updated velocity
      this.positionProperty.set( newPosition );
      this.velocityProperty.set( newVelocity );
    }
    else {
      this.velocityProperty.set( Vector2.ZERO );
    }
  }

  /**
   * Get the total force on this balloon.  The balloon will feel forces from all objects in the play area, including
   * the sweater, the wall, and the other balloon if it is visible.
   */
  private getTotalForce(): Vector2 {
    const model = this.balloonsAndStaticElectricityModel;
    if ( model.wall.isVisibleProperty.get() ) {
      const distFromWall = model.wall.x - this.positionProperty.get().x;

      // if the balloon has enough charge and is close enough to the wall, the wall attracts it more than the sweater
      if ( this.chargeProperty.get() < -5 ) {
        const relDist = distFromWall - this.width;
        const fright = 0.003;
        if ( relDist <= 40 + this.chargeProperty.get() / 8 ) {
          return new Vector2( -fright * this.chargeProperty.get() / 20.0, 0 );
        }
      }
    }

    const force = this.getSweaterForce( model.sweater );
    const other = this.getOtherBalloonForce();
    const sumOfForces = force.plus( other );

    // Don't allow the force to be too high or the balloon can jump across the screen in 1 step, see #67
    const mag = sumOfForces.magnitude;
    const max = 1E-2;
    if ( mag > max ) {
      sumOfForces.normalize();
      sumOfForces.multiplyScalar( max );
    }
    return sumOfForces;
  }

  /**
   * Get the force on this balloon model from another balloon model. If the other balloon is being dragged, or is
   * invisible, zero is returned. See getForce() for the actual force calculation
   */
  public getOtherBalloonForce(): Vector2 {
    if ( this.isDraggedProperty.get() || !this.isVisibleProperty.get() || !this.other.isVisibleProperty.get() ) {
      return new Vector2( 0, 0 );
    }
    const kqq = BalloonModel.FORCE_CONSTANT * this.chargeProperty.get() * this.other.chargeProperty.get();
    return BalloonModel.getForce( this.getCenter(), this.other.getCenter(), kqq );
  }


  /**
   * Calculate the force between to charged objects using Coulomb's law.  This allows the client to provide a
   * different value for the exponent used on the radius, which can be used to tweak the visual performance of the
   * simulation.
   * @param p1 - position of the first object
   * @param p2 - position of the second object
   * @param kqq - some constant times the two charges
   * @param power - optional, default of 2, but 1 is added so the acceleration is exaggerated
   */
  public static getForce( p1: Vector2, p2: Vector2, kqq: number, power?: number ): Vector2 {

    // power defaults to 2
    power = power || 2;

    // calculate a vector from one point to the other
    const difference = p1.minus( p2 );
    const r = difference.magnitude;

    // if the points are right on top of one another, return an attraction value of zero
    if ( r === 0 ) {
      return new Vector2( 0, 0 );
    }

    // make this a unit vector
    difference.setMagnitude( 1 );

    // scale by the force value
    return difference.timesScalar( kqq / ( Math.pow( r, power ) ) );
  }

  /**
   * Get the force on a balloon from the closest charge to the balloon in the wall.
   * @param balloon
   */
  public static getForceToClosestWallCharge( balloon: BalloonModel ): Vector2 {
    return BalloonModel.getForce(
      balloon.closestChargeInWall!.positionProperty.get(),
      balloon.getCenter(),
      BASEConstants.COULOMBS_LAW_CONSTANT * balloon.chargeProperty.get() * PointChargeModel.CHARGE,
      2.35
    );
  }

  /**
   * Get the direction of movement that would take you from point A to point B, returning one of BalloonDirectionEnum,
   * LEFT, RIGHT,  UP, DOWN,  UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT. Uses Math.atan2, so the angle is mapped from
   * 0 to +/- Math.PI.
   * @param pointA
   * @param pointB
   * @returns one of BalloonDirectionEnum
   */
  public static getDirection( pointA: Vector2, pointB: Vector2 ): string | null {
    let direction;

    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    const angle = Math.atan2( dy, dx );

    // atan2 wraps around Math.PI, so special check for moving left from absolute value
    if ( DIRECTION_MAP.LEFT.contains( Math.abs( angle ) ) ) {
      direction = BalloonDirectionEnum.LEFT;
    }

    // otherwise, angle will be in one of the ranges in DIRECTION_MAP
    for ( let i = 0; i < DIRECTION_MAP_KEYS.length; i++ ) {
      const key = DIRECTION_MAP_KEYS[ i ] as keyof typeof DIRECTION_MAP;
      const entry = DIRECTION_MAP[ key ];
      if ( entry.contains( angle ) ) {
        direction = BalloonDirectionEnum[ key as keyof typeof BalloonDirectionEnum ] as string;
        break;
      }
    }

    return direction || null;
  }
}

balloonsAndStaticElectricity.register( 'BalloonModel', BalloonModel );

export default BalloonModel;