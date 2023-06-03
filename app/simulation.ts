export const defaultParams = {
  m_r: 1.31e5, // mass of rocket
  m_e: 5.972e24, // mass of earth
  r_e: 6.371e6, // radius of earth
  m_f: 2.17e6, // mass of fuel
  v_0: 0, // initial velocity
  v_e: 3.6e3, // exhaust velocity
  f_b: 8.0e3, // fuelburn rate
};
export const defaultResults = {
  zero: [] as DataPt[],
  uniform: [] as DataPt[],
  universal: [] as DataPt[],
  zero_ideal: [] as DataPt[],
  uniform_ideal: [] as DataPt[],
};

export type SimulationParameters = typeof defaultParams;
export type SimulationResults = typeof defaultResults;
export type DataPt = {
  velocity: number;
  position: number;
  mass: number;
  time: number;
};

export const SIMULATION_DATA_POINTS = 50; // record N data points

export async function simulate(
  data: SimulationParameters,
  onCalculate: (data: SimulationResults) => void
) {
  const STEPS = 1000000; // number of iterations

  const DT = data.m_f / data.f_b / STEPS; // time steps
  const DM = data.f_b * DT;
  const G = 6.67e-11;

  let fuel_mass_left = data.m_f;

  // deep copy
  let results: SimulationResults & { [key: string]: DataPt[] } = {
    zero: [],
    uniform: [],
    universal: [],
    zero_ideal: [],
    uniform_ideal: [],
  };

  let c = {
    zero: {
      v: data.v_0,
      x: data.r_e,
      force: (m: number, x: number, v: number) => 0,
    },
    uniform: {
      v: data.v_0,
      x: data.r_e,
      force: (m: number, x: number, v: number) =>
        (G * data.m_e * m) / (data.r_e * data.r_e),
    },
    universal: {
      v: data.v_0,
      x: data.r_e,
      force: (m: number, x: number, v: number) => (G * data.m_e * m) / (x * x),
    },
  };

  let calculations = c as typeof c & {
    [key: string]: {
      x: number;
      v: number;
      force: (m: number, x: number, v: number, t: number) => number;
    };
  };

  for (let g_type in results) {
    results[g_type].push({
      velocity: data.v_0,
      position: data.r_e,
      mass: data.m_r + data.m_f,
      time: 0, // at time 0
    });
  }

  for (let i = 1; i <= STEPS; i++) {
    // CONSERVATION OF MOMENTUM:
    // p_0: m*v
    // p_f: (m - dm)*(v + dv) + dm*(v - v_e) = m*v + m*dv - dm*v_e
    // J = p_f - p_0 = m*dv - dm*v_e = F*dt
    // dv = (F*dt + dm*v_e) / m // F is negative, dm is positive (amount lost)

    const total_mass = fuel_mass_left + data.m_r;

    for (let key in calculations) {
      let g_type = calculations[key];
      let force = g_type.force(total_mass, g_type.x, g_type.v, i * DT);
      let DV = (data.v_e * DM - force * DT) / total_mass;
      g_type.x += g_type.v * DT;
      g_type.v += DV;
    }

    // update fuel_mass
    fuel_mass_left -= DM;

    // add points to data list
    if (i % (STEPS / SIMULATION_DATA_POINTS) == 0) {
			const t = i * DT;

      for (let g_type in calculations) {
        results[g_type].push({
          velocity: calculations[g_type].v,
          position: calculations[g_type].x,
          mass: total_mass,
          time: t,
        });
      }

      // ideal situations (Tsiolkovsky's rocket equation):
      // https://openstax.org/books/university-physics-volume-1/pages/9-7-rocket-propulsion
      // https://phys.libretexts.org/Bookshelves/Classical_Mechanics/Classical_Mechanics_(Tatum)/10%3A_Rocket_Motion/10.03%3A_The_Rocket_Equation
      // https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation

      // Zero Gravity
      // v = v_0 - v_e * ln (1 - f_b/m_0 * t); // m_0 = m_r + m_f (initial)
      // x = int_0^t v dt = (v_0 + v_e)*t + v_e*(m_0/f_b - t)*ln(1- f_b/m_0 * t)

      // Uniform Gravity
      // deltaV = v_e * ln (1 - f_b/m_0 * t) - g*t; // m_0 = m_r + m_f (initial)
      // deltaX = int_0^t v dt = (v_0 + v_e)*t + v_e*(m_0/f_b - t)*ln(1- f_b/m_0 * t) - 1/2*g*t^2
      // for uniform gravity: g affects center of mass uniformly and so can just add on the extra term

      const m_0 = data.m_f + data.m_r;
      const g = calculations.uniform.force(1, data.r_e, data.v_0);
      const M = m_0 - data.f_b * t; // total mass left

      const deltaV = -data.v_e * Math.log(1 - (data.f_b / m_0) * t);
      const deltaX =
        (data.v_0 + data.v_e) * t +
        data.v_e * (m_0 / data.f_b - t) * Math.log(1 - (data.f_b / m_0) * t);

      results.zero_ideal.push({
        time: t,
        mass: M,
        velocity: data.v_0 + deltaV,
        position: data.r_e + deltaX,
      });
      results.uniform_ideal.push({
        time: t,
        mass: M,
        velocity: data.v_0 + deltaV - g * t,
        position: data.r_e + deltaX - 0.5 * g * t * t,
      });
    }
  }
	onCalculate(results);
  console.log("Results:", results);
}
