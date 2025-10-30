import type { PersonaConfig } from "@/schema/persona";

const TEMPLATE_TRAITS: Record<PersonaConfig["template"], [string, string]> = {
  "Chill Sidekick": ["steady", "encouraging"],
  "Hype MC": ["boisterous", "celebratory"],
  "Cozy Caretaker": ["soothing", "nurturing"],
  "Gremlin Goblin": ["chaotic", "mischievous"],
  "Wise Mentor": ["grounded", "insightful"],
  "Deadpan Straight-Man": ["dry", "wry"],
  "Cute Mascot": ["adorable", "sparkly"],
  "Brand Ambassador": ["polished", "concise"],
  Butler: ["dapper", "attentive"],
  Succubus: ["flirty", "playful"],
};

const refusalToneExamples: Record<NonNullable<PersonaConfig["refusals"]>["style"], string> = {
  warm_apologetic: "Ah shoot, I can’t dive into that—but how about we celebrate the next chat win instead?",
  playful_deflect: "Nice try, sneaky bean! That one’s off-limits, but I’ve got a wholesome alternative ready.",
  firm_brief: "Gonna tap the brakes there—let’s pivot to something stream-safe.",
};

const formatList = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

const doDontLists = (config: PersonaConfig) => {
  const doList: string[] = [
    `Cheerlead viewers using the **${config.template}** vibe.`,
    `Mirror chat energy at ${config.voice.energy}/10 with ${config.voice.emoji_density.toLowerCase()} emoji sprinkles.`,
    `Weave in values: ${config.values.slice(0, 4).map((value) => value.replace(/_/g, " ")).join(", ")}.`,
    `Reference personalization like ${config.personalization.streamer_handle} & ${config.personalization.community_nickname}.`,
    `Keep rating at ${config.rating} while flirting stays **${config.flirtiness.toLowerCase()}**.`,
  ];

  const dontList: string[] = [
    `Break red lines: ${config.red_lines.map((line) => line.replace(/_/g, " ")).join(", ")}.`,
    `Go beyond ${config.roasting.toLowerCase()} roasting ${config.roasting === "Off" ? "(roasts are disabled)" : ""}.`,
    `Drop real PII or break safety guardrails.`,
    `Overuse catchphrases${config.identity.catchphrases.length ? ` (you have ${config.identity.catchphrases.length})` : ""}.`,
    `Change persona without ${config.personalization.streamer_name}'s direction.`,
  ];

  return { doList, dontList };
};

const renderCatchphrases = (phrases: string[]) =>
  phrases.length ? phrases.map((phrase) => `- “${phrase}”`).join("\n") : "- Improvise cozy one-liners as needed.";

const refusalLine = (config: PersonaConfig) => {
  const style = config.refusals?.style ?? "warm_apologetic";
  return refusalToneExamples[style] ?? refusalToneExamples.warm_apologetic;
};

const stayInCharacter = (config: PersonaConfig) => {
  if (config.transparency?.fourth_wall === "FreelyAcknowledgeAI") {
    return "Be candid about being an AI assistant while keeping tone aligned with the persona.";
  }
  if (config.transparency?.fourth_wall === "ICButClarifySensitive") {
    return "Stay in-character unless a topic is sensitive—then clarify gently as an AI companion.";
  }
  if (config.transparency?.fourth_wall === "AlwaysIC") {
    return "Remain fully in-character unless safety is at risk.";
  }
  return "Stay in-character by default; gently mention you’re AI only when it builds trust.";
};

export const buildCheatsheet = (config: PersonaConfig): string => {
  const [traitOne, traitTwo] = TEMPLATE_TRAITS[config.template];
  const { doList, dontList } = doDontLists(config);

  return [
    `# Persona Cheatsheet – ${config.identity.name}`,
    "",
    `**Template:** ${config.template} (${traitOne} & ${traitTwo})`,
    `**Rating:** ${config.rating} | **Flirtiness:** ${config.flirtiness} | **Roasting:** ${config.roasting}`,
    "",
    "## Do",
    formatList(doList),
    "",
    "## Don't",
    formatList(dontList),
    "",
    "## Voice Snapshot",
    `- Energy: ${config.voice.energy}/10`,
    `- Formality: ${config.voice.formality}/10`,
    `- Humor: ${config.voice.humor.join(", ") || "Custom"}`,
    `- Emoji density: ${config.voice.emoji_density}`,
    "",
    "## Catchphrases & Hooks",
    renderCatchphrases(config.identity.catchphrases),
    "",
    "## Refusal Tone",
    `> ${refusalLine(config)}`,
    "",
    "## Stay in Character",
    `- ${stayInCharacter(config)}`,
    `- Personalize with ${config.personalization.bot_name}, ${config.personalization.streamer_name}, and the ${config.personalization.community_nickname} crew.`,
  ].join("\n");
};
