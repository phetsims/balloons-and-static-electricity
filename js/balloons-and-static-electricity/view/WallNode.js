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
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Range = require( 'DOT/Range' );
  var BalloonsAndStaticElectricityDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonsAndStaticElectricityDescriber' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // images
  var wallImage = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/wall.png' );

  // strings
  var aLittleBitString = BASEA11yStrings.aLittleBitString;
  var aLotString = BASEA11yStrings.aLotString;
  var quiteALotString = BASEA11yStrings.quiteALotString;
  var inducedChargePatternString = BASEA11yStrings.inducedChargePatternString;

  // constants
  var INDUCED_CHARGE_DESCRIPTION_MAP = {
    A_LITTLE_BIT: {
      range: new Range( 0, 10 ),
      description: aLittleBitString
    },
    A_LOT: {
      range: new Range( 10, 20 ),
      description: aLotString
    },
    QUITE_A_LOT: {
      range: new Range( 20, Number.MAX_VALUE ),
      description: quiteALotString
    }
  };

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

    Node.call( this, {
      pickable: false,

      // accessibility options
      tagName: 'div',
      labelTagName: 'h3',
      accessibleLabel: BASEA11yStrings.wallLabelString,
      descriptionTagName: 'p'
    } );

    this.translate( wallModel.x, 0 );

    // add the background
    this.wallNode = new Image( wallImage, { tandem: tandem.createTandem( 'wallNode' ) } );
    this.addChild( this.wallNode );

    var plusChargesNode = new Node( { tandem: tandem.createTandem( 'plusChargesNode' ) } );
    var minusChargesNode = new Node( {
      layerSplit: true,
      tandem: tandem.createTandem( 'minusChargesNode' )
    } );
    plusChargesNode.translate( -wallModel.x, 0 );
    minusChargesNode.translate( -wallModel.x, 0 );

    //draw plusCharges on the wall
    var plusChargeNodesTandemGroup = tandem.createGroupTandem( 'plusChargeNodes' );
    wallModel.plusCharges.forEach( function( entry ) {
      var plusChargeNode = new PlusChargeNode( entry.location, plusChargeNodesTandemGroup.createNextTandem() );
      plusChargesNode.addChild( plusChargeNode );
    } );

    //draw minusCharges on the wall
    var minusChargeNodesTandemGroup = tandem.createGroupTandem( 'minusChargeNodes' );
    wallModel.minusCharges.forEach( function( entry ) {
      var minusChargeNode = new MinusChargeNode( entry.location, minusChargeNodesTandemGroup.createNextTandem() );
      entry.locationProperty.link( function updateLocation( location ) {
        minusChargeNode.setTranslation( location.x + PointChargeModel.RADIUS, location.y + PointChargeModel.RADIUS );
      } );
      minusChargesNode.addChild( minusChargeNode );
    } );

    this.addChild( plusChargesNode );
    this.addChild( minusChargesNode );

    wallModel.isVisibleProperty.link( function updateWallVisibility( isVisible ) {
      self.visible = isVisible;

      self.setAccessibleHidden( !isVisible );
    } );

    //show charges based on draw  property
    model.showChargesProperty.link( function switchWallChargesView( value ) {
      plusChargesNode.visible = (value === 'all');
      minusChargesNode.visible = (value === 'all');
    } );
  }

  balloonsAndStaticElectricity.register( 'WallNode', WallNode );

  return inherit( Node, WallNode, {

    /**
     * Get an induced charge description for a balloon, based on the positions of charges in the wall.  We find the
     * closest charge to the balloon, and determine how far it has been displaced from its initial position. Will return
     * null if there is no induced charge.
     *
     * @private
     * @param  {Balloon} balloon
     * @returns {string|null}
     */
    getInducedChargeAmountDescription: function( balloon ) {

      // if large enough, return a description based on the displacement
      var inducedChargeDescription = null;
      if ( balloon.inducingCharge ) {
        var descriptionKeys = Object.keys( INDUCED_CHARGE_DESCRIPTION_MAP );
        for ( var j = 0; j < descriptionKeys.length; j++ ) {
          var value = INDUCED_CHARGE_DESCRIPTION_MAP[ descriptionKeys[ j ] ];
          if ( value.range.contains( balloon.closestChargeInWall.getDisplacement() ) ) {
            inducedChargeDescription = value.description;
          }
        }
      }

      return inducedChargeDescription;
    },

    /**
     * Get the induced charge description for the wall.  The description is contains the location of the displaced
     * charges, which balloon is inducing charge, and how much a relative description of how much induced charge there
     * is.  If there is not enough induced charge, this function will return null.
     * 
     * @param  {BalloonModel} balloon
     * @param  {string} balloonLabel
     * @return {string|null}
     */
    getInducedChargeDescriptionIfBigEnough: function( balloon, balloonLabel ) {
      var inducedChargeDescription = null;

      // start here - this needs to be on a balloon basis, something like balloon.iniducingCharge?
      if ( balloon.inducingCharge && this.model.wall.isVisibleProperty.get() ) {

        // get the variable parts of the description to place in the pattern
        var closestCharge = balloon.closestChargeInWall;
        var location = closestCharge.locationProperty.get();
        var isVisible = this.model.wall.isVisibleProperty.get();
        var chargeLocationString = BalloonsAndStaticElectricityDescriber.getLocationDescription( location, isVisible );
        var inducedChargeAmount = this.getInducedChargeAmountDescription( balloon );

        inducedChargeDescription = StringUtils.fillIn( inducedChargePatternString, {
          wallLocation: chargeLocationString,
          balloon: balloonLabel,
          inductionAmount: inducedChargeAmount
        } ); 
      }

      return inducedChargeDescription;
    }
  } );
} );
