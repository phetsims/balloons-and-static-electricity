/**
 * The string plugin loader has problems if you try to load the strings from different relative paths
 * So just load them once and make them easily available
 * @author Sam Reid
 */
define( function( require ) {
  "use strict";
  var Strings = require( "i18n!../nls/balloons-and-static-electricity-strings" );
  return Strings;
} );