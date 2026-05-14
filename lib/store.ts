"use client";

import { create } from "zustand";

type AppStore = {
  restSeconds: number;
  restActive: boolean;
  setRestSeconds: (seconds: number) => void;
  setRestActive: (active: boolean) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  restSeconds: 90,
  restActive: false,
  setRestSeconds: (seconds) => set({ restSeconds: seconds }),
  setRestActive: (active) => set({ restActive: active }),
}));
