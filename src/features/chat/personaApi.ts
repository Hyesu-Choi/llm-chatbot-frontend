import { requestJson } from "@/lib/apiClient";

export type PersonaOption = {
  id: string;
  name: string;
  description: string;
};

export type PersonasResponse = {
  default: string;
  personas: PersonaOption[];
};

export function fetchPersonas(): Promise<PersonasResponse> {
  return requestJson("GET", "/api/personas");
}
