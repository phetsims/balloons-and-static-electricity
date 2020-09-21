// Copyright 2016-2020, University of Colorado Boulder

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
import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import sceneryPhet from '../../../../scenery-phet/js/sceneryPhet.js';
import ButtonListener from '../../../../scenery/js/input/ButtonListener.js';
import DownUpListener from '../../../../scenery/js/input/DownUpListener.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import LayoutBox from '../../../../scenery/js/nodes/LayoutBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import ColorConstants from '../../../../sun/js/ColorConstants.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import EventType from '../../../../tandem/js/EventType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const DEFAULT_FILL = new Color( 'white' );

/**
 * @constructor
 * @param {Property} property
 * @param {Object} valueA - valid value for the property
 * @param {Object} valueB - alternate valid value for the property
 * @param {Node} nodeA
 * @param {Node} nodeB
 * @param {Object} [options]
 */
function TwoSceneSelectionNode( property, valueA, valueB, nodeA, nodeB, options ) {

  options = merge( {

    // LayoutBox options - buttons oriented with a layout box
    spacing: 10,
    orientation: 'horizontal',
    align: 'center',

    // mask behind the buttons - if non null, hides everything behind
    maskFill: null,

    // whether or not these buttons are enabled
    enabledProperty: new Property( true ),

    // The fill for the buttons - default is white
    baseColor: DEFAULT_FILL,
    pressedColor: DEFAULT_FILL.colorUtilsDarker( 0.4 ),
    disabledBaseColor: ColorConstants.LIGHT_GRAY,

    // Opacity can be set separately for the buttons and button content.
    selectedButtonOpacity: 1,
    deselectedButtonOpacity: 0.6,
    selectedContentOpacity: 1,
    deselectedContentOpacity: 0.6,
    overButtonOpacity: 0.8,
    overContentOpacity: 0.8,
    disabledOpacity: SunConstants.DISABLED_OPACITY,

    selectedStroke: 'black',
    deselectedStroke: new Color( 50, 50, 50 ),
    selectedLineWidth: 1.5,
    deselectedLineWidth: 1,

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

  Node.call( this, options );

  // @private
  this.enabledProperty = options.enabledProperty;

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

  const buttonBox = new LayoutBox( {
    spacing: options.spacing,
    orientation: options.orientation,
    align: options.align,
    children: [ aButton, bButton ],
    resize: false
  } );
  this.addChild( buttonBox );

  // sets the styles of the buttons after an interaction, including the stroke, opacity, lineWidth, and fill,
  // depending on whether or not the button is enabled
  const self = this;
  const setStyles = function( enabled ) {

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

    selectedButton.stroke = options.selectedStroke;
    deselectedButton.stroke = options.deselectedStroke;

    selectedButton.opacity = options.selectedButtonOpacity;
    deselectedButton.opacity = options.deselectedButtonOpacity;

    selectedContent.opacity = options.selectedContentOpacity;
    deselectedContent.opacity = options.deselectedContentOpacity;

    selectedButton.lineWidth = options.selectedLineWidth;
    deselectedButton.lineWidth = options.deselectedLineWidth;

    if ( !enabled ) {
      self.opacity = options.disabledOpacity;

      selectedButton.fill = options.baseColor;
      deselectedButton.fill = options.baseColor;
    }
    else {
      selectedButton.fill = options.baseColor;
      deselectedButton.fill = options.baseColor;
    }
  };
  property.link( function( value ) {

    // update the button look and its accessible pressed state
    setStyles( self.enabledProperty.get() );
  } );

  const upFunction = function() {
    const newValue = property.get() === valueA ? valueB : valueA;
    property.set( newValue );
    setStyles( self.enabledProperty.get() );
  };

  // Internal emitter for the PhET-iO data stream, see https://github.com/phetsims/sun/issues/396
  const firedEmitter = new Emitter( {
    tandem: options.tandem.createTandem( 'firedEmitter' ),
    phetioEventType: EventType.USER
  } );
  firedEmitter.addListener( upFunction );

  const downUpListener = new DownUpListener( {
    up: function() {
      firedEmitter.emit();
    },
    down: function() {
      const otherButton = property.get() === valueA ? bButtonPath : aButtonPath;
      otherButton.fill = options.pressedColor;
    }
  } );

  // considered "checked" for accessibility when node B is selected
  const propertyListener = function( value ) {
    self.setAccessibleChecked( value === valueB );
  };

  // listener that highlights the unselected button when mouse is over local bounds
  const highlightListener = new HighlightListener( function( target, highlight ) {
    const otherButton = property.get() === valueA ? bButtonPath : aButtonPath;
    const otherContent = property.get() === valueA ? nodeB : nodeA;

    const buttonOpacity = highlight ? options.overButtonOpacity : options.deselectedButtonOpacity;
    const contentOpacity = highlight ? options.overContentOpacity : options.deselectedContentOpacity;

    otherButton.opacity = buttonOpacity;
    otherContent.opacity = contentOpacity;
  } );

  // listener that is called when the button is pressed with 'enter' or 'spacebar'
  const clickListener = { click: upFunction };

  // add listeners, to be disposed
  this.addInputListener( downUpListener );
  this.addInputListener( highlightListener );
  this.enabledProperty.link( setStyles );
  property.link( propertyListener );
  this.addInputListener( clickListener );

  // set mouse and touch areas
  this.mouseArea = this.bounds.dilatedXY( options.mouseAreaXDilation, options.mouseAreaYDilation );
  this.touchArea = this.bounds.dilatedXY( options.touchAreaXDilation, options.touchAreaYDilation );

  // @private - for garbage collection
  this.disposeTwoSceneSelectionNode = function() {
    this.removeInputListener( downUpListener );
    this.removeInputListener( highlightListener );
    this.enabledProperty.unlink( setStyles );
    property.unlink( propertyListener );
    this.removeInputListener( clickListener );
  };
}

balloonsAndStaticElectricity.register( 'TwoSceneSelectionNode', TwoSceneSelectionNode );

inherit( Node, TwoSceneSelectionNode, {

  /**
   * Make eligible for garbage collection.
   * @public
   */
  dispose: function() {
    this.disposeTwoSceneSelectionNode();
  },

  /**
   * Set enabled/disabled for interaction
   * @param {boolean} value
   */
  setEnabled: function( value ) {
    assert && assert( typeof value === 'boolean', 'TwoSceneSelectionNode.enabled must be a boolean value' );
    this.enabledProperty.set( value );
  },
  set enabled( value ) { this.setEnabled( value ); },

  /**
   * Get enabled/disabled value.
   * @returns {boolean}
   */
  getEnabled: function() {
    return this.enabledProperty.get();
  },
  get enabled() { return this.getEnabled(); }

} );

//TODO This was moved here from scenery-phet. Replace with PressListener.
// See https://github.com/phetsims/scenery/issues/1078 and https://github.com/phetsims/balloons-and-static-electricity/issues/470
/**
 * @param {function(Node,boolean)} callback called when the highlight changes, has 2 parameters:
 *   the {Node} to be highlighted, and a {boolean} indicating whether to highlight
 * @constructor
 */
function HighlightListener( callback ) {
  ButtonListener.call( this, {
    over: function( event ) {
      callback( event.currentTarget, true );
    },
    up: function( event ) {
      callback( event.currentTarget, false );
    }
  } );
}

sceneryPhet.register( 'HighlightListener', HighlightListener );
inherit( ButtonListener, HighlightListener );

export default TwoSceneSelectionNode;