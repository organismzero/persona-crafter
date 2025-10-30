import { PersonaConfig, defaultPersonaConfig } from "@/schema/persona";
import { z } from "zod";

export const STORAGE_KEYS = {
  config: "persona_config_v1",
  artifacts: "persona_artifacts_v1",
} as const;

export type GeneratedArtifacts = {
  systemPrompt: string;
  cheatsheet: string;
  persona: PersonaConfig;
  includeFewShots: boolean;
  createdAt: string;
};

const GeneratedArtifactsSchema: z.ZodType<GeneratedArtifacts> = z.object({
  systemPrompt: z.string(),
  cheatsheet: z.string(),
  persona: PersonaConfig,
  includeFewShots: z.boolean(),
  createdAt: z.string(),
});

const safeStorage = () => (typeof window === "undefined" ? null : window.localStorage);

export const loadPersonaConfig = (): PersonaConfig => {
  const storage = safeStorage();
  if (!storage) {
    return defaultPersonaConfig;
  }

  const raw = storage.getItem(STORAGE_KEYS.config);
  if (!raw) {
    return defaultPersonaConfig;
  }

  try {
    const parsed = JSON.parse(raw);
    return PersonaConfig.parse(parsed);
  } catch {
    return defaultPersonaConfig;
  }
};

export const savePersonaConfig = (config: PersonaConfig) => {
  const storage = safeStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
  } catch (error) {
    console.warn("Unable to persist persona config", error);
  }
};

export const clearPersonaConfig = () => {
  const storage = safeStorage();
  storage?.removeItem(STORAGE_KEYS.config);
};

export const loadArtifacts = (): GeneratedArtifacts | null => {
  const storage = safeStorage();
  if (!storage) {
    return null;
  }

  const raw = storage.getItem(STORAGE_KEYS.artifacts);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return GeneratedArtifactsSchema.parse(parsed);
  } catch {
    return null;
  }
};

export const saveArtifacts = (artifacts: GeneratedArtifacts) => {
  const storage = safeStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEYS.artifacts, JSON.stringify(artifacts));
  } catch (error) {
    console.warn("Unable to persist persona artifacts", error);
  }
};
