# Rocket Simulation

This application simulates and visualizes Tsiolkovsky's Ideal Rocket Equation. Using conservation of momentum, the state of the rocket is simulated and drawn to the screen using Chart.js.

## To run
```bash
yarn install
# then
yarn run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. To exit, kill the next server.
## Parameters
The simulation allows you to control the properties of the rocket. For example, you can change the mass of the rocket and the mass of the fuel it's carrying to compare the effect on the kinematic state.
* Enable/Disable animations
* Form Validation
* Smart Evaluation (only when values change)
# ![Parameters](/images/parameters.png)

## Graphs
The simulation graphs the properties of the rocket at different points of time. Namely, it tracks: mass, position, velocity, and time.

It also calculates the states for different gravitational situations: zero gravity, uniform gravity (near the surface of earth g = 9.8), universal gravity (g = GmM/r^2).

* Enable/Disable specific graphs
* View the ideal (mathematical) graphs for the zero and uniform gravity situations.
  * Note that the simulated graph is practically identical to the theoretical graph (except for slight floating point error and discrete time step approximation).
  * Enabling both may ideal and simulated would result in one being hidden over the other (as shown below)

![Mass vs Velocity](/images/mass_velocity.png)
