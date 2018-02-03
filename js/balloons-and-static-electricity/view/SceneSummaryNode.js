// Copyright 2016-2017, University of Colorado Boulder

/**
 * Scene summary for this sim.  The scene summary is composed of a dynamic list of descriptions
 * for parts of the play area and control panel.  This content will only ever be seen by a screen reader.
 * By breaking up the summary into a list of items, the user can find specific information about the
 * scene very quickly.
 *
 * TODO: Most of these functions should now use BalloonDescriber/SweaterDescriber/WallDescriber, there should be no
 * need for duplication.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var AccessibleSectionNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/AccessibleSectionNode' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BASEDescriber' );
  var inherit = require( 'PHET_CORE/inherit' );
  var JoistA11yStrings = require( 'JOIST/JoistA11yStrings' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var sceneSummaryString = BASEA11yStrings.sceneSummaryString;
  var openingSummaryString = BASEA11yStrings.openingSummaryString;
  var grabBalloonToPlayString = BASEA11yStrings.grabBalloonToPlayString;
  var andARemovableWallString = BASEA11yStrings.andARemovableWallString;
  var aSweaterString = BASEA11yStrings.aSweaterString;
  var andASweaterString = BASEA11yStrings.andASweaterString;
  var roomObjectsPatternString = BASEA11yStrings.roomObjectsPatternString;
  var allHaveNoNetChargeString = BASEA11yStrings.allHaveNoNetChargeString;
  var neutralBalloonChargePatternString = BASEA11yStrings.neutralBalloonChargePatternString;
  var neutralSweaterChargeString = BASEA11yStrings.neutralSweaterChargeString;
  var neutralSweaterAndWallChargeString = BASEA11yStrings.neutralSweaterAndWallChargeString;
  var checkOutShortcutsString = JoistA11yStrings.checkOutShortcutsString;
  var summaryObjectsString = BASEA11yStrings.summaryObjectsString;
  var aYellowBalloonString = BASEA11yStrings.aYellowBalloonString;
  var aGreenBalloonString = BASEA11yStrings.aGreenBalloonString;
  var summaryBalloonChargePatternString = BASEA11yStrings.summaryBalloonChargePatternString;
  var summaryEachBalloonChargePatternString = BASEA11yStrings.summaryEachBalloonChargePatternString;

  /**
   * @constructor
   * @param {BASEModel} model
   * @param wallNode
   * @param {Tandem} tandem
   */
  function SceneSummaryNode( model, yellowBalloonNode, greenBalloonNode, wallNode, tandem ) {

    var self = this;

    AccessibleSectionNode.call( this, sceneSummaryString, {
      tandem: tandem,
      pickable: false // scene summary (and its subtree) do not need to be pickable
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
    var openingSummaryNode = new Node( { tagName: 'p', accessibleLabel: openingSummaryString } );
    this.addChild( openingSummaryNode );

    // list of dynamic description content that will update with the state of the simulation
    var listNode = new Node( { tagName: 'ul' } );
    var roomObjectsNode = new Node( { tagName: 'li' } );
    var chargeDescriptionNode = new Node( { tagName: 'li' } );

    // structure the accessible content
    this.addChild( listNode );
    listNode.addChild( roomObjectsNode );
    listNode.addChild( chargeDescriptionNode );
    this.addChild( new Node( { tagName: 'p', accessibleLabel: grabBalloonToPlayString } ) );
    this.addChild( new Node( { tagName: 'p', accessibleLabel: checkOutShortcutsString } ) );

    // update the description that covers the visible objects in the play area
    Property.multilink( [ this.greenBalloon.isVisibleProperty, this.wall.isVisibleProperty ], function( balloonVisible, wallVisible ) {
      roomObjectsNode.accessibleLabel = SceneSummaryNode.getVisibleObjectsDescription( balloonVisible, wallVisible );
    } );

    var chargeProperties = [ this.yellowBalloon.chargeProperty, this.greenBalloon.chargeProperty, this.greenBalloon.isVisibleProperty, model.showChargesProperty ];
    Property.multilink( chargeProperties, function( yellowBalloonCharge, greenBalloonCharge, greenBalloonVisible, showCharges ) {

      chargeDescriptionNode.accessibleVisible = showCharges !== 'none';

      // when no charges are shown, the chargeDescriptionNode is hidden from assistive technology
      if ( showCharges !== 'none' ) {
        chargeDescriptionNode.accessibleLabel = self.getChargeDescription();
      }
    } );
  }

  balloonsAndStaticElectricity.register( 'SceneSummaryNode', SceneSummaryNode );

  return inherit( AccessibleSectionNode, SceneSummaryNode, {

    /**
     * Get the charge description for the overall state of the simulation.  Something like "All have no net charge".
     * NOTE: Implementation on hold, waiting for implications of the two balloon case.
     *
     * @private
     * @return {string}
     */
    getOverallChargeDescription: function() {
      var overallDescription;

      // if none of the objects have charge, use a simple summary sentence that describes this - all objects will
      // be neutral if the sweater still has all its charges
      if ( this.model.sweater.chargeProperty.get() === 0 ) {
        overallDescription = allHaveNoNetChargeString;
      }
      else {
        overallDescription = 'Please implement the rest of this function.';
      }

      return overallDescription;
    },

    /**
     * Get the charge description for a single balloon.
     * NOTE: Implementation on hold, waiting for the two-balloon case.
     *
     * TODO: Should this move to BalloonDescriber?
     * @param  {BalloonModel} balloonModel
     * @param  {string} balloonLabel
     * @return {string}
     */
    getBalloonChargeDescription: function( balloonModel, balloonLabel ) {
      var chargeDescription;
      if ( balloonModel.chargeProperty.get() === 0 ) {
        chargeDescription = StringUtils.fillIn( neutralBalloonChargePatternString, {
          balloon: balloonLabel
        } );
      }
      else {
        chargeDescription = 'Please handle the other cases. Perhaps a range map would work?';
      }

      return chargeDescription;
    },

    /**
     * NOTE: charge description implementation on hold, waiting for the two balloon case.
     *
     * @return {string}
     */
    getSweaterAndWallChargeDescription: function() {
      var chargeDescription;

      // if sweater and wall have a neutral charge, they are put together in the same summary description
      // neither will have charge if the sweater still has neutral charge
      if ( this.model.sweater.chargeProperty.get() === 0 ) {
        if ( this.model.wall.isVisibleProperty.get() ) {
          chargeDescription = neutralSweaterAndWallChargeString;
        }
        else {
          chargeDescription = neutralSweaterChargeString;
        }
      }
      else {
        chargeDescription = 'Please implement charged cases.';
      }

      return chargeDescription;
    },

    /**
     * Get a description which describes the charge of balloons in the simulation.
     *
     * @return {string}
     */
    getChargeDescription: function() {
      var description;

      var yellowChargeRange = BASEDescriber.getDescribedChargeRange( this.yellowBalloon.chargeProperty.get() );
      var greenChargeRange = BASEDescriber.getDescribedChargeRange( this.greenBalloon.chargeProperty.get() );

      var yellowRelativeCharge = this.yellowBalloonDescriber.getSummaryRelativeChargeDescription();
      var yellowNetCharge = this.yellowBalloonDescriber.getNetChargeDescriptionWithLabel();

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
        var greenRelativeCharge = this.greenBalloonDescriber.getSummaryRelativeChargeDescription();
        var greenNetCharge = this.greenBalloonDescriber.getNetChargeDescriptionWithLabel();

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
     * A description about the induced charge. Note that this is on hold until the two balloon
     * descriptions are designed.
     *
     * @return {string}
     */
    getInducedChargeDescription: function() {
      return 'Induced charge description item - <on hold>';
    }
  }, {

    /**
     * Get a description of the objects that are currently visible in the sim.
     *
     * @private
     * @param  {Property.<boolean>} balloonVisible
     * @param  {Property.<boolean>} wallVisible
     * @return {string}
     */
    getVisibleObjectsDescription: function( balloonVisible, wallVisible ) {
      var placeholdersToRemove = [];
      !wallVisible && placeholdersToRemove.push( 'wall' );
      !balloonVisible && placeholdersToRemove.push( 'greenBalloon' );

      var sweaterString = wallVisible ? aSweaterString : andASweaterString;

      var patternString = BASEA11yStrings.stripPlaceholders( summaryObjectsString, placeholdersToRemove );
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