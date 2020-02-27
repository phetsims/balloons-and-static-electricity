// Copyright 2018-2020, University of Colorado Boulder

/**
 * Unit tests for balloons-and-static-electricity.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import '../../scenery/js/util/Trail.js'; // Why is Trail not added to scenery namespace for these tests??
import './balloons-and-static-electricity/view/BASESummaryNodeTests.js';
import './balloons-and-static-electricity/view/describers/BalloonDescriberTests.js';
import './balloons-and-static-electricity/view/describers/SweaterDescriberTests.js';
import './balloons-and-static-electricity/view/describers/WallDescriberTests.js';

// Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
QUnit.start();