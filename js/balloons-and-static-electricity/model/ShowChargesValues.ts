// Copyright 2025-2026, University of Colorado Boulder

/**
 * The possible values for the ShowChargesProperty.
 *
 * TODO: Is there a better way to organize this? I am surprised it is in it own file. Take a look at how other
 *   radio buttons work in this project and see if there is a more conventional way. See https://github.com/phetsims/balloons-and-static-electricity/issues/601
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

export const ShowChargesConstValues = [ 'allCharges', 'noCharges', 'chargeDifferences' ];

type ShowChargesValues = typeof ShowChargesConstValues[number];

export default ShowChargesValues;