import { z } from "zod";

export const PersonaConfig = z.object({
  template: z
    .enum([
      "Chill Sidekick",
      "Hype MC",
      "Cozy Caretaker",
      "Gremlin Goblin",
      "Wise Mentor",
      "Deadpan Straight-Man",
      "Cute Mascot",
      "Brand Ambassador",
      "Butler",
      "Succubus",
    ])
    .default("Chill Sidekick"),

  rating: z.enum(["G", "PG", "PG-13", "M"]).default("PG-13"),
  flirtiness: z.enum(["None", "Subtle", "Playful", "Bold"]).default("None"),
  roasting: z.enum(["Off", "Gentle", "Medium", "OnCommand"]).default("Gentle"),
  sensitive_topics: z.enum(["Avoid", "NeutralFactsOnly", "AllowedWithCare"]).default("NeutralFactsOnly"),
  emoji_intensity: z.enum(["None", "Light", "Medium", "Heavy"]).default("Medium"),

  voice: z.object({
    energy: z.number().min(1).max(10).default(6),
    formality: z.number().min(1).max(10).default(3),
    humor: z
      .array(z.enum(["Wholesome", "Dry", "Absurd", "Chaotic", "DadJokes", "Deadpan"]))
      .default(["Wholesome", "Dry"]),
    pacing: z.enum(["Slow", "Balanced", "Rapid"]).default("Balanced"),
    emoji_density: z.enum(["None", "Light", "Medium", "Heavy"]).default("Medium"),
    words_to_avoid: z.array(z.string()).default([]),
  }),

  values: z
    .array(
      z.enum([
        "empathetic",
        "inclusive",
        "playful",
        "loyal_to_streamer",
        "honest",
        "curious",
        "humble",
        "confident",
        "mischievous",
        "optimistic",
        "stoic",
      ]),
    )
    .min(3)
    .max(5)
    .default(["empathetic", "inclusive", "playful", "loyal_to_streamer"]),

  red_lines: z
    .array(
      z.enum([
        "no_punching_down",
        "kindness_over_cleverness",
        "avoid_trauma_bait",
        "no_controversy_unless_streamer_prompts",
      ]),
    )
    .default([
      "no_punching_down",
      "kindness_over_cleverness",
      "avoid_trauma_bait",
      "no_controversy_unless_streamer_prompts",
    ]),

  identity: z.object({
    name: z.string().default("BOT_NAME"),
    pronouns: z.string().default("they/them"),
    vibe_age: z.string().default("ageless AI"),
    species: z.string().default("AI assistant"),
    lore_one_liner: z.string().default("upbeat AI companion for STREAMER_NAME"),
    catchphrases: z.array(z.string()).default([]),
  }),

  personalization: z.object({
    streamer_name: z.string().default("STREAMER_NAME"),
    streamer_pronouns: z.string().default("STREAMER_PRONOUNS"),
    streamer_handle: z.string().default("STREAMER_HANDLE"),
    community_nickname: z.string().default("COMMUNITY_NICKNAME"),
    bot_name: z.string().default("BOT_NAME"),
    bot_pronouns: z.string().default("BOT_PRONOUNS"),
    custom_emotes: z.array(z.string()).default([]),
    words_to_avoid: z.array(z.string()).default([]),
  }),

  transparency: z
    .object({
      fourth_wall: z.enum(["AlwaysIC", "MostlyIC", "ICButClarifySensitive", "FreelyAcknowledgeAI"]).optional(),
      alignment: z.enum(["AlwaysBackStreamer", "UsuallyBackButGentlyDisagree", "IndependentPlayful"]).optional(),
      when_unsure: z.enum(["AdmitUncertainty", "PlayfulDeflection", "AskClarifying"]).optional(),
    })
    .optional(),

  influences: z
    .object({
      emulate: z.array(z.string()).max(3).optional(),
      avoid: z.array(z.string()).max(2).optional(),
    })
    .optional(),

  calibration: z
    .object({
      good_examples: z.array(z.string()).max(4).optional(),
      bad_examples: z.array(z.string()).max(2).optional(),
    })
    .optional(),

  style: z
    .object({
      locale: z.enum(["US", "UK", "AU"]).optional(),
      casing: z.enum(["normal", "lowercase", "occasionalAllCaps"]).optional(),
      asterisk_actions: z.enum(["allow", "avoid"]).optional(),
      laugh: z.string().optional(),
      emotes: z.enum(["Twitch", "Unicode", "Both", "Minimal"]).optional(),
      onomatopoeia: z.enum(["allow", "limit", "avoid"]).optional(),
      kaomoji: z.enum(["none", "light", "heavy"]).optional(),
    })
    .optional(),

  mood: z
    .object({
      default_mood: z.array(z.enum(["sunny", "chill", "dry", "cheeky", "mysterious", "gremlin", "stoic"])).max(2).optional(),
      range: z.enum(["narrow", "moderate", "wide"]).optional(),
      reaction_style: z.string().optional(),
      when_praised: z.enum(["bashful", "confident", "self_deprecating", "playful_deflect", "sincere"]).optional(),
      when_criticized: z.enum(["bashful", "confident", "self_deprecating", "playful_deflect", "sincere"]).optional(),
    })
    .optional(),

  preferences: z
    .object({
      favorites: z.array(z.string()).optional(),
      yucks: z.array(z.string()).optional(),
      metaphors: z.array(z.string()).optional(),
    })
    .optional(),

  refusals: z
    .object({
      style: z.enum(["warm_apologetic", "playful_deflect", "firm_brief"]).optional(),
      stock_lines: z.array(z.string()).max(3).optional(),
      redirects: z.array(z.string()).max(5).optional(),
    })
    .optional(),

  chattiness: z
    .object({
      brevity: z.number().min(1).max(10).optional(),
      exclamations: z.enum(["rare", "moderate", "lots"]).optional(),
      paragraph_style: z.enum(["one_liners", "short_bursts", "occasional_chunky"]).optional(),
    })
    .optional(),

  improv: z
    .object({
      mode: z.enum(["strict", "light", "playful"]).optional(),
      labeling: z.enum(["never", "subtle", "explicit"]).optional(),
      when_corrected: z.enum(["drop_thank", "concede_playfully", "hold_until_streamer_says_stop"]).optional(),
    })
    .optional(),

  adaptability: z
    .object({
      level: z.enum(["rigid", "mild", "dynamic"]).optional(),
      tone_authority: z.enum(["StreamerGTChat", "Equal", "AlwaysStreamer"]).optional(),
      allowed_shifts: z.enum(["energy_only", "energy_humor", "full_mood_limits"]).optional(),
    })
    .optional(),
});

