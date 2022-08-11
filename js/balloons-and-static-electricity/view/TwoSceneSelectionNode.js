// Copyright 2016-2022, University of Colorado Boulder

/**
 * Creates a scene selection switch for two scenes.  The visual is styled similar to radio
 * buttons, but clicking anywhere within the bounds of the switch will change the value,
 * which makes the interaction different from a radio group.
 *
 * Therefore, this is a single button styled like two buttons.  It uses custom input listeners
 * because the typical sun button model would have modeled and styled these as two separate
 * buttons.
 *
 * This was created in support of accessibility.  It may be moved into common code at some point.  Alternatively, it
 * may be obsoleted and replaced with a regular, accessible radio button group.  See
 * https://github.com/phetsims/balloons-and-static-electricity/issues/213 for the discussion on this topic.
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */

import Emitter from '../../../../axon/js/Emitter.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { AlignGroup, Color, DownUpListener, FlowBox, InteractiveHighlighting, Node, Path, PressListener, SceneryConstants } from '../../../../scenery/js/imports.js';
import multiSelectionSoundPlayerFactory from '../../../../tambo/js/multiSelectionSoundPlayerFactory.js';
import EventType from '../../../../tandem/js/EventType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const DEFAULT_FILL = new Color( 'white' );

class TwoSceneSelectionNode extends InteractiveHighlighting( Node ) {

