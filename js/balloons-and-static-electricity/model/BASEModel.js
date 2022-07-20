// Copyright 2013-2022, University of Colorado Boulder

/**
 * Main model container, which has wall, balloons & sweater.
 *
 * @author Vasily Shakhov (Mlearner.com)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg(PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BalloonModel from './BalloonModel.js';
import PlayAreaMap from './PlayAreaMap.js';
import ScanningPropertySet from './ScanningPropertySet.js';
import SweaterModel from './SweaterModel.js';
import WallModel from './WallModel.js';

class BASEModel {

  /**
   * Constructor for main model for the Balloons and Static Electricity sim.
   * @param {number} width
   * @param {number} height
   * @param {Tandem} tandem
   */
  constructor( width, height, tandem ) {

    // @public {string} - charge visibility setting, valid values of 'all', 'none', 'diff'
    this.showChargesProperty = new StringProperty( 'all', {
      tandem: tandem.createTandem( 'showChargesProperty' )
    } );

    // @public {boolean} - whether or not the two balloons are considered 'next to' each other, primarily used for a11y
    this.balloonsAdjacentProperty = new Property( false );

    // @public (read-only)
    this.width = width;
    this.height = height;

    // @public {read-only}
    this.wallWidth = 80;

    // @public (read-only) - Model of the sweater, position empirically determined to match design
    this.sweater = new SweaterModel( 25, 20, tandem.createTandem( 'sweater' ) );

    // @public
    this.playAreaBounds = new Bounds2( 0, 0, width - this.wallWidth, height );
    this.yellowBalloon = new BalloonModel( 440, 100, this, true, tandem.createTandem( 'yellowBalloon' ) );
    this.greenBalloon = new BalloonModel( 380, 130, this, false, tandem.createTandem( 'greenBalloon' ) );

    // assign 'other' balloon references
    this.yellowBalloon.other = this.greenBalloon;
    this.greenBalloon.other = this.yellowBalloon;

    // @public - set of Properties that indicate where the user is while scanning for objects in the play area
    this.scanningPropertySet = new ScanningPropertySet();

    // @public (read-only) - Model of the wall
    this.wall = new WallModel( width - this.wallWidth, this.wallWidth, height, this.yellowBalloon, this.greenBalloon, tandem.createTandem( 'wall' ) );

    // @public - broadcasts an event when we step the model
    this.stepEmitter = new Emitter( {
      parameters: [ { valueType: 'number' } ]
    } );

    // when the wall changes visibility, the balloons could start moving if they have charge and are near the wall
    this.wall.isVisibleProperty.link( isVisible => {

      // update the model bounds
      const newWidth = isVisible ? width - this.wallWidth : width;
      this.playAreaBounds.setMaxX( newWidth );
    } );

    // add listeners to each balloon
    this.balloons.forEach( balloon => {

      // when the balloon positions change, update the closest charge in the wall
      balloon.positionProperty.link( position => {

        // find the closest charge in the wall
        balloon.closestChargeInWall = this.wall.getClosestChargeToBalloon( balloon );

        // update whether or not the two balloons are close to each other
        this.balloonsAdjacentProperty.set( this.getBalloonsAdjacent() );

        // update the balloon play area row and column
        balloon.playAreaRowProperty.set( PlayAreaMap.getPlayAreaRow( balloon.getCenter(), this.wall.isVisibleProperty.get() ) );
        balloon.playAreaColumnProperty.set( PlayAreaMap.getPlayAreaColumn( balloon.getCenter() ) );
        balloon.playAreaLandmarkProperty.set( PlayAreaMap.getPlayAreaLandmark( balloon.getCenter() ) );
      } );

      // when wall visibility changes, update the Properties indicating induced charge and which charges are visible
      this.wall.isVisibleProperty.link( isVisible => {
        balloon.touchingWallProperty.set( balloon.touchingWall() );
      } );

      // update whether the balloon is currently inducing charge in the wall
      Multilink.multilink( [ this.wall.isVisibleProperty, balloon.positionProperty ], ( wallVisible, position ) => {
        balloon.inducingChargeProperty.set( balloon.inducingCharge( wallVisible ) );
      } );
    } );

    this.reset();
  }


  /**
   * Get all of the ballons in an array, for ease of iterating over them.
   * @returns {BalloonModel[]}
   */
  get balloons() {
    return [ this.yellowBalloon, this.greenBalloon ];
  }

  /**
   * Called by the animation loop.
   * @public
   * @param {number} dt
   */
  step( dt ) {
    this.balloons.forEach( balloon => {
      if ( balloon.isVisibleProperty.get() ) {
        balloon.step( this, dt );
      }
    } );

    this.stepEmitter.emit( dt );
  }

  /**
   * Reset the entire model.
   * @public
   */
  reset() {

    //Reset the properties in this model
    this.showChargesProperty.reset();

    //Reset balloons, resetChildren don't get them
    this.balloons.forEach( balloon => {
      balloon.reset();
    } );

    this.sweater.reset();
    this.wall.reset();
  }

  /**
   * Return true when both balloons are visible.
   * @public
   *
   * @returns {boolean}
   */
  bothBalloonsVisible() {
    return this.greenBalloon.isVisibleProperty.get() && this.yellowBalloon.isVisibleProperty.get();
  }

  /**
   * Returns true when both balloons are visible and adjacent to each other.
   * @public
   *
   * @returns {boolean}
   */
  getBalloonsAdjacent() {
    const balloonsAdjacent = ( this.yellowBalloon.getCenter().minus( this.greenBalloon.getCenter() ).magnitude ) < BalloonModel.BALLOON_WIDTH;
    return balloonsAdjacent && this.bothBalloonsVisible();
  }
}


BASEModel.LEFT = 'LEFT';
BASEModel.RIGHT = 'RIGHT';
BASEModel.UP = 'UP';
BASEModel.DOWN = 'DOWN';
BASEModel.UP_LEFT = 'UP_LEFT';
BASEModel.UP_RIGHT = 'UP_RIGHT';
BASEModel.DOWN_LEFT = 'DOWN_LEFT';
BASEModel.DOWN_RIGHT = 'DOWN_RIGHT';

balloonsAndStaticElectricity.register( 'BASEModel', BASEModel );

export default BASEModel;