// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the wall of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var TandemNode = require( 'TANDEM/scenery/nodes/TandemNode' );
  var TandemImage = require( 'TANDEM/scenery/nodes/TandemImage' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Range = require( 'DOT/Range' );
  var AccessibleNode = require( 'SCENERY/accessibility/AccessibleNode' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // constants
  // these charge ranges determine description of induced charge
  var A_LITTLE_BIT_RANGE = new Range( 1, 20 );
  var A_LOT_RANGE = new Range( 20, 40 );
  var QUITE_A_LOT_RANGE = new Range( 40, 60 );

  // images
  var wallImage = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/wall.png' );

  /**
   * @constructor
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {Tandem} tandem
   */
  function WallNode( model, tandem ) {
    var self = this;

    // @private
    this.model = model;

    var wallModel = model.wall;

    AccessibleNode.call( this, {
      pickable: false,

      // accessibility options
      tagName: 'div',
      labelTagName: 'h3',
      label: BASEA11yStrings.wallLabelString,
      descriptionTagName: 'p'
    } );

    this.translate( wallModel.x, 0 );

    // add the background
    this.wallNode = new TandemImage( wallImage, { tandem: tandem.createTandem( 'wallNode' ) } );
    this.addChild( this.wallNode );

    var plusChargesNode = new TandemNode( { tandem: tandem.createTandem( 'plusChargesNode' ) } );
    var minusChargesNode = new TandemNode( {
      layerSplit: true,
      tandem: tandem.createTandem( 'minusChargesNode' )
    } );
    plusChargesNode.translate( -wallModel.x, 0 );
    minusChargesNode.translate( -wallModel.x, 0 );

    //draw plusCharges on the wall
    var plusChargeNodesTandemGroup = tandem.createGroupTandem( 'plusChargeNodes' );
    wallModel.plusCharges.forEach( function( entry ) {
      entry.view = new PlusChargeNode( entry.locationProperty, plusChargeNodesTandemGroup.createNextTandem() );
      plusChargesNode.addChild( entry.view );
    } );

    //draw minusCharges on the wall
    var minusChargeNodesTandemGroup = tandem.createGroupTandem( 'minusChargeNodes' );
    wallModel.minusCharges.forEach( function( entry ) {
      entry.view = new MinusChargeNode( entry.locationProperty, minusChargeNodesTandemGroup.createNextTandem() );
      entry.locationProperty.link( function updateLocation( location ) {
        entry.view.setTranslation( location.x + PointChargeModel.RADIUS, location.y + PointChargeModel.RADIUS );
      } );
      minusChargesNode.addChild( entry.view );
    } );

    this.addChild( plusChargesNode );
    this.addChild( minusChargesNode );

    wallModel.isVisibleProperty.link( function updateWallVisibility( isVisible ) {
      self.visible = isVisible;

      self.setHidden( !isVisible );
    } );

    //show charges based on draw  property
    model.showChargesProperty.link( function switchWallChargesView( value ) {
      plusChargesNode.visible = (value === 'all');
      minusChargesNode.visible = (value === 'all');
    } );

    // a11y - when the balloons change position, we need to update the wall description
    model.balloons.forEach( function( balloon ) {
      balloon.locationProperty.link( function( location ) {
        var newDescription = self.getChargeDescription();
        self.setDescription( newDescription );
      } );
    } );
  }

  balloonsAndStaticElectricity.register( 'WallNode', WallNode );

  return inherit( AccessibleNode, WallNode, {

    /**
     * Get a description of the wall charges, based on balloon positions and charges.
     *
     * @return {string}
     */
    getChargeDescription: function() {
      var chargeDescription;

      var yellowBalloon = this.model.yellowBalloon;
      var greenBalloon = this.model.greenBalloon;

      var yellowBalloonTouchingWall = yellowBalloon.touchingWall();
      var greenBalloonTouchingWall = greenBalloon.touchingWall();

      if ( !yellowBalloonTouchingWall && !greenBalloonTouchingWall ) {
        chargeDescription = BASEA11yStrings.wallNeutralChargeDescriptionString;
      }
      else {
        var yellowBalloonInducedChargeDescription;
        var greenBalloonInducedChargeDescription;

        if ( yellowBalloonTouchingWall ) {
          yellowBalloonInducedChargeDescription = StringUtils.format(
            BASEA11yStrings.balloonTouchPointDescriptionPatternString,
            BASEA11yStrings.yellowBalloonString,
            this.getInducedChargeDescription( yellowBalloon )
          );
        }

        if ( greenBalloon.isVisibleProperty.get() && greenBalloonTouchingWall ) {
          greenBalloonInducedChargeDescription = StringUtils.format(
            BASEA11yStrings.balloonTouchPointDescriptionPatternString,
            BASEA11yStrings.greenBalloonString,
            this.getInducedChargeDescription( greenBalloon )
          );
        }

        // if both balloons are touching the wall, both induced charge descriptions need to be included
        if ( yellowBalloonInducedChargeDescription && greenBalloonInducedChargeDescription ) {
          chargeDescription = StringUtils.format(
            BASEA11yStrings.twoBalloonsTouchingWallPatternString, BASEA11yStrings.wallNeutralChargeDescriptionString,
            yellowBalloonInducedChargeDescription, greenBalloonInducedChargeDescription
          );
        }
        else {

          // if only one is touching the wall, describe that one
          var inducedChargeDescription = yellowBalloonInducedChargeDescription || greenBalloonInducedChargeDescription;

          chargeDescription = StringUtils.format(
            BASEA11yStrings.oneBalloonTouchingWallPatternString,
            BASEA11yStrings.wallNeutralChargeDescriptionString,
            inducedChargeDescription
          );
        }
      }

      assert && assert( chargeDescription, 'No description found for wall' );
      return chargeDescription;
    },

    /**
     * Get an induced charge description for a balloon, based on charge of the balloon
     * @param  {Balloon} balloon
     * @return {string}
     */
    getInducedChargeDescription: function( balloon ) {

      // the balloon must be touching the wall for the wall to have this description
      // Note that even though charge can be induced without physically touching the wall, this description can only be
      // found with the virtual cursor
      assert && assert( balloon.touchingWall(), 'induced charge description should only be added when balloon is touching wall' );

      var changeInChargesString;
      var balloonCharge = Math.abs( balloon.chargeProperty.get() );
      if ( balloonCharge === 0 ) {

        // if the charge is zero, there is no induced charge
        changeInChargesString = BASEA11yStrings.noChangeInChargesString;
      }
      else if ( A_LITTLE_BIT_RANGE.contains( balloonCharge ) ) {
        changeInChargesString = StringUtils.format( BASEA11yStrings.chargeDescriptionPatternString, BASEA11yStrings.aLittleBitString );
      }
      else if ( A_LOT_RANGE.contains( balloonCharge ) ) {
        changeInChargesString = StringUtils.format( BASEA11yStrings.chargeDescriptionPatternString, BASEA11yStrings.aLotString );
      }
      else if ( QUITE_A_LOT_RANGE.contains( balloonCharge ) ) {
        changeInChargesString = StringUtils.format( BASEA11yStrings.chargeDescriptionPatternString, BASEA11yStrings.quiteALotString );
      }

      assert && assert( changeInChargesString, 'No for description for balloon touching wall' );
      return changeInChargesString;
    }
  } );
} );
