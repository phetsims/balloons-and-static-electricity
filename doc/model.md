# Balloons and Static Electricity model

This document describes the model for Balloons and Static Electricity.<br>
@author Jesse Greenberg

The model in this simulation has been implemented such that the motion between
two charged objects feels like<br>
F = kq<sub>1</sub>q<sub>2</sub>/r<sup>2</sup><br>

where:
F = applied force, N/m<br>
k = coulombs constant, N m<sup>2</sup>/C<sup>2</sup><br>
q<sub>1</sub> = charge of object 1, C<br>
F<sub>2</sub> = charge of object 2, C<br>
r = distance between objects, m<br>

<b>NOTE:</b>
However, a "true" physical model is not used in this sim, and liberties are
taken so that the motion of the balloons looks nice and feels like the Java
version.<br>

For instance, constant k is 0.1 when calculating forces between the balloon
and the sweater, and 10000 when calculating the forces between the balloon
and the wall.  In addition, the force between objects is actually calculated
with<br>

F = kq<sub>1</sub>q<sub>2</sub>/r<sup>3</sup><br>

so that the acceleration of the balloon is exaggerated. For more details
on the implementation of this simulation, please see https://github.com/phetsims/balloons-and-static-electricity/blob/master/doc/implementation-notes.md
