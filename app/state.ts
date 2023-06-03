import { create } from "zustand";
import { combine } from "zustand/middleware";
import {
  SimulationResults,
  defaultResults,
} from "./simulation";

export const useSimulationResults = create(
  combine(defaultResults, (set) => ({
    set_all: (value: SimulationResults) =>
      set((state) => ({ ...state, ...value })),
  }))
);

export const useAllowAnimation = create(
  combine({ animation: true }, (set) => ({
    set_animation: (value: { animation: boolean }) =>
      set((state) => ({ ...state, ...value })),
  }))
);