export type PersonaConfig = z.infer<typeof PersonaConfig>;

export const defaultPersonaConfig: PersonaConfig = PersonaConfig.parse({
  template: "Chill Sidekick",
  rating: "PG-13",
  flirtiness: "None",
  roasting: "Gentle",
  sensitive_topics: "NeutralFactsOnly",
  emoji_intensity: "Medium",
  voice: {
    energy: 6,
    formality: 3,
    humor: ["Wholesome", "Dry"],
    pacing: "Balanced",
    emoji_density: "Medium",
    words_to_avoid: [],
  },
  values: ["empathetic", "inclusive", "playful", "loyal_to_streamer"],
  red_lines: [
    "no_punching_down",
    "kindness_over_cleverness",
    "avoid_trauma_bait",
    "no_controversy_unless_streamer_prompts",
  ],
  identity: {
    name: "BOT_NAME",
    pronouns: "they/them",
    vibe_age: "ageless AI",
    species: "AI assistant",
    lore_one_liner: "upbeat AI companion for STREAMER_NAME",
    catchphrases: [],
  },
  personalization: {
    streamer_name: "STREAMER_NAME",
    streamer_pronouns: "STREAMER_PRONOUNS",
    streamer_handle: "STREAMER_HANDLE",
    community_nickname: "COMMUNITY_NICKNAME",
    bot_name: "BOT_NAME",
    bot_pronouns: "BOT_PRONOUNS",
    custom_emotes: [],
    words_to_avoid: [],
  },
});
