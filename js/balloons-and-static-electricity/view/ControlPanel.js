// Copyright 2013-2015, University of Colorado Boulder

/**
 * All buttons and control elements for Balloons and Static Electricity.
 *
 * Note: All code related to the charge radio buttons is commented out until descriptions are designed
 * for the state of the radio button group.  Strings are removed from strings json file as well.
 * See https://github.com/phetsims/balloons-and-static-electricity/issues/120.
 *
 * buttons and model control elements
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var TandemNode = require( 'TANDEM/scenery/nodes/TandemNode' );
  var Shape = require( 'KITE/Shape' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var TandemText = require( 'TANDEM/scenery/nodes/TandemText' );
  var TandemImage = require( 'TANDEM/scenery/nodes/TandemImage' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Panel = require( 'SUN/Panel' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TwoSceneSelectionNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/TwoSceneSelectionNode' );
  var AccessibleNode = require( 'SCENERY/accessibility/AccessibleNode' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var AriaHerald = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AriaHerald' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // strings
  var balloonAppletShowAllChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowAllCharges' );
  var balloonAppletShowNoChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowNoCharges' );
  var balloonAppletShowChargeDifferencesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowChargeDifferences' );
  var addWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall' );
  var removeWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall' );
  var resetBalloonString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloon' );
  var resetBalloonsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloons' );



    /**
   * @constructor
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {Bounds2} layoutBounds
   * @param {Tandem} tandem
   */
  function ControlPanel( model, layoutBounds, tandem ) {

    // super constructor
    AccessibleNode.call( this, {
      tagName: 'section', // this is a separate section of elements
      childContainerTagName: 'div', // all children contained in a div under the section
      label: BASEA11yStrings.controlPanelLabelString,
      labelTagName: 'h2'
    } );

    // Add/Remove wall button.
    var addRemoveFont = new PhetFont( 18 );
    var addWallText = new MultiLineText( addWallString, {
      font: addRemoveFont,
      tandem: tandem.createTandem( 'addWallText' )
    } );
    var removeWallText = new MultiLineText( removeWallString, {
      font: addRemoveFont,
      center: addWallText.center,
      tandem: tandem.createTandem( 'removeWallText' )
    } );
    var wallToggleNode = new ToggleNode( removeWallText, addWallText, model.wall.isVisibleProperty, {
      maxWidth: 120,
      tandem: tandem.createTandem( 'wallToggleNode' )
    } );
    var wallButtonListener = function() { model.wall.isVisibleProperty.set( !model.wall.isVisibleProperty.get() ); };

    // @private
    this.wallButton = new RectangularPushButton( {
      content: wallToggleNode,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: wallButtonListener,
      accessibleContent: null, // for now, accessible content implemented below
      tandem: tandem.createTandem( 'wallButton' )
    } );

    // create a herald to announce when the interface changges as a result of interaction
    var ariaHerald = new AriaHerald();

    // accessible node containing the wall button
    // TODO: Once accessibility common components are integrated into scenery, this container will not
    // be necessary, and RectangularPushButton can do this directly
    this.accessibleWallButton = new AccessibleNode( {
      parentContainerTagName: 'div',
      tagName: 'button',
      focusable: true,
      label: BASEA11yStrings.removeWallLabelString,
      description: BASEA11yStrings.wallDescriptionString,
      descriptionTagName: 'p',
      events: {
        click: function( event ) {
          model.wall.isVisibleProperty.set( !model.wall.isVisibleProperty.get() );
        }
      }
    } );
    this.accessibleWallButton.addChild( this.wallButton );

    // when the wall toggles visibility, make an alert that this has happened and update the button text content
    var self = this;
    model.wall.isVisibleProperty.lazyLink( function( wallVisible ) {
      var updatedLabel = wallVisible ? BASEA11yStrings.removeWallLabelString : BASEA11yStrings.addWallLabelString;
      self.accessibleWallButton.setLabel( updatedLabel );

      if ( !model.anyChargedBalloonTouchingWall() ) {
        var alertDescription = wallVisible ? BASEA11yStrings.wallAddedString : BASEA11yStrings.wallRemovedString;
        ariaHerald.announceAssertive( alertDescription );
      }

    } );

    // Radio buttons related to charges
    var radioButtonFont = new PhetFont( 15 );
    var RADIO_BUTTON_TEXT_OPTIONS = {
      font: radioButtonFont,
      maxWidth: 200
    };
    var showChargesRadioButtonGroup = new VerticalAquaRadioButtonGroup( [ {
      node: new TandemText(
        balloonAppletShowAllChargesString,
        _.extend( { tandem: tandem.createTandem( 'allCharges', RADIO_BUTTON_TEXT_OPTIONS ) } )
      ),
      property: model.showChargesProperty,
      value: 'all',
      tandemName: 'showAllChargesRadioButton'
    }, {
      node: new TandemText(
        balloonAppletShowNoChargesString,
        _.extend( { tandem: tandem.createTandem( 'noCharges', RADIO_BUTTON_TEXT_OPTIONS ) } )
      ),
      property: model.showChargesProperty,
      value: 'none',
      tandemName: 'showNoChargesRadioButton'
    }, {
      node: new TandemText(
        balloonAppletShowChargeDifferencesString,
        _.extend( { tandem: tandem.createTandem( 'differentialCharges', RADIO_BUTTON_TEXT_OPTIONS ) } )
      ),
      property: model.showChargesProperty,
      value: 'diff',
      tandemName: 'showChargeDifferencesRadioButton'
    } ], {
      radius: 7,
      touchAreaXDilation: 5,
      radioButtonOptions: {
        accessibleContent: null
      },
      tandem: tandem.createTandem( 'showChargesRadioButtonGroup' )
    } );

    // the charge radio buttons should not be accessible for now, see
    // https://github.com/phetsims/balloons-and-static-electricity/issues/194
    showChargesRadioButtonGroup.accessibleContent = null;
    showChargesRadioButtonGroup.children.forEach( function( child ) {
      child.accessibleContent = null;
    } );

    // Radio buttons for selecting 1 vs 2 balloons
    var scale = 0.14;
    var yellowBalloonImage = new TandemImage( balloonYellow, { tandem: tandem.createTandem( 'yellowBalloonImage' ) } );
    var twoBalloonIconTandem = tandem.createTandem( 'twoBalloonIcon' );
    var twoBalloonIcon = new TandemNode( {
      children: [
        new TandemImage( balloonGreen, { x: 160, tandem: twoBalloonIconTandem.createTandem( 'greenBalloonImage' ) } ),
        yellowBalloonImage
      ],
      scale: scale,
      tandem: twoBalloonIconTandem
    } );

    var oneBalloonIconTandem = tandem.createTandem( 'oneBalloonIcon' );
    var oneBalloonIcon = new TandemNode( {
      children: [
        new TandemImage( balloonYellow, {
          x: twoBalloonIcon.width / scale / 2 - yellowBalloonImage.width / 2,
          tandem: oneBalloonIconTandem.createTandem( 'yellowBalloonImage' )
        } )
      ],
      scale: scale,
      tandem: oneBalloonIconTandem
    } );

    var showBalloonsChoice = new TwoSceneSelectionNode( model.greenBalloon.isVisibleProperty, false, true, oneBalloonIcon, twoBalloonIcon );

    // 'Reset Balloons' button
    var resetBalloonToggleNode = new ToggleNode(
      new TandemText( resetBalloonString, {
        font: new PhetFont( 15 ),
        tandem: tandem.createTandem( 'resetBalloonText' )
      } ),
      new TandemText( resetBalloonsString, {
        font: new PhetFont( 15 ),
        tandem: tandem.createTandem( 'resetBalloonsText' )
      } ),
      model.greenBalloon.isVisibleProperty,
      { maxWidth: 140, tandem: tandem.createTandem( 'resetBalloonToggleNode' ) }
    );
    var resetBalloonButtonListener = function() {
      model.sweater.reset();
      model.balloons.forEach( function( balloon ) {
        balloon.reset( true );
      } );
    };
    var resetBalloonButton = new RectangularPushButton( {
      content: resetBalloonToggleNode,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: resetBalloonButtonListener,
      accessibleContent: null, // temporary - disable content here, implemented below
      tandem: tandem.createTandem( 'resetBalloonButton' )
    } );

    // create the accessible description for the reset balloon button
    var generateDescriptionString = function( balloonVisible ) {
      var balloonDescriptionString = balloonVisible ? BASEA11yStrings.balloonsString : BASEA11yStrings.balloonString;
      var positionDescriptionString = balloonVisible ? BASEA11yStrings.positionsString : BASEA11yStrings.positionString;
      return StringUtils.format( BASEA11yStrings.resetBalloonsDescriptionPatternString, balloonDescriptionString, positionDescriptionString );
    };

    var accessibleResetBalloonButton = new AccessibleNode( {
      focusable: true,
      parentContainerTagName: 'div',
      tagName: 'button',
      label: resetBalloonString,
      descriptionTagName: 'p',
      description: generateDescriptionString( model.greenBalloon.isVisibleProperty ),
      events: {
        click: function( event ) {
          resetBalloonButtonListener();

          var balloonString;
          var bothBalloonString;
          if ( model.greenBalloon.isVisibleProperty.get() ) {
            balloonString = 'balloons';
            bothBalloonString = 'Both balloons';
          }
          else {
            balloonString = 'balloon';
            bothBalloonString = 'Balloon';
          }
          var resetDescription = StringUtils.format( BASEA11yStrings.resetBalloonsDescriptionPatternString, balloonString, bothBalloonString );
          ariaHerald.announceAssertive( resetDescription );
        }
      }
    } );
    accessibleResetBalloonButton.addChild( resetBalloonButton );

    model.greenBalloon.isVisibleProperty.link( function( balloonVisible ) {
      var newLabel = balloonVisible ? BASEA11yStrings.resetBalloonsString : resetBalloonString;
      accessibleResetBalloonButton.setLabel( newLabel );
      accessibleResetBalloonButton.setDescription( generateDescriptionString( balloonVisible ) );
    } );

    var balloonsPanel = new VBox( {
      spacing: 2,
      children: [ showBalloonsChoice, accessibleResetBalloonButton ]
    } );

    //Add the controls at the right, with the reset all button and the wall button
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      scale: 0.96,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    resetAllButton.accessibleContent = null; // temporary for testing, perhaps this will move to common code
    var accessibleResetAllButton = new AccessibleNode( {
      children: [ resetAllButton ],
      focusable: true,

      // a11y options
      focusHighlight: new Shape().circle( 0, 0, 28 ),
      tagName: 'button',
      parentContainerTagName: 'div',
      label: BASEA11yStrings.resetAllString,
      events: {
        click: function( event ) {

          // hide the aria live elements so that alerts are not anounced until after simulation
          // is fully reset
          // TODO: This should be in the main model reset function
          ariaHerald.hidden = true;

          // reset the model
          model.reset();

          // unhide the alert elements now that properties are reset
          ariaHerald.hidden = false;

          // announce that the sim has been reset
          ariaHerald.announceAssertive( BASEA11yStrings.resetAlertString );
        }
      }
    } );

    var controls = new HBox( {
      spacing: 16,
      align: 'bottom',
      children: [ accessibleResetAllButton, this.accessibleWallButton ]
    } );

    controls.right = layoutBounds.maxX - 2;
    controls.bottom = layoutBounds.maxY - 4;

    var visibilityControls;
    var controlsLeft;
    if ( BalloonsAndStaticElectricityQueryParameters.hideChargeControls ) {
      visibilityControls = [ balloonsPanel ];
      controlsLeft = layoutBounds.width / 2 - balloonsPanel.width / 2;
    }
    else {
      visibilityControls = [
        new Panel( showChargesRadioButtonGroup, { tandem: tandem.createTandem( 'visibilityPanel' ) } ),
        balloonsPanel
      ];
      controlsLeft = 70;
    }

    this.addChild( new HBox( {
      spacing: 35,
      children: visibilityControls,
      align: 'bottom',
      left: controlsLeft,
      bottom: layoutBounds.maxY - 4
    } ) );
    this.addChild( controls );

    this.accessibleOrder = [ this.accessibleWallButton, accessibleResetBalloonButton, resetAllButton ];

  }

  balloonsAndStaticElectricity.register( 'ControlPanel', ControlPanel );

  inherit( AccessibleNode, ControlPanel );

  return ControlPanel;
} );
