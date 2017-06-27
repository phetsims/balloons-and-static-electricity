// Copyright 2002-2016, University of Colorado Boulder

/**
 * Scene summary for this sim.  The scene summary is composed of a dynamic list of descriptions
 * for parts of the play area and control panel.  This content will only ever be seen by a screen reader.
 * By breaking up the summary into a list of items, the user can find specific information about the
 * scene very quickly.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var AccessibleSectionNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/AccessibleSectionNode' );
  var BalloonsAndStaticElectricityDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BalloonsAndStaticElectricityDescriber' );
  var TNode = require( 'SCENERY/nodes/TNode' );
  var Property = require( 'AXON/Property' );

  // strings
  var sceneSummaryString = BASEA11yStrings.sceneSummaryString;
  var openingSummaryString = BASEA11yStrings.openingSummaryString;
  var keyboardShortcutsHelpString = BASEA11yStrings.keyboardShortcutsHelpString;
  var grabBalloonToPlayString = BASEA11yStrings.grabBalloonToPlayString;
  var aBalloonString = BASEA11yStrings.aBalloonString;
  var twoBalloonsString = BASEA11yStrings.twoBalloonsString;
  var andARemovableWallString = BASEA11yStrings.andARemovableWallString;
  var aSweaterString = BASEA11yStrings.aSweaterString;
  var andASweaterString = BASEA11yStrings.andASweaterString;
  var objectsWithWallPatternString = BASEA11yStrings.objectsWithWallPatternString;
  var objectsNoWallPatternString = BASEA11yStrings.objectsNoWallPatternString;
  var roomObjectsPatternString = BASEA11yStrings.roomObjectsPatternString;
  var yellowBalloonLabelString = BASEA11yStrings.yellowBalloonLabelString;
  var greenBalloonLabelString = BASEA11yStrings.greenBalloonLabelString;
  var balloonSummaryWithInducedChargePatternString = BASEA11yStrings.balloonSummaryWithInducedChargePatternString;
  var balloonSummaryWithoutInducedChargePatternString = BASEA11yStrings.balloonSummaryWithoutInducedChargePatternString;
  var sceneSummaryStickingToString = BASEA11yStrings.sceneSummaryStickingToString;
  var sceneSummaryOnString = BASEA11yStrings.sceneSummaryOnString;
  var sceneSummaryTouchingString = BASEA11yStrings.sceneSummaryTouchingString;
  var twoBalloonLocationSummaryString = BASEA11yStrings.twoBalloonLocationSummaryString;
  var balloonLocationSummaryWithPositiveChargeDescription = BASEA11yStrings.balloonLocationSummaryWithPositiveChargeDescription;
  var allHaveNoNetChargeString = BASEA11yStrings.allHaveNoNetChargeString;
  var neutralBalloonChargePatternString = BASEA11yStrings.neutralBalloonChargePatternString;
  var neutralSweaterChargeString = BASEA11yStrings.neutralSweaterChargeString;
  var neutralSweaterAndWallChargeString = BASEA11yStrings.neutralSweaterAndWallChargeString;

  /**
   * @constructor
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {Tandem} tandem
   */
  function SceneSummaryNode( model, wallNode, tandem ) {

    var self = this;

    AccessibleSectionNode.call( this, sceneSummaryString, {
      pickable: false // scene summary (and its subtree) do not need to be pickable
    } );

    // pull out model elements for readability
    var yellowBalloon = model.yellowBalloon;
    var greenBalloon = model.greenBalloon;

    // @private
    this.model = model;
    this.wall = model.wall;

    // opening paragraph for the simulation
    var openingSummaryNode = new Node( { tagName: 'p', accessibleLabel: openingSummaryString } );
    this.addChild( openingSummaryNode );

    // list of dynamic description content that will update with the state of the simulation
    var listNode = new Node( { tagName: 'ul' } );
    var roomObjectsNode = new Node( { tagName: 'li' } );
    var locationDescriptionNode = new Node( { tagName: 'li' } );
    var chargeDescriptionNode = new Node( { tagName: 'li' } );

    // structure the accessible content
    this.addChild( listNode );
    listNode.addChild( roomObjectsNode );
    listNode.addChild( locationDescriptionNode );
    listNode.addChild( chargeDescriptionNode );
    this.addChild( new Node( { tagName: 'p', accessibleLabel: grabBalloonToPlayString } ) );
    this.addChild( new Node( { tagName: 'p', accessibleLabel: keyboardShortcutsHelpString } ) );

    // update the description that covers the visible objects in the play area
    Property.multilink( [ greenBalloon.isVisibleProperty, this.wall.isVisibleProperty ], function( balloonVisible, wallVisible ) {
      roomObjectsNode.accessibleLabel = SceneSummaryNode.getVisibleObjectsDescription( balloonVisible, wallVisible );
    } );

    // update the description which covers the location of each balloon and how it induced charge on the wall
    var locationProperties = [ yellowBalloon.locationProperty, greenBalloon.locationProperty, greenBalloon.isVisibleProperty, this.wall.isVisibleProperty ];
    Property.multilink( locationProperties, function( yellowBalloonLocation ) {
        locationDescriptionNode.accessibleLabel = self.getLocationDescription( yellowBalloon, yellowBalloonLabelString, greenBalloon, greenBalloonLabelString, wallNode );
      }
    );

    var chargeProperties = [ yellowBalloon.chargeProperty, greenBalloon.chargeProperty ];
    Property.multilink( chargeProperties, function( yellowBalloonCharge, greenBalloonCharge ) {
      chargeDescriptionNode.accessibleLabel = self.getChargeDescription();
    } );

    // tandem support
    tandem.addInstance( this, TNode );
  }

  balloonsAndStaticElectricity.register( 'SceneSummaryNode', SceneSummaryNode );

  return inherit( AccessibleSectionNode, SceneSummaryNode, {

    /**
     * Get the string that describes the interaction state of the balloon on an object.  Will be one of
     * 'sticking to', 'on', or 'touching'.  We use 'sticking to' if the balloon is charged, touching the
     * sweater or wall, and not dragged. We use 'touching' if the balloon is just touching the sweater or wall.
     * Otherwise, we use 'on', maybe BalloonsAndStaticElectricityDescriber.js?
     * 
     * @private
     * @return {string}
     */
    getAttractiveStateString: function( balloon ) {
      var attractiveStateString = '';

      if ( balloon.onSweater() || balloon.touchingWall() ) {
        if ( !balloon.isDraggedProperty.get() && Math.abs( balloon.chargeProperty.get() ) > 0 ) {
          attractiveStateString = sceneSummaryStickingToString;
        }
        else {
          attractiveStateString = sceneSummaryTouchingString;
        }
      }
      else {
        attractiveStateString = sceneSummaryOnString;
      }

      return attractiveStateString;
    },

    /**
     * Get the location description of a single balloon, as well as a description of any charge that it is inducing
     * in the wall.
     *
     * TODO: Parts of this will likely be useful elswhere in the sim.
     * TODO: Should this be in the BalloonDescriber?
     * @private
     * @param  {BalloonModel} balloon
     * @param  {string} balloonLabel
     * @param  {WallNode} wallNode
     * @return {string}
     */
    getBalloonLocationDescription: function( balloon, balloonLabel, wallNode ) {

      // phrase describing the location of the balloon in the play area, determined relative to center of the balloon
      // unless balloon is touching the wall or sweater, in which case the descriped point is relative to the sides
      // of the balloon
      // TODO: Should this be moved somewhere else to a function like getDescribedPoint() ?
      var describedBalloonPosition;
      if ( balloon.touchingWall() ) {
        describedBalloonPosition = balloon.getWallTouchingCenter(); 
      }
      else if ( balloon.onSweater() ) {
        describedBalloonPosition = balloon.getSweaterTouchingCenter();
      }
      else {
        describedBalloonPosition = balloon.getCenter();
      }
      var wallVisible = this.wall.isVisibleProperty.get();
      var locationString = BalloonsAndStaticElectricityDescriber.getLocationDescription( describedBalloonPosition, wallVisible );

      // attractive state segment, like "sticking to" or "on"
      var attractiveStateString = this.getAttractiveStateString( balloon );

      // description for induced charge in the wall if it is visible
      if ( this.model.wall.isVisibleProperty.get() && balloon.inducingCharge ) {
        var inducedChargeString = wallNode.wallDescriber.getInducedChargeDescription( balloon, balloonLabel );
      }

      // if there is an induced charge, add it to the description - otherwise, just describe the balloon
      // and its location
      var locationDescription;
      if ( inducedChargeString ) {
        locationDescription = StringUtils.fillIn( balloonSummaryWithInducedChargePatternString, {
          balloon: balloonLabel,
          attractiveState: attractiveStateString,
          location: locationString,
          inducedCharge: inducedChargeString
        } );
      }
      else {
        locationDescription = StringUtils.fillIn( balloonSummaryWithoutInducedChargePatternString, {
          balloon: balloonLabel,
          attractiveState: attractiveStateString,
          location: locationString
        } );
      }

      return locationDescription;
    },

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
     * Get a description which describes the charge of all objects in the simulation.
     * NOTE: Implementation on hold, waiting for the two-balloon case.
     * 
     * @return {string} [description]
     */
    getChargeDescription: function() {
      // var model = this.model;

      // the charge description is composed of these parts
      // var overallDescription = this.getOverallChargeDescription();
      // var yellowBalloonDescription = this.getBalloonChargeDescription( model.yellowBalloon, yellowBalloonLabelString );
      // var greenBalloonDescription = this.getBalloonChargeDescription( model.greenBalloon, greenBalloonLabelString );
      // var sweaterAndWallDescription = this.getSweaterAndWallChargeDescription();

    },

    /**
     * Gets the description content for the scene summary, which includes information about both balloon locations and
     * their impact on the wall (induced charge).
     * @private
     * @return {string}
     */
    getLocationDescription: function( yellowBalloon, yellowBalloonLabelString, greenBalloon, greenBalloonLabelString, wallNode ) {
      var description;

      // descriptions for each balloon, if green balloon is invisible it is skipped
      var yellowBalloonDescription = this.getBalloonLocationDescription( yellowBalloon, yellowBalloonLabelString, wallNode );
      if ( greenBalloon.isVisibleProperty.get() ) {
        var greenBalloonDescription = this.getBalloonLocationDescription( greenBalloon, greenBalloonLabelString, wallNode );
        description = StringUtils.fillIn( twoBalloonLocationSummaryString, {
          yellowBalloon: yellowBalloonDescription,
          greenBalloon: greenBalloonDescription
        } );
      }
      else {
        description = yellowBalloonDescription;
      }

      // if there is any induced charge in the wall, attach that to the end of the description
      if ( yellowBalloon.inducingCharge || greenBalloon.inducingCharge ) {
        description = StringUtils.fillIn( balloonLocationSummaryWithPositiveChargeDescription, {
          balloonSummary: description
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
     * @return {string}
     */
    getVisibleObjectsDescription: function( balloonVisible, wallVisible ) {
      var sweaterString = wallVisible ? aSweaterString : andASweaterString;
      var balloonString = balloonVisible ? twoBalloonsString : aBalloonString;

      var descriptionString;
      if ( wallVisible ) {
        descriptionString = StringUtils.fillIn( objectsWithWallPatternString, {
          balloon: balloonString,
          sweater: sweaterString,
          wall: andARemovableWallString
        } );
      }
      else {
        descriptionString = StringUtils.fillIn( objectsNoWallPatternString, {
          balloon: balloonString,
          sweater: sweaterString 
        } );
      }

      return StringUtils.fillIn( roomObjectsPatternString, {
        description: descriptionString
      } );
    }
  } );
} );