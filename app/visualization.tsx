"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CategoryScale,
  Chart,
  LineController,
  LineElement,
  LinearScale,
  Point,
  PointElement,
  Scale,
} from "chart.js";
import { useAllowAnimation, useSimulationResults } from "./state";
import {
  SIMULATION_DATA_POINTS,
  DataPt,
  SimulationResults,
} from "./simulation";

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function MyChart(props: {
  id: string;
  title: String;
  graphs: {
    text: string;
    color: string;
    data: { x: number; y: number }[];
  }[];
  axisTitles: {
    x: string;
    y: string;
  };
  showLegend: boolean;
  animate: boolean;
}) {
  const [selected, setSelected] = useState(props.graphs.map(() => true));
  let chart = useRef<Chart>();

  useEffect(() => {
    chart.current = new Chart(props.id, {
      type: "line",
      data: {
        datasets: props.graphs.map((e, i) => ({
          data: e.data,
          borderColor: e.color,
          pointRadius: 0,
          tension: 0.1,
          borderWidth: 1.5,
          xAxisID: "x",
          yAxisID: "y",
        })),
      },
      options: {
        animation: props.animate
          ? {
              delay(ctx, options) {
                const TOTAL_DURATION = 5000; // 5
                const DELAY = TOTAL_DURATION / SIMULATION_DATA_POINTS;
                return ctx.dataIndex * DELAY;
              },
            }
          : false,
        animations: {
          x: {
            from: NaN,
          },
          y: {
            from: NaN,
          },
        },
        scales: {
          x: {
            type: "linear",
            title: {
              display: true,
              text: props.axisTitles.x,
            },
          },
          y: {
            type: "linear",
            title: {
              display: true,
              text: props.axisTitles.y,
            },
          },
        },
      },
    });

    // disable animations on subsequent renders (only when entire component remounts will this repaint)
    chart.current.options.animation = false;

    return () => {
      chart.current?.destroy();
    };
  }, [props]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <label className="text-black font-bold">{props.title}</label>
      {props.showLegend && (
        <div className="justify-center flex flex-row gap-2 items-center flex-wrap">
          {props.graphs.map((e, i) => (
            <button
              key={e.text}
              className="rounded-md px-2 text-sm border"
              style={
                selected[i]
                  ? {
                      borderColor: "transparent",
                      backgroundColor: e.color,
                      color: "white",
                    }
                  : {
                      borderColor: e.color,
                      color: e.color,
                      backgroundColor: "transparent",
                    }
              }
              onClick={() => {
                if (chart.current) {
                  chart.current.setDatasetVisibility(i, !selected[i]);
                  chart.current.update();
                }
                setSelected(
                  selected.map((elem, index) => (index === i ? !elem : elem))
                );
              }}
            >
              {e.text}
            </button>
          ))}
        </div>
      )}
      <canvas id={props.id} />
    </div>
  );
}

function buildChart(
  id: string,
  title: string,
  axisTitles: {
    x: string;
    y: string;
  },
  results: SimulationResults,
  animate: boolean,
  mapper: (e: DataPt) => { x: number; y: number }
) {
  return (
    <MyChart
      id={id}
      title={title}
      graphs={[
        {
          text: "Zero",
          color: "#00c3f4", // blue
          data: results.zero.map(mapper),
        },
        {
          text: "Zero - Ideal",
          color: "#e55757", // red
          data: results.zero_ideal.map(mapper),
        },
        {
          text: "Uniform",
          color: "#f4ab00", // orange
          data: results.uniform.map(mapper),
        },
        {
          text: "Uniform - Ideal",
          color: "#00c659", // green
          data: results.uniform_ideal.map(mapper),
        },
        {
          text: "Universal",
          color: "#dc00f4", // pink
          data: results.universal.map(mapper),
        },
      ]}
      axisTitles={axisTitles}
      showLegend={true}
      animate={animate}
    />
  );
}

export default function Visualizer() {
  const results = useSimulationResults();
  const { animation } = useAllowAnimation();

  return (
    <div className="w-full p-3 border border-gray rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-5">
      {buildChart(
        "mass_vs_velocity",
        "Mass vs Velocity",
        { x: "Velocity (m/s)", y: "Total Mass (kg)" },
        results,
        animation,
        (e) => ({ x: e.velocity, y: e.mass })
      )}
      {buildChart(
        "velocity_vs_time",
        "Velocity vs Time",
        { x: "Time (s)", y: "Velocity (m/s)" },
        results,
        animation,
        (e) => ({ x: e.time, y: e.velocity })
      )}
      {buildChart(
        "position_vs_time",
        "Position vs Time",
        { x: "Time (s)", y: "Position (m)" },
        results,
        animation,
        (e) => ({ x: e.time, y: e.position })
      )}
      {buildChart(
        "position_vs_velocity",
        "Position vs Velocity",
        { x: "Velocity (m/s)", y: "Position (m)" },
        results,
        animation,
        (e) => ({ x: e.velocity, y: e.position })
      )}
      <MyChart
        id={"uniform_vs_universal_difference_velocity_vs_time"}
        title={"Velocity vs Time: (Universal - Uniform)"}
        graphs={[
          {
            text: "Difference",
            color: "#000",
            data: results.uniform.map((e, i) => ({
              x: e.time,
              y: results.universal[i].velocity - e.velocity,
            })),
          },
        ]}
        axisTitles={{ x: "Time (s)", y: "Velocity (m/s)" }}
        showLegend={false}
        animate={animation}
      />
      <MyChart
        id={"uniform_vs_universal_difference_position_vs_time"}
        title={"Position vs Time: (Universal - Uniform)"}
        graphs={[
          {
            text: "Difference",
            color: "#000",
            data: results.uniform.map((e, i) => ({
              x: e.time,
              y: results.universal[i].position - e.position,
            })),
          },
        ]}
        axisTitles={{ x: "Time (s)", y: "Position (m)" }}
        showLegend={false}
        animate={animation}
      />
    </div>
  );
}
