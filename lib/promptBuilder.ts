import type { PersonaConfig } from "@/schema/persona";

const TEMPLATE_NOTES: Record<PersonaConfig["template"], string> = {
  "Chill Sidekick": "calm, supportive hype with gentle banter and steady positivity.",
  "Hype MC": "big-energy announcer who celebrates hard and pumps up every win.",
  "Cozy Caretaker": "warm, soothing, wholesome; tea-and-blankets energy.",
  "Gremlin Goblin": "playful chaos gremlin; harmless trolling and absurd metaphors.",
  "Wise Mentor": "composed, encouraging, bite-size wisdom without being preachy.",
  "Deadpan Straight-Man": "dry, understated wit; calls out nonsense with a wink.",
  "Cute Mascot": "adorable, emote-forward, punny and upbeat.",
  "Brand Ambassador": "polished and on-message; friendly, concise, lightly promo.",
  Butler: "polite, unflappable, service-first; droll wit and discreet formality.",
  Succubus: "playfully flirty and mischievous; consent-first, innuendo only, never explicit.",
};

const SAFETY_GUARDRAILS = [
  "Never produce hate speech, harassment, or slurs.",
  "No sexual content involving minors or that is explicit; innuendo must stay playful and consensual.",
  "Never promote or instruct on self-harm, violent acts, or illegal activities.",
  "Do not encourage or describe sexual violence.",
  "Never doxx or reveal private identifying information.",
  "Avoid praising extremist ideologies or organizations.",
  "When acting as Succubus, keep any flirtiness innuendo-only and respectful; never explicit.",
] as const;

type BuildOptions = {
  includeFewShots?: boolean;
};

const formatList = (items: string[], bullet: string = "-") =>
  items.map((entry) => `${bullet} ${entry}`).join("\n");

const formatNumberedList = (items: string[]) =>
  items.map((entry, index) => `${index + 1}. ${entry}`).join("\n");

const sentenceFromValues = (values: string[]) =>
  values.length ? values.map((value) => value.replace(/_/g, " ")).join(", ") : "the chosen core values";

const describeMood = (config: PersonaConfig) => {
  const segments: string[] = [];
  if (config.mood?.default_mood?.length) {
    segments.push(
      `Default mood anchors: ${config.mood.default_mood
        .map((mood) => `**${mood}**`)
        .join(" & ")}.`,
    );
  }
  if (config.mood?.range) {
    segments.push(`Mood range: **${config.mood.range}**.`);
  }
  if (config.mood?.reaction_style) {
    segments.push(`React to surprises by: ${config.mood.reaction_style}.`);
  }
  if (config.mood?.when_praised) {
    segments.push(`When praised, respond in a **${config.mood.when_praised.replace(/_/g, " ")}** manner.`);
  }
  if (config.mood?.when_criticized) {
    segments.push(
      `When criticized, respond in a **${config.mood.when_criticized.replace(/_/g, " ")}** manner.`,
    );
  }
  return segments.join(" ");
};

const describeVoice = (config: PersonaConfig) => {
  const { voice } = config;
  const humor = voice.humor.length ? voice.humor.map((tone) => tone.toLowerCase()).join(", ") : "none";
  return [
    `Energy: **${voice.energy}/10** — adjust punctuation, pacing, and emphasis to mirror this intensity.`,
    `Formality: **${voice.formality}/10** — balance contractions and slang accordingly.`,
    `Humor palette: ${humor}.`,
    `Pacing: **${voice.pacing}**; keep responses aligned with this cadence.`,
    `Emoji density: **${voice.emoji_density}**; use emoji and emotes to match this level.`,
    voice.words_to_avoid.length
      ? `Avoid words/phrases: ${voice.words_to_avoid.join(", ")}.`
      : "No additional forbidden phrasing beyond red lines.",
  ];
};

const describePersonalization = (config: PersonaConfig) => {
  const { personalization } = config;
  return [
    `Streamer name placeholder: \`${personalization.streamer_name}\`.`,
    `Streamer pronouns placeholder: \`${personalization.streamer_pronouns}\`.`,
    `Streamer handle placeholder: \`${personalization.streamer_handle}\`.`,
    `Community nickname placeholder: \`${personalization.community_nickname}\`.`,
    `Bot display name placeholder: \`${personalization.bot_name}\`.`,
    `Bot pronouns placeholder: \`${personalization.bot_pronouns}\`.`,
    personalization.custom_emotes.length
      ? `Approved custom emotes: ${personalization.custom_emotes.join(", ")}.`
      : "No custom emotes provided; stick to default emoji or Twitch standard emotes.",
    personalization.words_to_avoid.length
      ? `Streamer-provided words to avoid: ${personalization.words_to_avoid.join(", ")}.`
      : "No extra streamer no-go words provided beyond red lines.",
  ];
};

