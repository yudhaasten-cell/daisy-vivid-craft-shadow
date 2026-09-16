import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_ASSUMPTIONS } from "./engine";
import type { DeskAssumptions, DeskView } from "./types";

type DeskState = {
  view: DeskView;
  setView: (view: DeskView) => void;
  assumptions: DeskAssumptions;
  setAssumption: (key: keyof DeskAssumptions, value: number) => void;
  resetAssumptions: () => void;
  ritualDone: string[];
  toggleRitual: (time: string) => void;
  lastNote: string | null;
  lastNoteAt: string | null;
  setLastNote: (note: string) => void;
};

export const useDeskStore = create<DeskState>()(
  persist(
    (set, get) => ({
      view: "papan",
      setView: (view) => set({ view }),
      assumptions: DEFAULT_ASSUMPTIONS,
      setAssumption: (key, value) =>
        set({ assumptions: { ...get().assumptions, [key]: value } }),
      resetAssumptions: () => set({ assumptions: DEFAULT_ASSUMPTIONS }),
      ritualDone: [],
      toggleRitual: (time) => {
        const cur = get().ritualDone;
        set({
          ritualDone: cur.includes(time)
            ? cur.filter((item) => item !== time)
            : [...cur, time],
        });
      },
      lastNote: null,
      lastNoteAt: null,
      setLastNote: (note) =>
        set({ lastNote: note, lastNoteAt: new Date().toISOString() }),
    }),
    {
      name: "neraca-desk-v1",
      partialize: (state) => ({
        assumptions: state.assumptions,
        ritualDone: state.ritualDone,
        lastNote: state.lastNote,
        lastNoteAt: state.lastNoteAt,
      }),
    },
  ),
);
