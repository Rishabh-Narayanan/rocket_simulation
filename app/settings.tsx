"use client";

import { useEffect } from "react";
import { SimulationParameters, defaultParams, simulate } from "./simulation";
import { useAllowAnimation, useSimulationResults } from "./state";

function buildParam(
  id: string,
  title: string,
  defaultValue: number,
  min: number = 0,
  max: number = Infinity
) {
  return (
    <div className="flex flex-col items-start touch-none">
      <label className="text-black" htmlFor={id}>
        {title}:
      </label>
      <input
        id={id}
        name={id}
        type="number"
        min={min}
        max={max}
        defaultValue={defaultValue}
        className="border border-gray py-1 px-2 rounded-md w-full outline-none
				focus:border-accent"
      />
    </div>
  );
}

export default function Settings() {
  const { set_all: set_all_results } = useSimulationResults();
  const { animation, set_animation } = useAllowAnimation();

  return (
    <form
      className="flex flex-col gap-4 p-3 border border-gray rounded-lg h-min"
      action={(d) => {
        const params: SimulationParameters = defaultParams;
        d.forEach((value, key) => {
          if (Object.hasOwn(params, key) && !Number.isNaN(value)) {
            // 'safely' parse into numbers
            params[key as keyof typeof params] = Number.parseFloat(
              value.toString()
            );
          }
        });
				
        simulate(params, set_all_results);
      }}
    >
      <div className="min-w-max w-full">
        <h2 className="font-bold text-lg">Parameters</h2>
        <div className="flex flex-col gap-2 w-full">
          {buildParam("m_r", "Rocket Mass (kg)", defaultParams.m_r)}
          {buildParam("m_f", "Fuel Mass (kg)", defaultParams.m_f)}
          {buildParam("v_0", "Initial Velocity (m/s)", defaultParams.v_0)}
          {buildParam("v_e", "Exhaust Velocity (m/s)", defaultParams.v_e, 1)}
          {buildParam("f_b", "Fuel Burn Rate (kg/s)", defaultParams.f_b, 1)}
          {buildParam("m_e", "Planet Mass (kg)", defaultParams.m_e)}
          {buildParam("r_e", "Planet Radius (m)", defaultParams.r_e, 1000)}
        </div>
      </div>
      <div className="flex flex-row gap-1">
        <p className="text-black">Animations:</p>
        <p
          className={`font-bold cursor-pointer ${
            animation ? "text-accent" : "text-gray"
          }`}
          onClick={() => set_animation({ animation: !animation })}
        >
          {animation ? "Enabled" : "Disabled"}
        </p>
      </div>
      <button
        type="submit"
        className="w-full bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-accent-darker"
      >
        Simulate
      </button>
    </form>
  );
}
