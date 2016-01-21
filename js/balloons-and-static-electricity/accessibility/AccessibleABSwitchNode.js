// Copyright 2015, University of Colorado Boulder

/**
 * An accessible ABSwitch node for a Balloon in Balloons and Static Electricity.  This structure is experimental.
 * The switch is represented as a containing div in the parallel DOM. It contains two scenery nodes as children,
 * one for the <input> element and another for the <p> element.
 *
 * The HTML should look like:
 * <div id="toggle-container14-35-417-492-484-473-468">
 *   <input type="button" id="abswitch-14-35-417-492-484-473-468-472" aria-label="Single Balloon Experiment" value="‪Single Balloon Experiment‬" aria-pressed="true">
 * </div>
 * 
 * NOTE: This type of structure is experimental. If this structure is successful and can be applied to additional 
 * simulation elements, Scenery should eventually be able to handle this kind of thing.
 * 
 * @author: Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var ABSwitch = require( 'SUN/ABSwitch' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * Constructor.
   * 
   * @param {number} x
   * @param {number} y
   * @param {BalloonModel} model
   * @param {Image} imgsrc
   * @param {BalloonsAndStaticElectricityModel} globalModel
   * @param {object} options
   * @constructor
   **/
  function AccessibleABSwitchNode( property, valueA, labelA, valueB, labelB, options ) {

  /**
   * See ABSwitch for full list of options
   * 
   * accessibleDescription: translatable description, read by the screen reader upon focus of this element
   * accessibleLabelA: translatable label for valueA read when the ABSwitch receives focus or changes value
   * accessibleLabelB: translatable label for valueB, read when the toggle changes value
   */
    options = _.extend( {
      accessibleDescription: '',
      accessibleLabelA: '',
      accessibleLabelB: ''
    }, options );

    ABSwitch.call( this, property, valueA, labelA, valueB, labelB, options );
    var thisNode = this;

    // create the div container for this element
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        // The element should look like the following in the Parallel DOM.
        // <div id="toggle-container14-35-417-492-484-473-468">
        //   <input type="button" id="abswitch-14-35-417-492-484-473-468-472" aria-label="Single Balloon Experiment" value="‪Single Balloon Experiment‬" aria-pressed="true">
        // </div>

        // create the div, set its id
        var domElement = document.createElement( 'div' );
        domElement.id = 'toggle-container' + uniqueId;

        return new AccessiblePeer( accessibleInstance, domElement );

      }
    };

    // create a scenery node that contains all of the accessibility information for the toggle button
    // the scenery rectangle cleanly instantiates bounds for the focus highlight
    var accessibilityNode = new Rectangle( thisNode.bounds.dilated( 5 ), {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var trail = accessibleInstance.trail;
          var uniqueId = trail.getUniqueId();

          // The element should look like the following in the Parallel DOM.
          // <input type="button" id="abswitch-id" aria-label="translatable label..." value="translatable label..." aria-pressed="false">

          // create the input element, set its type and id
          var domElement = document.createElement( 'input' );
          domElement.setAttribute( 'type', 'button' );
          domElement.id = 'abswitch-' + uniqueId;

          // set the value and label, which acts as an accessible label
          domElement.setAttribute( 'value', options.accessibleLabelB );
          domElement.setAttribute( 'aria-label', options.accessibleLabelB );

          // set the 'aria-pressed' attribute which provides toggle functionality, initially false
          domElement.setAttribute( 'aria-pressed', false );

          // register observers
          domElement.addEventListener( 'click', function( event ) {

            var pressed = property.value === valueA ? valueB : valueA;
            var labelString = pressed ? options.accessibleLabelA : options.accessibleLabelB;

            property.set( pressed );
            domElement.setAttribute( 'aria-pressed', pressed );
            domElement.setAttribute( 'value', labelString );
            domElement.setAttribute( 'aria-label', labelString );

          } );

          return new AccessiblePeer( accessibleInstance, domElement );

        }
    } } );
    this.addChild( accessibilityNode );

    // make sure that the ABSwitch comes before its descriptions
    this.accessibleOrder = [ accessibilityNode ];

  }

  return inherit( ABSwitch, AccessibleABSwitchNode );

} );