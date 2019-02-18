// Copyright 2016-2019, University of Colorado Boulder

/**
 * screen summary for this sim.  The screen summary is composed of a dynamic list of descriptions
 * for parts of the play area and control panel.  This content will only ever be seen by a screen reader.
 * By breaking up the summary into a list of items, the user can find specific information about the
 * scene very quickly.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BASEDescriber' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var SweaterDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/SweaterDescriber' );
  var WallDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/WallDescriber' );

  // a11y strings
  var grabBalloonToPlayString = BASEA11yStrings.grabBalloonToPlay.value;
  var andARemovableWallString = BASEA11yStrings.andARemovableWall.value;
  var aSweaterString = BASEA11yStrings.aSweater.value;
  var andASweaterString = BASEA11yStrings.andASweater.value;
  var roomObjectsPatternString = BASEA11yStrings.roomObjectsPattern.value;
  var aYellowBalloonString = BASEA11yStrings.aYellowBalloon.value;
  var aGreenBalloonString = BASEA11yStrings.aGreenBalloon.value;
  var summaryBalloonChargePatternString = BASEA11yStrings.summaryBalloonChargePattern.value;
  var summaryEachBalloonChargePatternString = BASEA11yStrings.summaryEachBalloonChargePattern.value;
  var zeroString = BASEA11yStrings.zero.value;
  var summaryObjectsHaveChargePatternString = BASEA11yStrings.summaryObjectsHaveChargePattern.value;
  var summarySweaterAndWallString = BASEA11yStrings.summarySweaterAndWall.value;
  var summarySweaterWallPatternString = BASEA11yStrings.summarySweaterWallPattern.value;
  var summarySecondBalloonInducingChargePatternString = BASEA11yStrings.summarySecondBalloonInducingChargePattern.value;
  var summaryBothBalloonsPatternString = BASEA11yStrings.summaryBothBalloonsPattern.value;
  var summaryObjectEachHasPatternString = BASEA11yStrings.summaryObjectEachHasPattern.value;
  var summaryObjectEachPatternString = BASEA11yStrings.summaryObjectEachPattern.value;
  var singleStatementPatternString = BASEA11yStrings.singleStatementPattern.value;
  var summaryYellowGreenSweaterWallPatternString = BASEA11yStrings.summaryYellowGreenSweaterWallPattern.value;
  var summaryYellowGreenSweaterPatternString = BASEA11yStrings.summaryYellowGreenSweaterPattern.value;
  var summaryYellowSweaterWallPatternString = BASEA11yStrings.summaryYellowSweaterWallPattern.value;
  var summaryYellowSweaterPatternString = BASEA11yStrings.summaryYellowSweaterPattern.value;
  var initialObjectLocationsString = BASEA11yStrings.initialObjectLocations.value;
  var simOpeningString = BASEA11yStrings.simOpening.value;

  /**
   * @constructor
   * @param {BASEModel} model
   * @param yellowBalloonNode
   * @param greenBalloonNode
   * @param wallNode
   * @param {Tandem} tandem
   */
  function BASESummaryNode( model, yellowBalloonNode, greenBalloonNode, wallNode, tandem ) {

    var self = this;

    Node.call( this, {
      tandem: tandem
    } );

    // pull out model elements for readability
    this.yellowBalloon = model.yellowBalloon;
    this.greenBalloon = model.greenBalloon;

    this.yellowBalloonDescriber = yellowBalloonNode.describer;
    this.greenBalloonDescriber = greenBalloonNode.describer;

    // @private
    this.model = model;
    this.wall = model.wall;

    // opening paragraph for the simulation
    var openingSummaryNode = new Node( { tagName: 'p', innerContent: simOpeningString } );
    this.addChild( openingSummaryNode );

    // list of dynamic description content that will update with the state of the simulation
    var listNode = new Node( { tagName: 'ul' } );
    var roomObjectsNode = new Node( { tagName: 'li' } );
    var objectLocationsNode = new Node( { tagName: 'li', innerContent: initialObjectLocationsString } ); 
    var balloonChargeNode = new Node( { tagName: 'li' } );
    var sweaterWallChargeNode = new Node( { tagName: 'li' } );
    var inducedChargeNode = new Node( { tagName: 'li' } );

    // structure the accessible content
    this.addChild( listNode );
    listNode.addChild( roomObjectsNode );
    listNode.addChild( objectLocationsNode );
    listNode.addChild( balloonChargeNode );
    listNode.addChild( sweaterWallChargeNode );
    listNode.addChild( inducedChargeNode );
    this.addChild( new Node( { tagName: 'p', innerContent: grabBalloonToPlayString } ) );

    // update the description that covers the visible objects in the play area
    Property.multilink( [ this.greenBalloon.isVisibleProperty, this.wall.isVisibleProperty ], function( balloonVisible, wallVisible ) {
      roomObjectsNode.innerContent = BASESummaryNode.getVisibleObjectsDescription( balloonVisible, wallVisible );
    } );

    var chargeProperties = [ this.yellowBalloon.chargeProperty, this.greenBalloon.chargeProperty, this.greenBalloon.isVisibleProperty, model.showChargesProperty, model.wall.isVisibleProperty ];
    Property.multilink( chargeProperties, function( yellowBalloonCharge, greenBalloonCharge, greenBalloonVisible, showCharges, wallVisible ) {
      var chargesVisible = showCharges !== 'none';
      balloonChargeNode.accessibleVisible = chargesVisible;
      sweaterWallChargeNode.accessibleVisible = chargesVisible;

      // update labels if charges are shown
      if ( chargesVisible ) {
        balloonChargeNode.innerContent = self.getBalloonChargeDescription();
        sweaterWallChargeNode.innerContent = self.getSweaterAndWallChargeDescription();
      }
    } );

    var inducedChargeProperties = [ this.yellowBalloon.locationProperty, this.greenBalloon.locationProperty, this.greenBalloon.isVisibleProperty, model.showChargesProperty, model.wall.isVisibleProperty ];
    Property.multilink( inducedChargeProperties, function( yellowLocation, greenLocation, greenVisible, showCharges, wallVisible ) {

      // the induced charge item is only available if one balloon is visible, inducing charge, and showCharges setting is set to 'all'
      var inducingCharge = self.yellowBalloon.inducingChargeAndVisible() || self.greenBalloon.inducingChargeAndVisible();
      var showInducingItem = inducingCharge && wallVisible && showCharges === 'all';
      inducedChargeNode.accessibleVisible = showInducingItem;

      if ( showInducingItem ) {
        inducedChargeNode.innerContent = self.getInducedChargeDescription();
      }
    } );

    // If all of the simulation objects are at their initial state, include the location summary phrase that lets the
    // user know where objects are, see https://github.com/phetsims/balloons-and-static-electricity/issues/393
    Property.multilink(
      [ self.yellowBalloon.locationProperty,
        self.greenBalloon.locationProperty,
        self.greenBalloon.isVisibleProperty,
        model.wall.isVisibleProperty
      ], function( yellowLocation, greenLocation, greenVisible, wallVisible ) {
        var initialValues = self.yellowBalloon.locationProperty.initialValue === yellowLocation &&
                            self.greenBalloon.locationProperty.initialValue === greenLocation &&
                            self.greenBalloon.isVisibleProperty.initialValue === greenVisible &&
                            model.wall.isVisibleProperty.initialValue === wallVisible;

        objectLocationsNode.accessibleVisible = initialValues;
      }
    );
  }

  balloonsAndStaticElectricity.register( 'BASESummaryNode', BASESummaryNode );

  return inherit( Node, BASESummaryNode, {

    /**
     * Get a description of the sweater and wall charge. Does not include induced charge. If the sweater has neutral
     * charge then the two objects can be described in a single statement for readability. Will return something like
     * "Sweater and wall have zero net charge, many pairs of negative and positive charges" or
     * "Sweater and wall have zero net charge, showing no charges" or
     * "Sweater has positive net charge, a few more positive charges than negative charges. Wall has zero net charge,
     *   many pairs of negative and positive charges." or
     * "Sweater has positive net charge, showing several positive charges. Wall has zero  net charge, showing several
     *   positive charges."
     *
     * @returns {string}
     */
    getSweaterAndWallChargeDescription: function() {
      var description;

      var chargesShown = this.model.showChargesProperty.get();
      var wallVisible = this.model.wall.isVisibleProperty.get();
      var numberOfWallCharges = this.model.wall.numX * this.model.wall.numY;
      var wallChargeString = BASEDescriber.getNeutralChargesShownDescription( chargesShown, numberOfWallCharges );

      // if sweater has neutral charge, describe the sweater and wall together
      if ( this.model.sweater.chargeProperty.get() === 0 && wallVisible ) {
        var chargedObjectsString = StringUtils.fillIn( summaryObjectsHaveChargePatternString, {
          objects: summarySweaterAndWallString,
          charge: zeroString
        } );

        var patternString = chargesShown === 'all' ? summaryObjectEachHasPatternString : summaryObjectEachPatternString;

        // both have same described charge, can be described with wallChargeString
        description = StringUtils.fillIn( patternString, {
          object: chargedObjectsString,
          charge: wallChargeString
        } );
      }
      else {
        var sweaterSummaryString = SweaterDescriber.getSummaryChargeDescription( chargesShown, this.model.sweater.chargeProperty.get() );

        // if the wall is visible, it also gets its own description
        if ( wallVisible ) {
          var wallSummaryString = WallDescriber.getSummaryChargeDescription( chargesShown, numberOfWallCharges );
          description = StringUtils.fillIn( summarySweaterWallPatternString, {
            sweater: sweaterSummaryString,
            wall: wallSummaryString
          } );
        }
        else {
          description = sweaterSummaryString;
        }
      }

      return description;
    },

    /**
     * Get a description which describes the charge of balloons in the simulation. Dependent on charge values, charge
     * visibility, and balloon visibility. Will return something like
     * 
     * "Yellow balloon has negative net charge, a few more negative charges than positive charges." or
     * “Yellow balloon has negative net charge, several more negative charges than positive charges. Green balloon has negative net charge, a few more negative charges than positive charges. Yellow balloon has negative net charge, showing several negative charges. Green balloon has negative net charge, showing a few negative charges.”
     *
     * @returns {string}
     */
    getBalloonChargeDescription: function() {
      var description;

      var yellowChargeRange = BASEDescriber.getDescribedChargeRange( this.yellowBalloon.chargeProperty.get() );
      var greenChargeRange = BASEDescriber.getDescribedChargeRange( this.greenBalloon.chargeProperty.get() );

      var yellowRelativeCharge = this.yellowBalloonDescriber.chargeDescriber.getSummaryRelativeChargeDescription();
      var yellowNetCharge = this.yellowBalloonDescriber.chargeDescriber.getNetChargeDescriptionWithLabel();

      if ( !this.greenBalloon.isVisibleProperty.get() ) {
        description = StringUtils.fillIn( summaryBalloonChargePatternString, {
          balloonCharge: yellowNetCharge,
          showingCharge: yellowRelativeCharge
        } );
      }
      else if ( this.greenBalloon.isVisibleProperty.get() && yellowChargeRange.equals( greenChargeRange ) ) {

        // both balloons visible have the same charge, describe charge together
        var eachNetCharge = BASEDescriber.getNetChargeDescriptionWithLabel( this.yellowBalloon.chargeProperty.get() );

        description = StringUtils.fillIn( summaryBalloonChargePatternString, {
          balloonCharge: eachNetCharge,
          showingCharge: yellowRelativeCharge
        } );
      }
      else {

        // both balloons visible with different amounts of relative charge
        var greenRelativeCharge = this.greenBalloonDescriber.chargeDescriber.getSummaryRelativeChargeDescription();
        var greenNetCharge = this.greenBalloonDescriber.chargeDescriber.getNetChargeDescriptionWithLabel();

        var yellowBalloonDescription = StringUtils.fillIn( summaryBalloonChargePatternString, {
          balloonCharge: yellowNetCharge,
          showingCharge: yellowRelativeCharge
        } );
        var greenBalloonDescription = StringUtils.fillIn( summaryBalloonChargePatternString, {
          balloonCharge: greenNetCharge,
          showingCharge: greenRelativeCharge
        } );

        description = StringUtils.fillIn( summaryEachBalloonChargePatternString, {
          yellowBalloon: yellowBalloonDescription,
          greenBalloon: greenBalloonDescription
        } );
      }

      return description;
    },

    /**
     * Get the description for induced charge of a balloon/balloons on the wall. Will return something like
     * 
     * "Negative charges in wall move away from Yellow Balloon a lot. Positive charges do not move." or
     * "Negative charges in wall move away from balloons quite a lot. Positive charges do not move." or
     * "Negative charges in wall move away from Green Balloon a little bit. Positive charges do not move."
     *
     * @returns {string}
     */
    getInducedChargeDescription: function() {
      var description;

      var yellowBalloon = this.yellowBalloon;
      var yellowBalloonDescriber = this.yellowBalloonDescriber;
      var yellowBalloonLabel = yellowBalloonDescriber.accessibleName;

      var greenBalloon = this.greenBalloon;
      var greenBalloonDescriber = this.greenBalloonDescriber;
      var greenBalloonLabel = greenBalloonDescriber.accessibleName;

      var greenInducingChargeAndVisilbe = greenBalloon.inducingChargeAndVisible();
      var yellowInducingChargeAndVisible = yellowBalloon.inducingChargeAndVisible();
      assert && assert( greenInducingChargeAndVisilbe || yellowInducingChargeAndVisible );

      var wallVisible = this.model.wall.isVisibleProperty.get();

      if ( greenInducingChargeAndVisilbe && yellowInducingChargeAndVisible ) {

        if ( this.model.balloonsAdjacentProperty.get() ) {
          description = WallDescriber.getCombinedInducedChargeDescription( yellowBalloon, wallVisible, {
            includeWallLocation: false
          } );

          // add punctuation, a period at  the end of the phrase
          description = StringUtils.fillIn( singleStatementPatternString, {
            statement: description
          } );
        }
        else {

          // full description for yellow balloon
          var yellowBalloonDescription = WallDescriber.getInducedChargeDescription( yellowBalloon, yellowBalloonLabel, wallVisible, {
            includeWallLocation: false,
            includePositiveChargeInfo: false
          } );

          // short summary for green balloon
          var inducedChargeAmount = WallDescriber.getInducedChargeAmountDescription( greenBalloon );
          var greenBalloonDescription = StringUtils.fillIn( summarySecondBalloonInducingChargePatternString, {
            amount: inducedChargeAmount
          } );

          description = StringUtils.fillIn( summaryBothBalloonsPatternString, {
            yellowBalloon: yellowBalloonDescription,
            greenBalloon: greenBalloonDescription
          } );
        }
      }
      else {
        if ( greenInducingChargeAndVisilbe ) {
          description = WallDescriber.getInducedChargeDescription( greenBalloon, greenBalloonLabel, wallVisible, {
            includeWallLocation: false
          } );
        }
        else if ( yellowInducingChargeAndVisible ) {
          description = WallDescriber.getInducedChargeDescription( yellowBalloon, yellowBalloonLabel, wallVisible, {
            includeWallLocation: false
          } );
        }

        // add necessary punctuation
        description = StringUtils.fillIn( singleStatementPatternString, {
          statement: description
        } );
      }

      return description;
    }
  }, {

    /**
     * Get a description of the objects that are currently visible in the sim.
     *
     * @private
     * @param  {Property.<boolean>} balloonVisible
     * @param  {Property.<boolean>} wallVisible
     * @returns {string}
     */
    getVisibleObjectsDescription: function( balloonVisible, wallVisible ) {
      var patternString;
      if ( wallVisible ) {
        patternString = balloonVisible ? summaryYellowGreenSweaterWallPatternString : summaryYellowSweaterWallPatternString;
      }
      else {
        patternString = balloonVisible ? summaryYellowGreenSweaterPatternString : summaryYellowSweaterPatternString;
      }

      var sweaterString = wallVisible ? aSweaterString : andASweaterString;
      var descriptionString = StringUtils.fillIn( patternString, {
        yellowBalloon: aYellowBalloonString,
        greenBalloon: aGreenBalloonString,
        sweater: sweaterString,
        wall: andARemovableWallString
      } );

      return StringUtils.fillIn( roomObjectsPatternString, {
        description: descriptionString
      } );
    }
  } );
} );