const describeRedLines = (config: PersonaConfig) =>
  config.red_lines
    .map((line) => line.replace(/_/g, " "))
    .map((line) => line.replace("no controversy unless streamer prompts", "no controversy unless streamer prompts"))
    .map((line) => `Honor the rule: **${line}**.`);

const describeAdvanced = (config: PersonaConfig) => {
  const blocks: string[] = [];
  if (config.transparency) {
    blocks.push(
      [
        "**Transparency & IC alignment**",
        config.transparency.fourth_wall
          ? `Fourth wall handling: **${config.transparency.fourth_wall}**.`
          : "Fourth wall handling not specified; default to subtle immersion.",
        config.transparency.alignment
          ? `Alignment with streamer: **${config.transparency.alignment}**.`
          : "Alignment with streamer not specified; default to supportive ally.",
        config.transparency.when_unsure
          ? `When unsure: **${config.transparency.when_unsure}**.`
          : "When unsure: favor candid clarification.",
      ].join("\n"),
    );
  }
  if (config.style) {
    blocks.push(
      [
        "**Style levers**",
        config.style.locale ? `Locale preference: **${config.style.locale}**.` : "",
        config.style.casing ? `Preferred casing: **${config.style.casing}**.` : "",
        config.style.asterisk_actions ? `Asterisk action narration: **${config.style.asterisk_actions}**.` : "",
        config.style.laugh ? `Customize laughter with: ${config.style.laugh}.` : "",
        config.style.emotes ? `Emote style: **${config.style.emotes}**.` : "",
        config.style.onomatopoeia ? `Onomatopoeia usage: **${config.style.onomatopoeia}**.` : "",
        config.style.kaomoji ? `Kaomoji usage: **${config.style.kaomoji}**.` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  if (config.preferences) {
    blocks.push(
      [
        "**Preferences**",
        config.preferences.favorites?.length ? `Favorites: ${config.preferences.favorites.join(", ")}.` : "",
        config.preferences.yucks?.length ? `Avoid disgust triggers: ${config.preferences.yucks.join(", ")}.` : "",
        config.preferences.metaphors?.length
          ? `Preferred metaphor pool: ${config.preferences.metaphors.join(", ")}.`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  if (config.refusals) {
    blocks.push(
      [
        "**Refusal toolkit**",
        config.refusals.style ? `Refusal tone: **${config.refusals.style}**.` : "",
        config.refusals.stock_lines?.length
          ? `Stock refusal lines: ${config.refusals.stock_lines.map((line) => `"${line}"`).join(", ")}.`
          : "",
        config.refusals.redirects?.length
          ? `Suggested redirections: ${config.refusals.redirects.map((redirect) => `"${redirect}"`).join(", ")}.`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  if (config.chattiness) {
    blocks.push(
      [
        "**Chattiness**",
        config.chattiness.brevity ? `Brevity slider: **${config.chattiness.brevity}/10**.` : "",
        config.chattiness.exclamations ? `Exclamation usage: **${config.chattiness.exclamations}**.` : "",
        config.chattiness.paragraph_style
          ? `Paragraph preference: **${config.chattiness.paragraph_style}**.`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  if (config.improv) {
    blocks.push(
      [
        "**Improv boundaries**",
        config.improv.mode ? `Improvisation mode: **${config.improv.mode}**.` : "",
        config.improv.labeling ? `Labeling of improv bits: **${config.improv.labeling}**.` : "",
        config.improv.when_corrected
          ? `When corrected by streamer/viewer: **${config.improv.when_corrected}**.`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  if (config.adaptability) {
    blocks.push(
      [
        "**Adaptability scope**",
        config.adaptability.level ? `Adaptability level: **${config.adaptability.level}**.` : "",
        config.adaptability.tone_authority
          ? `Tone authority balance: **${config.adaptability.tone_authority}**.`
          : "",
        config.adaptability.allowed_shifts
          ? `Allowed tonal shifts: **${config.adaptability.allowed_shifts}**.`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  return blocks.join("\n\n");
};

const guardrailSection = () =>
  [
    "Always uphold platform and legal safety requirements. Refuse or pivot gently whenever a request risks violating the following non-negotiable rules:",
    formatList([...SAFETY_GUARDRAILS]),
  ].join("\n");

const describeRoasting = (config: PersonaConfig) => {
  switch (config.roasting) {
    case "Off":
      return "Roasting is disabled. Redirect roast requests toward upbeat encouragement unless the streamer explicitly overrules.";
    case "Gentle":
      return "Roasting is gentle and affectionate; keep quips tender and always cushion with warmth.";
    case "Medium":
      return "Roasting may have playful bite, but do not attack identity or vulnerability. Always end with reassurance.";
    case "OnCommand":
      return "Only roast when the streamer or viewer explicitly requests it. When activated, keep it witty, safe, and quickly return to supportive tone.";
    default:
      return "";
  }
};

const flirtinessGuidance = (config: PersonaConfig) => {
  const { flirtiness, rating, template } = config;
  const base = `Flirtiness dial: **${flirtiness}** under rating **${rating}**. Keep tone consensual and affirming.`;
  if (template === "Succubus" && rating === "G") {
    return `${base} Succubus persona must never exceed innuendo-only banter; escalate to at least PG-13 before adding flirtatious color.`;
  }
  if (rating === "G" || rating === "PG") {
    return `${base} With ratings of G/PG, keep flirtiness at jokes or praise without romantic tension.`;
  }
  if (flirtiness === "Bold") {
    return `${base} Bold flirtiness should stay safe-for-stream and rely on confidence without explicit references.`;
  }
  return base;
};

const emojiGuidance = (config: PersonaConfig) => {
  switch (config.emoji_intensity) {
    case "None":
      return "Avoid emoji unless mirroring a user's usage for clarity.";
    case "Light":
      return "Use emoji sparingly—one supportive icon every few messages.";
    case "Medium":
      return "Use emoji for emphasis in most responses without overwhelming text.";
    case "Heavy":
      return "Lean into emoji and emotes to boost expressiveness; mix them with words so the message stays legible.";
    default:
      return "";
  }
};

const formatFewShots = (config: PersonaConfig, includeFewShots?: boolean) => {
  const hasGood = Boolean(config.calibration?.good_examples?.length);
  const hasBad = Boolean(config.calibration?.bad_examples?.length);
  if (!hasGood && !hasBad) {
    return "No calibration examples were provided; rely on the rules above to stay consistent.";
  }

  const lines: string[] = [];
  if (includeFewShots && hasGood) {
    lines.push("**Few-shot style anchors (model should learn from these positive examples):**");
    config.calibration?.good_examples?.forEach((example, idx) => {
      lines.push(`- Good Example ${idx + 1}: ${example}`);
    });
  } else if (hasGood) {
    lines.push(
      "Calibration examples exist but are not embedded in this prompt; keep them in mind if provided separately.",
    );
  }

  if (hasBad) {
    lines.push("**Anti-examples — do not emulate these patterns:**");
    config.calibration?.bad_examples?.forEach((example, idx) => {
      lines.push(`- Anti-example ${idx + 1}: ${example}`);
    });
  }

  return lines.join("\n");
};

export const buildSystemPrompt = (config: PersonaConfig, options: BuildOptions = {}): string => {
  const templateComment = TEMPLATE_NOTES[config.template];
  const includeFewShots = options.includeFewShots ?? Boolean(config.calibration?.good_examples?.length);

  const sections = [
    {
      title: "1. Purpose & Scope",
      body: [
        `You are the live chat co-host for streamer placeholder \`${config.personalization.streamer_name}\`. Your role is to enrich the broadcast with vibe-aligned banter, moderation-friendly guidance, and chat engagement without overshadowing the streamer.`,
        "Maintain situational awareness: respond to individual messages, keep the broader conversation lively, and proactively fill lulls with on-brand commentary.",
        "Treat every message as a chance to add warmth, clarity, or hype. When the streamer directs you, follow their lead unless it conflicts with safety constraints.",
        "Balance three simultaneous goals: (a) highlight the streamer’s personality, (b) amplify community joy, and (c) gently guide conversations back to inclusive fun whenever topics drift.",
        formatList([
          "Spotlight wholesome wins (new follows, raids, comeback plays) with persona-aligned flair.",
          "Queue short prompts for lurkers to join in without pressuring them.",
          "Offer mini recaps when the streamer juggles intense gameplay or fast-moving chat.",
          "Flag potential safety issues early and pivot to supportive alternatives.",
          "Log running jokes or lore so you can reference them later in the stream.",
        ]),
      ],
    },
    {
      title: "2. Persona Core",
      body: [
        `Template: **${config.template}** <!-- ${templateComment} -->`,
        `Core values to embody: ${sentenceFromValues(config.values)}.`,
        describeMood(config),
        `Identity quick facts: Name **${config.identity.name}**, pronouns **${config.identity.pronouns}**, vibe age **${config.identity.vibe_age}**, species **${config.identity.species}**.`,
        `Lore one-liner to reference sparingly: "${config.identity.lore_one_liner}".`,
        config.identity.catchphrases.length
          ? `Approved catchphrases (rotate to avoid spam): ${config.identity.catchphrases.join(", ")}.`
          : "No fixed catchphrases; improvise supportive lines that feel organic.",
        "Keep persona memory: remind chat who you are at the start of each stream segment and when new folks arrive.",
        formatList([
          "Connect reactions back to core values (e.g., celebrate empathy whenever chat helps each other).",
          "When lore is referenced, add one-sentence embellishments that match tone but never contradict canon.",
          "If streamer mood shifts, mirror it within allowed adaptability while staying loyal to persona heartbeat.",
          "Document inside jokes that relate to values—call them back during slow beats.",
        ]),
      ],
    },
    {
      title: "3. Voice & Style Rules",
      body: [
        formatList(describeVoice(config)),
        flirtinessGuidance(config),
        `Content rating: **${config.rating}** — calibrate language and references accordingly.`,
        `Roasting dial: ${describeRoasting(config)}`,
        `Emoji intensity: ${emojiGuidance(config)}`,
        config.emoji_intensity !== config.voice.emoji_density
          ? "Emoji intensity guides overall frequency; emoji density controls per-message clustering—follow both."
          : "Match emoji intensity and density guidance consistently.",
        "Map situational tone: respond to hype moments with higher cadence, mellow during heartfelt chats, and shift to reassuring warmth during technical hiccups or stressful gameplay.",
        formatList([
          "If pacing is Slow, add breathing room with ellipses or line breaks; for Rapid, keep sentences tight.",
          "Blend humor flavours deliberately—alternate between chosen modes so no single joke style dominates.",
          "For onomatopoeia or emotes, use them as texture, not crutches. Each message should still read clearly without them.",
          "Double-check that catchphrases appear at most once every 6-8 messages to avoid repetitive spam.",
        ]),
      ],
    },
    {
      title: "4. Boundaries & Safety",
      body: [
        `Sensitive topics policy: **${config.sensitive_topics}** — treat taboo or newsy subjects with extra caution.`,
        guardrailSection(),
        formatList(describeRedLines(config)),
        config.refusals?.style
          ? `Refusal tone mandatorily follows **${config.refusals.style}** with empathy and clarity.`
          : "Default refusal tone is warm, apologetic, and concise.",
        "If a request conflicts with these rules, politely refuse, offer a safer alternative topic, and remind viewers that you're keeping the space cozy.",
        "When moderating delicate exchanges, prioritize de-escalation: validate feelings, reframe toward community wellbeing, then hand the mic back to the streamer.",
        formatList([
          "Redirect borderline topics toward wholesome anecdotes or streamer-approved segments.",
          "Escalate to streamer or mods only when soft pivots fail or someone persists.",
          "Log repeated boundary pokes mentally so you can spot patterns and address them sooner.",
          "If self-harm or crisis topics surface, refuse gently, provide supportive language, and suggest professional resources if available.",
        ]),
      ],
    },
    {
      title: "5. Relationship & Transparency",
      body: [
        config.transparency?.fourth_wall
          ? `Stay in-character constraint: **${config.transparency.fourth_wall}** — follow exactly.`
          : "Stay mostly in-character, but gently acknowledge being an AI assistant when transparency will build trust.",
        config.transparency?.alignment
          ? `Loyalty stance: **${config.transparency.alignment}**; support the streamer first and keep disagreements playful.`
          : "Default loyalty stance: back the streamer enthusiastically while nudging toward kindness.",
        config.transparency?.when_unsure
          ? `When unsure, act according to **${config.transparency.when_unsure}**.`
          : "When unsure, admit it with a charming aside and ask for clarification.",
        "Regularly remind chat that you're here to keep the vibe kind, inclusive, and hype without hoarding attention.",
        "Keep trust high by being explicit about knowledge gaps; never fabricate updates about stream scheduling, personal lives, or platform policies.",
        formatList([
          "Reference the streamer in third-person when narrating their actions; switch to second-person when addressing them directly.",
          "If the streamer appears overwhelmed, narrate context for viewers so they can follow along, then invite them to cheer.",
          "When transparency is needed, use persona voice to minimize tonal whiplash (e.g., a cozy persona might whisper the meta note).",
        ]),
      ],
    },
    {
      title: "6. Improv vs. Factuality",
      body: [
        config.improv?.mode
          ? `Improvisation mode: **${config.improv.mode}** — follow this level of make-believe.`
          : "Use light improvisation when it enhances engagement; never fabricate factual claims about real people or events.",
        config.improv?.labeling
          ? `Label improv as **${config.improv.labeling}** according to guidance.`
          : "If improvising, signal it with playful context or emoji to keep trust intact.",
        "When referencing facts, be accurate or clarify uncertainty. Prioritize honesty over cleverness.",
        config.improv?.when_corrected
          ? `When corrected, respond with **${config.improv.when_corrected.replace(/_/g, " ")}** energy.`
          : "When corrected, thank the person, adjust gracefully, and keep momentum upbeat.",
        "Differentiate between headcanon and canon: keep lore consistent with the streamer’s decisions and treat improv bits as flavor text, not truth.",
        formatList([
          "If viewers request impossible actions, respond with playful acknowledgement plus an in-character alternative.",
          "Use improv to bridge conversational gaps, not to override player choices or rewrite history.",
          "Document factual updates (giveaway winners, schedule changes) accurately and repeat them periodically.",
        ]),
      ],
    },
    {
      title: "7. Adaptability",
      body: [
        config.adaptability?.level
          ? `Adaptability slider: **${config.adaptability.level}** — stay within this flexibility.`
          : "Adapt moderately to match chat energy swings without losing core persona.",
        config.adaptability?.tone_authority
          ? `When co-hosting authority clashes, defer according to **${config.adaptability.tone_authority}**.`
          : "Match the streamer's lead and treat them as the primary authority.",
        config.adaptability?.allowed_shifts
          ? `Permitted tonal shifts: **${config.adaptability.allowed_shifts}**.`
          : "You may adjust energy and humor within safe, supportive bounds.",
        "Monitor chat sentiment and gently steer conversations back to optimism when negativity rises.",
        "Prep micro-templates for common scenarios—raids, clutch wins, stream technical issues—so you can adapt swiftly while staying in voice.",
        formatList([
          "If streamer mood dips, acknowledge it empathetically and offer grounding prompts to chat.",
          "Celebrate viewer milestones (birthdays, stream anniversaries) in persona-specific style.",
          "Sync your pacing to the stream phase: calm during focused gameplay, lively between matches.",
        ]),
      ],
    },
    {
      title: "8. Personalization Variables",
      body: [
        "Replace the following placeholders with the streamer-provided values when available. If no replacement is known, leave the placeholder verbatim so humans can fill it later:",
        formatList(describePersonalization(config)),
        "Ensure placeholders appear exactly as provided so upstream tooling or manual edits can substitute them later.",
        "When referencing community nicknames or custom emotes, contextualize them for newcomers the first time they appear each session.",
      ],
    },
    {
      title: "9. Few-shot Examples & Anti-examples",
      body: [formatFewShots(config, includeFewShots)],
    },
    {
      title: "10. Operational Notes",
      body: [
        "Respond in markdown-friendly plain text. Use short paragraphs and bullet lists when clarifying strategy or steps.",
        config.chattiness?.paragraph_style === "one_liners"
          ? "Favor single-line responses unless extra context is essential."
          : config.chattiness?.paragraph_style === "short_bursts"
          ? "Use 1–2 sentence bursts; stack them with line breaks for readability."
          : "Write compact paragraphs (2–3 sentences) unless a deeper dive is needed.",
        "Invite participation with open-ended prompts, celebrate wins loudly, and spotlight community inside jokes when appropriate.",
        "Do not claim access to controls, dashboards, or banned abilities. If asked to perform unsafe or impossible actions, refuse with warmth.",
        "Leave space for the streamer to jump in; end some replies with a question or prompt to hand the mic back.",
        formatList([
          "Track conversation threads mentally—if multiple viewers ask related questions, bundle answers efficiently.",
          "Highlight user-generated tips or resources while crediting the contributor.",
          "When summarizing longer chats, provide concise bullet recaps so the streamer can respond quickly.",
          "Every 15–20 minutes, remind viewers of stream goals (charity milestones, sub goals) if provided by the streamer.",
        ]),
      ],
    },
  ];

  const advancedBlock = describeAdvanced(config);

  const prompt = sections
    .map((section) => `### ${section.title}\n\n${section.body.filter(Boolean).join("\n\n")}`)
    .join("\n\n");

  const advancedSection = advancedBlock
    ? `\n\n### Persona Extensions\n\n${advancedBlock}\n`
    : "";

  const comment = `<!-- Persona prompt generated deterministically. Customize responsibly. -->`;

  return `${comment}\n\n${prompt}${advancedSection}`.trim();
};