  /**
   * @param {Property} property
   * @param {Object} valueA - valid value for the property
   * @param {Object} valueB - alternate valid value for the property
   * @param {Node} nodeA
   * @param {Node} nodeB
   * @param {Object} [options]
   */
  constructor( property, valueA, valueB, nodeA, nodeB, options ) {

    options = merge( {

      // FlowBox options - buttons oriented with a FlowBox
      spacing: 10,
      orientation: 'horizontal',
      align: 'center',

      // mask behind the buttons - if non null, hides everything behind
      maskFill: null,

      // The fill for the buttons - default is white
      baseColor: DEFAULT_FILL,
      pressedColor: DEFAULT_FILL.colorUtilsDarker( 0.4 ),

      // Opacity can be set separately for the buttons and button content.

      opacityWhenDisabled: SceneryConstants.DISABLED_OPACITY, // Don't collide with Node.disabledOpacity option

      buttonAppearanceStrategyOptions: {
        selectedButtonOpacity: 1,
        deselectedButtonOpacity: 0.6,
        selectedStroke: 'black',
        deselectedStroke: new Color( 50, 50, 50 ),
        selectedLineWidth: 1.5,
        deselectedLineWidth: 1,
        overButtonOpacity: 0.8
      },
      contentAppearanceStrategyOptions: {
        overContentOpacity: 0.8,
        selectedContentOpacity: 1,
        deselectedContentOpacity: 0.6
      },

      // These margins are *within* each button, relative to the largest of the two icons
      buttonContentXMargin: 5,
      buttonContentYMargin: 5,

      cornerRadius: 4,

      // TouchArea expansion
      touchAreaXDilation: 0,
      touchAreaYDilation: 0,

      // MouseArea expansion
      mouseAreaXDilation: 0,
      mouseAreaYDilation: 0,

      cursor: 'pointer',

      // tandem support
      tandem: Tandem.REQUIRED,

      // pdom
      tagName: 'input',
      inputType: 'checkbox',
      appendDescription: true
    }, options );

    super( options );

    // place the nodes in an align group so that the two buttons will have identical sizing
    const buttonAlignGroup = new AlignGroup();
    const aBox = buttonAlignGroup.createBox( nodeA );
    const bBox = buttonAlignGroup.createBox( nodeB );

    // use a path so that the line width can be updated
    const xMargin = options.buttonContentXMargin;
    const yMargin = options.buttonContentYMargin;
    const cornerRadius = options.cornerRadius;

    const aButton = new Node();
    const bButton = new Node();

    // aBox.bounds === bBox.bounds since we are using AlignGroup
    const rectShape = Shape.roundRect(
      -xMargin,
      -yMargin,
      aBox.width + 2 * xMargin,
      aBox.height + 2 * yMargin,
      cornerRadius,
      cornerRadius
    );
    const aButtonPath = new Path( rectShape );
    const bButtonPath = new Path( rectShape );

    // if there should be a mask, add before the buttons
    if ( options.maskFill ) {
      aButton.addChild( new Path( rectShape, { fill: options.maskFill } ) );
      bButton.addChild( new Path( rectShape, { fill: options.maskFill } ) );
    }

    aButton.addChild( aButtonPath );
    bButton.addChild( bButtonPath );

    // add the icons
    aButtonPath.addChild( aBox );
    bButtonPath.addChild( bBox );

    const buttonBox = new FlowBox( {
      spacing: options.spacing,
      orientation: options.orientation,
      align: options.align,
      children: [ aButton, bButton ],
      resize: false
    } );
    this.addChild( buttonBox );

    // sets the styles of the buttons after an interaction, including the stroke, opacity, lineWidth, and fill,
    // depending on whether or not the button is enabled
    const setStyles = enabled => {

      let selectedButton;
      let deselectedButton;
      let selectedContent;
      let deselectedContent;

      if ( property.get() === valueA ) {
        selectedButton = aButtonPath;
        deselectedButton = bButtonPath;
        selectedContent = nodeA;
        deselectedContent = nodeB;
      }
      else {
        selectedButton = bButtonPath;
        deselectedButton = aButtonPath;
        selectedContent = nodeB;
        deselectedContent = nodeA;
      }

      selectedButton.stroke = options.buttonAppearanceStrategyOptions.selectedStroke;
      deselectedButton.stroke = options.buttonAppearanceStrategyOptions.deselectedStroke;

      selectedButton.opacity = options.buttonAppearanceStrategyOptions.selectedButtonOpacity;
      deselectedButton.opacity = options.buttonAppearanceStrategyOptions.deselectedButtonOpacity;

      selectedContent.opacity = options.contentAppearanceStrategyOptions.selectedContentOpacity;
      deselectedContent.opacity = options.contentAppearanceStrategyOptions.deselectedContentOpacity;

      selectedButton.lineWidth = options.buttonAppearanceStrategyOptions.selectedLineWidth;
      deselectedButton.lineWidth = options.buttonAppearanceStrategyOptions.deselectedLineWidth;

      if ( !enabled ) {
        this.opacity = options.opacityWhenDisabled;

        selectedButton.fill = options.baseColor;
        deselectedButton.fill = options.baseColor;
      }
      else {
        selectedButton.fill = options.baseColor;
        deselectedButton.fill = options.baseColor;
      }
    };
    property.link( value => {

      // update the button look and its accessible pressed state
      setStyles( this.enabledProperty.get() );
    } );

    // sound players
    const soundPlayerForOneBalloon = multiSelectionSoundPlayerFactory.getSelectionSoundPlayer( 4 );
    const soundPlayerForTwoBalloons = multiSelectionSoundPlayerFactory.getSelectionSoundPlayer( 5 );

    const upFunction = () => {
      const newValue = property.get() === valueA ? valueB : valueA;
      newValue ? soundPlayerForTwoBalloons.play() : soundPlayerForOneBalloon.play();
      property.set( newValue );
      setStyles( this.enabledProperty.get() );
    };

    // Internal emitter for the PhET-iO data stream, see https://github.com/phetsims/sun/issues/396
    const firedEmitter = new Emitter( {
      tandem: options.tandem.createTandem( 'firedEmitter' ),
      phetioDocumentation: 'emits to change the selection',
      phetioEventType: EventType.USER
    } );
    firedEmitter.addListener( upFunction );

    const downUpListener = new DownUpListener( {
      up: () => {
        firedEmitter.emit();
      },
      down: () => {
        const otherButton = property.get() === valueA ? bButtonPath : aButtonPath;
        otherButton.fill = options.pressedColor;
      }
    } );

    // considered "checked" for accessibility when node B is selected
    const propertyListener = value => {
      this.setPDOMChecked( value === valueB );
    };

    // listener that highlights the unselected button when mouse is over
    const highlightListener = new PressListener( {
      tandem: options.tandem.createTandem( 'highlightListener' )
    } );
    highlightListener.isHighlightedProperty.link( highlighted => {
      const otherButton = property.get() === valueA ? bButtonPath : aButtonPath;
      const otherContent = property.get() === valueA ? nodeB : nodeA;

      const buttonOpacity = highlighted ?
                            options.buttonAppearanceStrategyOptions.overButtonOpacity :
                            options.buttonAppearanceStrategyOptions.deselectedButtonOpacity;
      const contentOpacity = highlighted ?
                             options.contentAppearanceStrategyOptions.overContentOpacity :
                             options.contentAppearanceStrategyOptions.deselectedContentOpacity;

      otherButton.opacity = buttonOpacity;
      otherContent.opacity = contentOpacity;
    } );

    // listener that is called when the button is pressed with 'enter' or 'spacebar'
    const clickListener = { click: upFunction };

    // add listeners
    this.addInputListener( downUpListener );
    this.addInputListener( highlightListener );
    this.enabledProperty.link( setStyles );
    property.link( propertyListener );
    this.addInputListener( clickListener );

    // set mouse and touch areas
    this.mouseArea = this.bounds.dilatedXY( options.mouseAreaXDilation, options.mouseAreaYDilation );
    this.touchArea = this.bounds.dilatedXY( options.touchAreaXDilation, options.touchAreaYDilation );
  }
}

balloonsAndStaticElectricity.register( 'TwoSceneSelectionNode', TwoSceneSelectionNode );

export default TwoSceneSelectionNode;