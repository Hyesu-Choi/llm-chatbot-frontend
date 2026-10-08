import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PersonaState = {
  selectedPersona: string | null;
  selectPersona: (persona: string) => void;
};

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set) => ({
      selectedPersona: null,
      selectPersona: (persona) => set({ selectedPersona: persona }),
    }),
    { name: "chatbot:persona", storage: createJSONStorage(() => localStorage) },
  ),
);
