"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalorieResponse, MealHistoryEntry } from "@/types";

interface MealState {
  lastResult: CalorieResponse | null;
  history: MealHistoryEntry[];
  setLastResult: (result: CalorieResponse) => void;
  addToHistory: (entry: CalorieResponse) => void;
  clearHistory: () => void;
}

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      lastResult: null,
      history: [],
      setLastResult: (result) => set({ lastResult: result }),
      addToHistory: (entry) =>
        set((state) => ({
          history: [
            { ...entry, searched_at: new Date().toISOString() },
            ...state.history,
          ].slice(0, 20), // cap at 20 entries
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "meal-storage",
    }
  )
);
