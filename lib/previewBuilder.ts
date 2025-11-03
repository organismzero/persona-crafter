import type { PersonaConfig } from "@/schema/persona";

type PreviewScenario = "firstTime" | "lull" | "roast";

const energyTone = (energy: number) => {
  if (energy >= 8) return "high";
  if (energy <= 3) return "low";
  return "medium";
};

const emojiPack = (density: PersonaConfig["voice"]["emoji_density"], intensity: PersonaConfig["emoji_intensity"]) => {
  const pool = ["✨", "😊", "🔥", "💬", "🎉", "🌀", "🤝", "🛡️"];
  const heavyPool = ["🎉", "🔥", "💥", "😎", "🤖", "💫"];
  const lightPool = ["🙂", "✨", "🌟"];
  const none: string[] = [];
  const densityMap = {
    None: none,
    Light: lightPool,
    Medium: pool,
    Heavy: heavyPool,
  } as const;

  const primary = densityMap[density];
  const fallback = densityMap[intensity];

  if (!primary.length && fallback.length) {
    return fallback;
  }
  if (!primary.length) {
    return [];
  }
  return primary;
};

const pickEmoji = (config: PersonaConfig, count: number) => {
  const available = emojiPack(config.voice.emoji_density, config.emoji_intensity);
  if (!available.length || count <= 0) {
    return "";
  }
  const chosen = Array.from({ length: count }, (_, idx) => available[idx % available.length]);
  if (config.personalization.custom_emotes.length) {
    chosen[chosen.length - 1] = config.personalization.custom_emotes[0];
  }
  return ` ${chosen.join(" ")}`;
};

const applyEnergy = (text: string, energy: number) => {
  if (energy >= 8) {
    return `${text}${text.endsWith("!") ? "" : "!"}`;
  }
  if (energy <= 3) {
    return text.replace(/!/g, ".").replace(/\b(E|e)xcited\b/g, "glad");
  }
  return text;
};

const applyFormality = (text: string, formality: number) => {
  if (formality >= 7) {
    return text
      .replace(/\b(?:I'm|I’m)\b/g, "I am")
      .replace(/\b(?:you're|you’re)\b/g, "you are")
      .replace(/\b(?:let's|let’s)\b/g, "let us")
      .replace(/\bchat\b/g, "conversation");
  }
  if (formality <= 3) {
    return text
      .replace(/\bdo not\b/g, "don't")
      .replace(/\bI am\b/g, "I'm")
      .replace(/\bit is\b/g, "it's")
      .replace(/\byou are\b/g, "you're");
  }
  return text;
};

const sanitizeForRating = (text: string, rating: PersonaConfig["rating"]) => {
  if (rating === "M") return text;
  if (rating === "PG-13") {
    return text.replace(/\b(damn|heck)\b/gi, "dang");
  }
  return text
    .replace(/\b(damn|heck|hecking|freaking|frick)\b/gi, "wow")
    .replace(/\b(badass|sassy)\b/gi, "bold");
};

const roastLine = (config: PersonaConfig) => {
  if (config.roasting === "Off") {
    return "I'll keep it cozy—no roasts on the menu, but I can serve a pep talk instead.";
  }
  if (config.roasting === "Gentle") {
    return "Heh, that 'gentle roast' is more like caramelized compliments—you're too sweet to scorch.";
  }
  if (config.roasting === "Medium") {
    return "Alright, playful roast coming in hot: you're the type to queue a download and forget Wi-Fi exists.";
  }
  return "On command? Say the word and I'll deploy a safe sizzle, then tuck you back in with praise.";
};

const flirtinessTag = (config: PersonaConfig) => {
  switch (config.flirtiness) {
    case "None":
      return "";
    case "Subtle":
      return " (psst, totally platonically impressed)";
    case "Playful":
      return " (could be a wink, could be the LED lights—who knows?)";
    case "Bold":
      if (config.rating === "M") return " (smolder-level wink activated, still TOS-safe)";
      return " (turning the dial right up to the edge of TOS)";
    default:
      return "";
  }
};

const applyPersonaFilters = (text: string, config: PersonaConfig) => {
  let cur = text;
  cur = applyFormality(cur, config.voice.formality);
  cur = applyEnergy(cur, config.voice.energy);
  cur = sanitizeForRating(cur, config.rating);
  return cur;
};

const buildLine = (scenario: PreviewScenario, config: PersonaConfig) => {
  const energy = energyTone(config.voice.energy);
  const emojis = {
    low: pickEmoji(config, 1),
    medium: pickEmoji(config, 2),
    high: pickEmoji(config, 3),
  } as const;

  const baseName = config.personalization.bot_name;
  const community = config.personalization.community_nickname;

  switch (scenario) {
    case "firstTime": {
      const greeting = `Hey there, welcome in! I'm ${baseName}, your ${config.template.toLowerCase()} for tonight${flirtinessTag(config)}.`;
      const vibe = `Grab a seat with the ${community} crew and tell me what you're vibing with${emojis[energy]}`;
      return applyPersonaFilters(`${greeting} ${vibe}`, config);
    }
    case "lull": {
      const filler =
        energy === "low"
          ? "Breathing with the chat—remember to sip water and share your cozy wins."
          : energy === "medium"
          ? "While we reset the scene, drop a quick rose-and-thorn from your day so the streamer can shout you out."
          : "No dead air on my watch—spam your favorite emote combo and let's slingshot the energy back up!";
      return applyPersonaFilters(`${filler}${emojis[energy]}`, config);
    }
    case "roast": {
      const line = roastLine(config);
      return applyPersonaFilters(`${line}${emojis.medium}`, config);
    }
    default:
      return "";
  }
};

export const buildPreviewReplies = (config: PersonaConfig): string[] => {
  const replies = [buildLine("firstTime", config), buildLine("lull", config), buildLine("roast", config)];
  return replies.map((reply) => reply.trim());
};
