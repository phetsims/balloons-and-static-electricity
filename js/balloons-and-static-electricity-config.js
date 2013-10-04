// Copyright 2002-2013, University of Colorado Boulder

/**
 * RequireJS configuration file for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
require.config( {
  // An array of dependencies to load. Useful when require is defined as a config object before require.js
  // is loaded, and you want to specify dependencies to load as soon as require() is defined.
  deps: ['balloons-and-static-electricity-main'],

  // baseUrl: don't bother trying to set it here, it is overridden by data-main in the top-level HTML file

  // Path mappings for module names not found directly under baseUrl. The path settings are assumed to be
  // relative to baseUrl unless the paths setting starts with a '/' or has a URL protocol.
  paths: {
    AXON: '../../axon/js',

    // common directories, uppercase names to identify them in require imports
    PHETCOMMON: '../../phetcommon/js',
    SCENERY: '../../scenery/js',
    SCENERY_PHET: '../../scenery-phet/js',
    KITE: '../../kite/js',
    PHET_CORE: '../../phet-core/js',
    DOT: '../../dot/js',
    ASSERT: '../../assert/js',
    SUN: '../../sun/js',
    JOIST: '../../joist/js',
    BALLOONS_AND_STATIC_ELECTRICITY: '.',

    // local contrib dependencies
    image: '../../chipper/requirejs-plugins/image',
    audio: '../../chipper/requirejs-plugins/audio',
    string: '../../chipper/requirejs-plugins/string',

    text: '../../sherpa/text'
  },

  // Configure the dependencies and exports for older, traditional 'browser globals' scripts
  // that do not use define() to declare the dependencies and set a module value.
  shim: {
    stats: {
      exports: 'Stats'
    }
  },

  config: {
    i18n: {
      locale: 'en_us' // change this to test other locales
    }
  },

  urlArgs: new Date().getTime()  // cache buster to make browser reload all included scripts
} );
