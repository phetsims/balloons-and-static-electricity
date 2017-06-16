// Copyright 2002-2016, University of Colorado Boulder

/**
 * Scene summary for this sim.  The scene summary is composed of a dynamic list of descriptions
 * for parts of the play area and control panel.  By breaking up the summary into a list of items,
 * the user can find specific information about the scene very quickly, and in an orginizied way.
 *
 *  Example 1:
 *  Yellow balloon, touching lower wall.
 *
 *  Example 2:
 *  Yellow balloon, touching upper wall. Green balloon, in lower play area, at center.
 *
 *  Example 3:
 *  Yellow balloon, in upper-right side of play areal.
 *
 *  Example 4:
 *  Yellow balloon, in lower-left side of play area. Green balloon, sticking to upper wall. Negative charges in wall move away from balloon a little bit.
 *
 *  Example 5:
 *  Yellow balloon, in upper play area, at center. Green balloon, sticking to lower-right arm of sweater.
 *
 *  @author Jesse Greenberg
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

  /**
   * @constructor
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {Tandem} tandem
   */
  function SceneSummaryNode( model, tandem ) {
    AccessibleSectionNode.call( this, sceneSummaryString, {
      pickable: false // scene summary (and its subtree) do not need to be pickable
    } );

    // pull out model elements for readability
    var greenBalloon = model.greenBalloon;
    var wall = model.wall;

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

    // roomObjectsNode content is dependent on the visibility of the wall and green balloon
    var self = this;
    Property.multilink( [ greenBalloon.isVisibleProperty, wall.isVisibleProperty ], function( balloonVisible, wallVisible ) {
      roomObjectsNode.accessibleLabel = self.getVisibleObjectsDescription( balloonVisible, wallVisible );
      console.log( roomObjectsNode.accessibleLabel );
    } );

    // tandem support
    tandem.addInstance( this, TNode );
  }

  balloonsAndStaticElectricity.register( 'SceneSummaryNode', SceneSummaryNode );

  return inherit( AccessibleSectionNode, SceneSummaryNode, {

    getVisibleObjectsDescription: function( balloonVisible, wallVisible ) {
      var sweaterString = wallVisible ? aSweaterString : andASweaterString;
      var balloonString = balloonVisible ? twoBalloonsString : aBalloonString;

      var descriptionString;
      if ( wallVisible ) {
        descriptionString = StringUtils.fillIn( objectsWithWallPatternString, {
          balloons: balloonString,
          sweater: sweaterString,
          wall: andARemovableWallString
        } );
      }
      else {
        descriptionString = StringUtils.fillIn( objectsNoWallPatternString, {
          balloons: balloonString,
          sweater: sweaterString 
        } );
      }

      return StringUtils.fillIn( roomObjectsPatternString, {
        description: descriptionString
      } );
    }
  } );
} );