import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchModels, type ModelOption } from "./modelApi";
import { useModelStore } from "./modelStore";

export function ModelSelect() {
  const selectedModel = useModelStore((s) => s.selectedModel);
  const selectModel = useModelStore((s) => s.selectModel);
  const [models, setModels] = useState<ModelOption[]>([]);

  useEffect(() => {
    fetchModels()
      .then(({ default: defaultModel, models }) => {
        setModels(models);
        const current = useModelStore.getState().selectedModel;
        const isUsable = models.some((model) => model.id === current && model.installed);
        if (!isUsable) selectModel(defaultModel);
      })
      .catch(() => setModels([]));
  }, [selectModel]);

  if (models.length === 0 || selectedModel === null) return null;

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">모델 선택</span>
      <select
        value={selectedModel}
        onChange={(e) => selectModel(e.target.value)}
        className="field-sizing-content h-9 max-w-[44vw] cursor-pointer appearance-none truncate rounded-full bg-muted py-0 pr-8 pl-3.5 text-[14px] font-semibold text-secondary-foreground outline-none transition hover:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_6%)] focus-visible:ring-2 focus-visible:ring-ring"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id} disabled={!model.installed}>
            {model.installed ? model.id : `${model.id} (설치 필요)`}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
    </label>
  );
}
