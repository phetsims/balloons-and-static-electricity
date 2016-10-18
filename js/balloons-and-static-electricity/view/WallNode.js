// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the wall of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var Range = require( 'DOT/Range' );
  var AccessibleNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleNode');
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // constants
  // these charge ranges determine description of induced charge
  var A_LITTLE_BIT_RANGE = new Range( 1, 20 );
  var A_LOT_RANGE = new Range( 20, 40 );
  var QUITE_A_LOT_RANGE = new Range( 40, 60 );

  // strings
  var wallLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/wall.label' );
  var wallNeutralChargeDescriptionString = 'Wall has a net neutral charge, many pairs of negative and positive charges.';

  // Wall has a net neutral charge, many pairs of negative and positive charges.
  // At yellow balloon touch point, no change in charges.
  // At green balloon touch point, negative charges in wall move away from balloon a little bit.
  var twoBalloonsTouchingWallPatternString = '{0}. {1}. {2}.';
  var oneBalloonTouchingWallPatternString = '{0} {1}';
  var balloonTouchPointDescriptionPatternString = 'At {0} touch point, {1}';
  var chargeDescriptionPatternString = 'negative charges in wall move away from balloon {0}.  Positive charges do not move.';

  var noChangeInChargesString = 'no change in charges';
  var aLittleBitString = 'a little bit';
  var aLotString = 'a lot';
  var quiteALotString = 'quite a lot';

  var yellowBalloonString = 'yellow balloon';
  var greenBalloonString = 'green balloon';

  // images
  var wallImage = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/wall.png' );

  function WallNode( model ) {
    var self = this;

    // @private
    this.model = model;

    var wallModel = model.wall;

    // super constructor
    AccessibleNode.call( this, null, { 
      pickable: false,

      // accessibility options
      tagName: 'div',
      labelTagName: 'h3',
      label: wallLabelString
    } );

    this.translate( wallModel.x, 0 );

    // add the background
    this.wallNode = new Image( wallImage );
    this.addChild( this.wallNode );

    var plusChargesNode = new Node();
    var minusChargesNode = new Node( { layerSplit: true } );
    plusChargesNode.translate( -wallModel.x, 0 );
    minusChargesNode.translate( -wallModel.x, 0 );

    //draw plusCharges on the wall
    wallModel.plusCharges.forEach( function( entry ) {
      entry.view = new PlusChargeNode( entry.location );
      plusChargesNode.addChild( entry.view );
    } );

    //draw minusCharges on the wall
    wallModel.minusCharges.forEach( function( entry ) {
      entry.view = new MinusChargeNode( entry.location );
      entry.locationProperty.link( function updateLocation( location ) {
        entry.view.setTranslation( location.x + PointChargeModel.radius, location.y + PointChargeModel.radius );
      } );
      minusChargesNode.addChild( entry.view );
    } );

    this.addChild( plusChargesNode );
    this.addChild( minusChargesNode );

    wallModel.isVisibleProperty.link( function updateWallVisibility( isVisible ) {
      self.visible = isVisible;
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

      var yellowBalloon = this.model.balloons[ 0 ];
      var greenBalloon = this.model.balloons[ 1 ];

      var yellowBalloonTouchingWall = yellowBalloon.touchingWall();
      var greenBalloonTouchingWall = greenBalloon.touchingWall();

      if ( !yellowBalloonTouchingWall && !greenBalloonTouchingWall ) {
        chargeDescription = wallNeutralChargeDescriptionString;
      }
      else {
        var yellowBalloonInducedChargeDescription;
        var greenBalloonInducedChargeDescription;

        if ( yellowBalloonTouchingWall ) {
          yellowBalloonInducedChargeDescription = StringUtils.format(
            balloonTouchPointDescriptionPatternString,
            yellowBalloonString,
            this.getInducedChargeDescription( yellowBalloon )
          );
        }

        if ( greenBalloon.isVisibleProperty.get() && greenBalloonTouchingWall ) {
          greenBalloonInducedChargeDescription = StringUtils.format(
            balloonTouchPointDescriptionPatternString,
            greenBalloonString,
            this.getInducedChargeDescription( greenBalloon )
          );
        }

        // if both balloons are touching the wall, both induced charge descriptions need to be included
        if ( yellowBalloonInducedChargeDescription && greenBalloonInducedChargeDescription ) {
          chargeDescription = StringUtils.format( 
            twoBalloonsTouchingWallPatternString, wallNeutralChargeDescriptionString,
            yellowBalloonInducedChargeDescription, greenBalloonInducedChargeDescription
          );
        }
        else {
          // if only one is touching the wall, describe that one
          var inducedChargeDescription = yellowBalloonInducedChargeDescription || greenBalloonInducedChargeDescription;

          chargeDescription = StringUtils.format(
            oneBalloonTouchingWallPatternString,
            wallNeutralChargeDescriptionString,
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
      // note that even though charge can be induced without physically touching the wall,
      // this description can only be found with the virtual cursor
      assert && assert( balloon.touchingWall(), 'induced charge description should only be added when balloon is touching wall' );

      var changeInChargesString;
      var balloonCharge = Math.abs( balloon.chargeProperty.get() );
      if ( balloonCharge === 0 ) {
        // if the charge is zero, there is no induced charge
        changeInChargesString = noChangeInChargesString;
      }
      else if ( A_LITTLE_BIT_RANGE.contains( balloonCharge ) ) {
        changeInChargesString = StringUtils.format( chargeDescriptionPatternString, aLittleBitString );
      }
      else if ( A_LOT_RANGE.contains( balloonCharge ) ) {
        changeInChargesString = StringUtils.format( chargeDescriptionPatternString, aLotString );
      }
      else if ( QUITE_A_LOT_RANGE.contains( balloonCharge ) ) {
        changeInChargesString = StringUtils.format( chargeDescriptionPatternString, quiteALotString );
      }

      assert && assert( changeInChargesString, 'No for description for balloon touching wall' );
      return changeInChargesString;
    }
  } );
} );
