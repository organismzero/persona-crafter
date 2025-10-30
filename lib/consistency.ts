import type { PersonaConfig } from "@/schema/persona";

export type ConsistencyResolution = {
  label: string;
  mutate: (config: PersonaConfig) => PersonaConfig;
};

export type ConsistencyIssue = {
  id: string;
  message: string;
  severity: "info" | "warning";
  resolutions?: ConsistencyResolution[];
};

const cloneConfig = (config: PersonaConfig): PersonaConfig =>
  JSON.parse(JSON.stringify(config)) as PersonaConfig;

const hasRoastExamples = (config: PersonaConfig) =>
  Boolean(
    config.calibration?.good_examples?.some((example) =>
      /\broast|\bburn|\bdrag|\bteas(e|ing)/i.test(example),
    ),
  );

export const evaluateConsistency = (config: PersonaConfig): ConsistencyIssue[] => {
  const issues: ConsistencyIssue[] = [];

  if (
    (config.template === "Deadpan Straight-Man" || config.voice.humor.includes("Deadpan")) &&
    config.chattiness?.exclamations === "lots"
  ) {
    issues.push({
      id: "deadpan-exclamations",
      message:
        "Dry humor rarely spams exclamation marks. Consider dialing exclamations down to match the deadpan vibe.",
      severity: "info",
      resolutions: [
        {
          label: "Set exclamations to moderate",
          mutate: (current) => {
            const next = cloneConfig(current);
            next.chattiness = {
              ...next.chattiness,
              exclamations: "moderate",
            };
            return next;
          },
        },
        {
          label: "Set exclamations to rare",
          mutate: (current) => {
            const next = cloneConfig(current);
            next.chattiness = {
              ...next.chattiness,
              exclamations: "rare",
            };
            return next;
          },
        },
      ],
    });
  }

  if (config.voice.energy <= 3 && config.style?.casing === "occasionalAllCaps") {
    issues.push({
      id: "low-energy-allcaps",
      message: "Low energy and occasional ALL CAPS clash. Either raise energy or switch casing to normal.",
      severity: "info",
      resolutions: [
        {
          label: "Use normal casing",
          mutate: (current) => {
            const next = cloneConfig(current);
            next.style = {
              ...next.style,
              casing: "normal",
            };
            return next;
          },
        },
        {
          label: "Bump energy to 5",
          mutate: (current) => {
            const next = cloneConfig(current);
            next.voice.energy = 5;
            return next;
          },
        },
      ],
    });
  }

  if (
    (config.rating === "G" || config.rating === "PG") &&
    (config.flirtiness === "Playful" || config.flirtiness === "Bold")
  ) {
    issues.push({
      id: "rating-flirtiness-mismatch",
      message:
        "Playful or bold flirtiness pushes past G/PG tone. Either soften flirtiness or raise the content rating.",
      severity: "warning",
      resolutions: [
        {
          label: "Set flirtiness to subtle",
          mutate: (current) => {
            const next = cloneConfig(current);
            next.flirtiness = "Subtle";
            return next;
          },
        },
        {
          label: "Raise rating to PG-13",
          mutate: (current) => {
            const next = cloneConfig(current);
            next.rating = "PG-13";
            return next;
          },
        },
      ],
    });
  }

  if (config.template === "Succubus" && config.rating === "G") {
    issues.push({
      id: "succubus-rating",
      message:
        "Succubus persona requires at least PG-13 to keep innuendo safe-for-stream. Raise the rating or pick another template.",
      severity: "warning",
      resolutions: [
        {
          label: "Raise rating to PG-13",
          mutate: (current) => {
            const next = cloneConfig(current);
            next.rating = "PG-13";
            return next;
          },
        },
      ],
    });
  }

  if (config.roasting === "Off" && hasRoastExamples(config)) {
    issues.push({
      id: "roast-examples-mismatch",
      message:
        "Roasting is disabled, but you provided roast-flavored examples. Either allow gentle roasting or swap those examples.",
      severity: "info",
      resolutions: [
        {
          label: "Enable gentle roasting",
          mutate: (current) => {
            const next = cloneConfig(current);
            next.roasting = "Gentle";
            return next;
          },
        },
      ],
    });
  }

  return issues;
};
