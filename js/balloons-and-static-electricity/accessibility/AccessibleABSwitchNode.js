// Copyright 2015, University of Colorado Boulder

/**
 * An accessible switch node.  The type has a child ABSwitch, but extends AccessibleNode for accessibility
 * behavior.  AccessibleNode could be added to Node, and that would be unecessary.
 *
 * @author: Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessibleNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleNode' );
  var ABSwitch = require( 'SUN/ABSwitch' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   *
   * @param property
   * @param valueA
   * @param labelA
   * @param valueB
   * @param labelB
   * @param options
   * @constructor
   */
  function AccessibleABSwitchNode( property, valueA, labelA, valueB, labelB, options ) {

    var self = this;

    options = _.extend( {
      tagName: 'input',
      inputType: 'checkbox',
      useAriaLabel: true,
      parentContainerTagName: 'div',
      events: {
        click: function( event ) {

          // toggle the value on click event
          var pressed = property.value === valueA ? valueB : valueA;
          property.set( pressed );

          // toggle the aria-checked value, checked when valueB selected
          self.setAttribute( 'aria-checked', pressed === valueB );
        }
      },
      ariaRole: 'switch',
      ariaAttributes: [
        {
          attribute: 'aria-checked',
          value: false
        }
      ],
      tandem: Tandem.createDefaultTandem( 'accessibleABSwitchNode' )

    }, options );

    var switchNode = new ABSwitch( property, valueA, labelA, valueB, labelB, options );

    AccessibleNode.call( this, options );

    // the abswitch must have 1px width for VO to recognize
    this.domElement.style.width = '1px';

    // add the view element as a child
    this.addChild( switchNode );
  }

  balloonsAndStaticElectricity.register( 'AccessibleABSwitchNode', AccessibleABSwitchNode );

  return inherit( AccessibleNode, AccessibleABSwitchNode );
} );