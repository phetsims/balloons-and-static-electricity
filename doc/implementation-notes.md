# Balloons and Static Electricity - Implementation Notes

This document contains notes that will be helpful to developers and future maintainers of this simulation.<br>
@author Jesse Greenberg

## Model
Start by reading the model description in https://github.com/phetsims/balloons-and-static-electricity/blob/master/doc/model.md

The main model for this simulation is 'BASEModel', which contains the rest of the model
components.  This sim will have one or two balloons, a sweater, and a wall.  This compoentThis component also is responsible for keeping the balloons within the bounds of the play area.

The 'BalloonModel' is responsible for all force calculations, since the Balloons are the only objects that move. The
'BalloonModel' can calculate the forces between a balloon and sweater, wall, and the other balloon. During motion,
the model will calculate forces present from all charged objects in the room, and move accordingly.

As mentioned in model.md, this simulation takes liberties with regards to the physical model so that the balloon
motion looks good.  The force between two objects is calculated by<br>
F = kq<sub>1</sub>q<sub>2</sub>/r<sup>2</sup><br>
(see model.md for an explanation of each variable)

In this simulation, the value of k is different when calculating forces between the balloon and the sweater, and
the balloon and the wall. r is only in ScreenView coordinates, and q<sub>1</sub> and q<sub>2</sub> charge values
are integers representing the number of charges currently held. As such, forces calculated in this sim are all
<i>unitless</i>. The motion of the balloon is tweaked to look good by the constants k in the force equation, and by a
scale factor of 1000 that is applied to the step functions of the model.

The three objects in the model can all have charge, and this is implemented via the PointChargeModel.  The balloon
starts out with four pairs of neutral charges.  As the balloon rubs along the sweater, it will take negative charges
away.  The balloon cannot take charges away from the wall.  Instead, the charges in the wall will move away from the
charged balloon to represent induced charge.  The charges in the wall are implemented with 'MovablePointChargeModel'.

Positions of all charges were chosen empirically.  When charges move from sweater to balloon, the model objects
don't actually move from one object to another.  Rather, the charge value updates and the visibility of charges
changes to represent the model. Each object then has a pre-determined number of chargees that it can hold.

To pick up charges, the left edge of the balloon must intersect a negative charge on the sweater at a high enough
speed.  This speed is calculated by averaging the velocity of the balloon for five animation frames. This threshold
speed was determined empirically.

## View

Because the model uses unitless forces to manipulate the position of the balloons, there really is no model
coordinate system.  The simulation is defined in the context of ScreenView coordinates, and there is no model-view
transformation.

As mentioned above, charges are not passed from one object to another, but their visibiliy changes instead.

## Memory Management

All objects exist for the life of the sim, and there is no need to dynamically create or destroy objects.  All
listeners added to observable Properties also exist for the lifetime of the sim.  There is no need to use the various
memory management functions such as unlink, dispose, detach, and so on.

For a list of query parameters that are specific to this simulation, see 'BASEQueryParameters'.
