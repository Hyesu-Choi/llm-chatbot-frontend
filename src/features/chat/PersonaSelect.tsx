import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPersonas, type PersonaOption } from "./personaApi";
import { usePersonaStore } from "./personaStore";

export function PersonaSelect() {
  const selectedPersona = usePersonaStore((s) => s.selectedPersona);
  const selectPersona = usePersonaStore((s) => s.selectPersona);
  const [personas, setPersonas] = useState<PersonaOption[]>([]);

  useEffect(() => {
    fetchPersonas()
      .then(({ default: defaultPersona, personas }) => {
        setPersonas(personas);
        const current = usePersonaStore.getState().selectedPersona;
        if (!personas.some((persona) => persona.id === current)) selectPersona(defaultPersona);
      })
      .catch(() => setPersonas([]));
  }, [selectPersona]);

  if (personas.length === 0 || selectedPersona === null) return null;

  const selected = personas.find((persona) => persona.id === selectedPersona);

  return (
    <label className="relative inline-flex items-center" title={selected?.description}>
      <span className="sr-only">역할 선택</span>
      <select
        value={selectedPersona}
        onChange={(e) => selectPersona(e.target.value)}
        className="field-sizing-content h-9 max-w-[40vw] cursor-pointer appearance-none truncate rounded-full bg-toss-blue-light py-0 pr-8 pl-3.5 text-[14px] font-semibold text-toss-blue-dark outline-none transition hover:bg-[color-mix(in_oklch,var(--toss-blue-light),var(--toss-blue)_10%)] focus-visible:ring-2 focus-visible:ring-ring"
      >
        {personas.map((persona) => (
          <option key={persona.id} value={persona.id}>
            {persona.name}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 size-4 text-toss-blue-dark/70" />
    </label>
  );
}
