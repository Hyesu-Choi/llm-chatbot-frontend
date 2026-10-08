import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ModelState = {
  selectedModel: string | null;
  selectModel: (model: string) => void;
};

export const useModelStore = create<ModelState>()(
  persist(
    (set) => ({
      selectedModel: null,
      selectModel: (model) => set({ selectedModel: model }),
    }),
    { name: "chatbot:model", storage: createJSONStorage(() => localStorage) },
  ),
);
