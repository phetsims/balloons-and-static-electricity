// Copyright 2013-2026, University of Colorado Boulder

/**
 * Main model container, which has wall, balloons & sweater.
 *
 * @author Vasily Shakhov (Mlearner.com)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BASEConstants from '../BASEConstants.js';
import BalloonModel from './BalloonModel.js';
import PlayAreaMap from './PlayAreaMap.js';
import ScanningPropertySet from './ScanningPropertySet.js';
import ShowChargesValues, { ShowChargesConstValues } from './ShowChargesValues.js';
import SweaterModel from './SweaterModel.js';
import WallModel from './WallModel.js';

export default class BASEModel {

  // charge visibility setting, valid values of 'allCharges', 'noCharges', 'chargeDifferences'
  public readonly showChargesProperty: StringUnionProperty<ShowChargesValues>;

  // whether the two balloons are considered 'next to' each other, primarily used for a11y
  public readonly balloonsAdjacentProperty: Property<boolean>;

  public readonly width = BASEConstants.WIDTH;
  public readonly height = BASEConstants.HEIGHT;

  public readonly wallWidth = 80;

  // Model of the sweater, position empirically determined to match design
  public readonly sweater: SweaterModel;

  // bounds for the area where balloons can move, excluding the wall when it is visible
  public readonly playAreaBounds: Bounds2;

  public readonly yellowBalloon: BalloonModel;
  public readonly greenBalloon: BalloonModel;

  // set of Properties that indicate where the user is while scanning for objects in the play area
  public readonly scanningPropertySet: ScanningPropertySet;

  // Model of the wall
  public readonly wall: WallModel;

  // broadcasts an event when we step the model
  public readonly stepEmitter: Emitter<[ number ]>;

  public constructor( tandem: Tandem ) {

    this.showChargesProperty = new StringUnionProperty<ShowChargesValues>( 'allCharges', {
      validValues: ShowChargesConstValues,
      tandem: tandem.createTandem( 'showChargesProperty' ),
      phetioFeatured: true
    } );

    this.balloonsAdjacentProperty = new Property( false );

    this.sweater = new SweaterModel( 25, 20, tandem.createTandem( 'sweater' ) );

    this.playAreaBounds = new Bounds2( 0, 0, this.width - this.wallWidth, this.height );
    this.yellowBalloon = new BalloonModel( 440, 100, this, {
      defaultVisibility: true,
      tandem: tandem.createTandem( 'yellowBalloon' )
    } );
    this.greenBalloon = new BalloonModel( 380, 130, this, {
      defaultVisibility: false,
      tandem: tandem.createTandem( 'greenBalloon' ),
      isVisiblePropertyPhetioReadOnly: false,
      isVisiblePropertyPhetioFeatured: true
    } );

    // assign 'other' balloon references
    this.yellowBalloon.other = this.greenBalloon;
    this.greenBalloon.other = this.yellowBalloon;

    this.scanningPropertySet = new ScanningPropertySet();

    this.wall = new WallModel( this.width - this.wallWidth, this.wallWidth, this.height, this.yellowBalloon, this.greenBalloon, tandem.createTandem( 'wall' ) );

    this.stepEmitter = new Emitter( {
      parameters: [ { valueType: 'number' } ]
    } );

    // when the wall changes visibility, the balloons could start moving if they have charge and are near the wall
    this.wall.isVisibleProperty.link( isVisible => {

      // update the model bounds
      const newWidth = isVisible ? this.width - this.wallWidth : this.width;
      this.playAreaBounds.setMaxX( newWidth );
    } );

    // add listeners to each balloon
    this.balloons.forEach( balloon => {

      // when the balloon positions change, update the closest charge in the wall
      balloon.positionProperty.link( () => {

        // find the closest charge in the wall
        balloon.closestChargeInWall = this.wall.getClosestChargeToBalloon( balloon );

        // update whether the two balloons are close to each other
        this.balloonsAdjacentProperty.set( this.getBalloonsAdjacent() );

        // update the balloon play area row and column
        balloon.playAreaRowProperty.set( PlayAreaMap.getPlayAreaRow( balloon.getCenter() ) );
        balloon.playAreaColumnProperty.set( PlayAreaMap.getPlayAreaColumn( balloon.getCenter(), this.wall.isVisibleProperty.get() ) );
        balloon.playAreaLandmarkProperty.set( PlayAreaMap.getPlayAreaLandmark( balloon.getCenter(), this.wall.isVisibleProperty.get() ) );
      } );

      // when wall visibility changes, update the Properties indicating induced charge and which charges are visible
      this.wall.isVisibleProperty.link( () => {
        balloon.touchingWallProperty.set( balloon.touchingWall() );
      } );

      // update whether the balloon is currently inducing charge in the wall
      Multilink.multilink( [ this.wall.isVisibleProperty, balloon.positionProperty ], wallVisible => {
        balloon.inducingChargeProperty.set( balloon.inducingCharge( wallVisible ) );
      } );
    } );

    this.reset();
  }


  /**
   * Get all the ballons in an array, for ease of iterating over them.
   *
   * TODO: Don't make this a getter, make this a public readonly variable. https://github.com/phetsims/balloons-and-static-electricity/issues/601
   */
  public get balloons(): BalloonModel[] {
    return [ this.yellowBalloon, this.greenBalloon ];
  }

  /**
   * Called by the animation loop.
   */
  public step( dt: number ): void {
    this.balloons.forEach( balloon => {
      if ( balloon.isVisibleProperty.get() ) {
        balloon.step( this, dt );
      }
    } );

    this.stepEmitter.emit( dt );
  }

  /**
   * Reset the entire model.
   */
  public reset(): void {

    // Reset the properties in this model
    this.showChargesProperty.reset();

    // Reset balloons, resetChildren don't get them
    this.balloons.forEach( balloon => {
      balloon.reset( false );
    } );

    this.sweater.reset();
    this.wall.reset();
  }

  /**
   * Return true when both balloons are visible.
   */
  public bothBalloonsVisible(): boolean {
    return this.greenBalloon.isVisibleProperty.get() && this.yellowBalloon.isVisibleProperty.get();
  }

  /**
   * Returns true when both balloons are visible and adjacent to each other.
   */
  public getBalloonsAdjacent(): boolean {
    const balloonsAdjacent = ( this.yellowBalloon.getCenter().minus( this.greenBalloon.getCenter() ).magnitude ) < BalloonModel.BALLOON_WIDTH;
    return balloonsAdjacent && this.bothBalloonsVisible();
  }
}
