import { requestJson } from "@/lib/apiClient";

export type ModelOption = {
  id: string;
  installed: boolean;
};

export type ModelsResponse = {
  default: string;
  models: ModelOption[];
};

export function fetchModels(): Promise<ModelsResponse> {
  return requestJson("GET", "/api/models");
}
