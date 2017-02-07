// Copyright 2016, University of Colorado Boulder

/**
 * Creates a scene selection switch for two scenes.  The visual is styled similar to radio
 * buttons, but clicking anywhere within the bounds of the the switch will change the value,
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
 * @author John BLanco
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var Emitter = require( 'AXON/Emitter' );
  var Property = require( 'AXON/Property' );
  var HighlightListener = require( 'SCENERY_PHET/input/HighlightListener' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Color = require( 'SCENERY/util/Color' );
  var ColorConstants = require( 'SUN/ColorConstants' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Tandem = require( 'TANDEM/Tandem' );

  // phet-io modules
  var TTwoSceneSelectionNode = require( 'ifphetio!PHET_IO/simulations/balloons-and-static-electricity/TTwoSceneSelectionNode' );

  // constants
  var DEFAULT_FILL = new Color( 'white' );

  /**
   *
   * @constructor
   */
  function TwoSceneSelectionNode( property, valueA, valueB, nodeA, nodeB, options ) {

    options = _.extend( {

      // LayoutBox options
      spacing: 10,
      orientation: 'horizontal',
      align: 'center',

      // whether or not these buttons are enabled
      enabledProperty: new Property( true ),

      // The fill for the rectangle behind the radio buttons.  Default color is bluish color, as in the other button library.
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
      disabledOpacity: 0.3,

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

      // tandem
      tandem: Tandem.tandemRequired()
    }, options );

    Node.call( this, { tandem: options.tandem.createSupertypeTandem() } );

    // Emitters for the PhET-iO data stream
    this.startedCallbacksForToggledEmitter = new Emitter();
    this.endedCallbacksForToggledEmitter = new Emitter();

    // @private
    this.enabledProperty = options.enabledProperty;

    // place the nodes in an align group so that the two buttons will have identical sizing
    var buttonAlignGroup = new AlignGroup();
    var aBox = buttonAlignGroup.createBox( nodeA );
    var bBox = buttonAlignGroup.createBox( nodeB );

    // use a path so that the line width can be updated
    var xMargin = options.buttonContentXMargin;
    var yMargin = options.buttonContentYMargin;
    var cornerRadius = options.cornerRadius;

    // aBox.bounds === bBox.bounds since we are using AlignGroup
    var rectShape = Shape.roundRect(
      -xMargin,
      -yMargin,
      aBox.width + 2 * xMargin,
      aBox.height + 2 * yMargin,
      cornerRadius,
      cornerRadius
    );
    var aButton = new Path( rectShape );
    var bButton = new Path( rectShape );
    aButton.addChild( aBox );
    bButton.addChild( bBox );

    this.addChild( new LayoutBox( {
      spacing: options.spacing,
      orientation: options.orientation,
      align: options.align,
      children: [ aButton, bButton ],
      cursor: 'pointer',
      resize: false
    } ) );

    // sets the styles of the buttons after an interaction, including the stroke, opacity, lineWidth, and fill,
    // depending on whether or not the button is enabled
    var self = this;
    var setStyles = function( enabled ) {

      var selectedButton;
      var deselectedButton;
      var selectedContent;
      var deselectedContent;

      if ( property.get() === valueA ) {
        selectedButton = aButton;
        deselectedButton = bButton;
        selectedContent = nodeA;
        deselectedContent = nodeB;
      }
      else {
        selectedButton = bButton;
        deselectedButton = aButton;
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
    property.link( function() { setStyles( self.enabledProperty.get() ); } );

    // listener that makes this node behave like a button
    var downUpListener = new DownUpListener( {
      up: function( event ) {
        var newValue = property.get() === valueA ? valueB : valueA;
        self.startedCallbacksForToggledEmitter.emit2( property.get(), newValue );
        property.set( newValue );
        setStyles( self.enabledProperty.get() );
        self.endedCallbacksForToggledEmitter.emit();
      },
      down: function( event ) {
        var otherButton = property.get() === valueA ? bButton : aButton;
        otherButton.fill = options.pressedColor;
      }
    } );

    // listener that highlights the unselected button when mouse is over local bounds
    var highlightListener = new HighlightListener( function( target, highlight ) {
      var otherButton = property.get() === valueA ? bButton : aButton;
      var otherContent = property.get() === valueA ? nodeB : nodeA;

      var buttonOpacity = highlight ? options.overButtonOpacity : options.deselectedButtonOpacity;
      var contentOpacity = highlight ? options.overContentOpacity : options.deselectedContentOpacity;

      otherButton.opacity = buttonOpacity;
      otherContent.opacity = contentOpacity;
    } );

    // add listeners, to be disposed
    this.addInputListener( downUpListener );
    this.addInputListener( highlightListener );
    this.enabledProperty.link( setStyles );

    // set mouse and touch areas
    this.mouseArea = this.bounds.dilatedXY( options.mouseAreaXDilation, options.mouseAreaYDilation );
    this.touchArea = this.bounds.dilatedXY( options.touchAreaXDilation, options.touchAreaYDilation );

    // @private - for garbage collection
    this.disposeTwoSceneSelectionNode = function() {
      this.removeInputListener( downUpListener );
      this.removeInputListener( highlightListener );
      this.enabledProperty.unlink( setStyles );
    };

    // tandem support
    options.tandem.addInstance( this, TTwoSceneSelectionNode );
  }

  balloonsAndStaticElectricity.register( 'TwoSceneSelectionNode', TwoSceneSelectionNode );

  return inherit( Node, TwoSceneSelectionNode, {

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
     * @return {boolean}
     */
    getEnabled: function() {
      return this.enabledProperty.get();
    },
    get enabled() { return this.getEnabled(); }

  } );
} );
