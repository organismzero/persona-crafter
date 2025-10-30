# Build Brief: Personality Questionnaire Web App

**Stack:** Next.js (App Router, TypeScript) + Tailwind CSS + shadcn/ui + OpenAI (optional enhancements)
**Goal:** A simple, friendly online form that lets novice streamers define a chatbot personality. It produces three outputs:

1. a **ready-to-use System Prompt** (comprehensive),
2. a **compact JSON config**, and
3. a **one-page style cheatsheet**.
   Live Preview is always on.

## 0) Non-functional must-haves

* **TypeScript** everywhere; **ESLint + Prettier** configured.
* **App Router** (`/app`) + **Server Actions** or route handlers for OpenAI calls.
* **No external DB.** Persist state to `localStorage` and allow import/export JSON.
* **Accessible UI** (labels/aria), keyboard-friendly, responsive.
* **Warm & casual tone** with short microcopy under choices.
* **Zero PII by default.** Any OpenAI call runs server-side using `process.env.OPENAI_API_KEY`.

---

## 1) Pages / Routes

* `/` → **Questionnaire Wizard** (Quick Start mandatory + Advanced optional) with Live Preview pane.
* `/export` → results page after Generate with three tabs: **System Prompt**, **JSON**, **Cheatsheet** (+ copy/download).
* `/about` → minimal description & privacy note (no data stored server-side).

---

## 2) UI Layout & Components

Use **shadcn/ui** components:

* `Tabs`, `Accordion`, `Form`, `Input`, `Textarea`, `Select`, `Switch`, `Slider`, `Badge`, `Button`, `Alert`, `Dialog`, `Toast`, `Separator`, `Card`.
* **Two-pane layout**: left = form; right = **Live Preview** with 3 rotating sample replies. On mobile, preview collapses under the form.

**Wizard structure**

* **Quick Start (mandatory)** sections:

  1. Starter Template (radio tiles)
  2. Content Rating & Boundaries
  3. Voice & Energy
  4. Core Values & Red Lines
  5. Bot Identity & Lore
  6. Personalization Variables
  7. Generate
* **Advanced (optional)**: collapsible accordion with the personality-only sections listed below.

**Microcopy style:** short, plain; show small examples under each control.

---

## 3) Data Model & Validation (Zod)

Create a single Zod schema `PersonaConfig` (exported) with defaults matching the agreed Quick Start.

```ts
// schema/persona.ts
import { z } from "zod";

export const PersonaConfig = z.object({
  template: z.enum([
    "Chill Sidekick","Hype MC","Cozy Caretaker","Gremlin Goblin",
    "Wise Mentor","Deadpan Straight-Man","Cute Mascot",
    "Brand Ambassador","Butler","Succubus"
  ]).default("Chill Sidekick"),

  rating: z.enum(["G","PG","PG-13","M"]).default("PG-13"),
  flirtiness: z.enum(["None","Subtle","Playful","Bold"]).default("None"),
  roasting: z.enum(["Off","Gentle","Medium","OnCommand"]).default("Gentle"),
  sensitive_topics: z.enum(["Avoid","NeutralFactsOnly","AllowedWithCare"]).default("NeutralFactsOnly"),
  emoji_intensity: z.enum(["None","Light","Medium","Heavy"]).default("Medium"),

  voice: z.object({
    energy: z.number().min(1).max(10).default(6),
    formality: z.number().min(1).max(10).default(3),
    humor: z.array(z.enum(["Wholesome","Dry","Absurd","Chaotic","DadJokes","Deadpan"]))
      .default(["Wholesome","Dry"]),
    pacing: z.enum(["Slow","Balanced","Rapid"]).default("Balanced"),
    emoji_density: z.enum(["None","Light","Medium","Heavy"]).default("Medium"),
    words_to_avoid: z.array(z.string()).default([])
  }),

  values: z.array(z.enum([
    "empathetic","inclusive","playful","loyal_to_streamer",
    "honest","curious","humble","confident","mischievous","optimistic","stoic"
  ])).min(3).max(5).default(["empathetic","inclusive","playful","loyal_to_streamer"]),

  red_lines: z.array(z.enum([
    "no_punching_down","kindness_over_cleverness",
    "avoid_trauma_bait","no_controversy_unless_streamer_prompts"
  ])).default([
    "no_punching_down","kindness_over_cleverness",
    "avoid_trauma_bait","no_controversy_unless_streamer_prompts"
  ]),

  identity: z.object({
    name: z.string().default("BOT_NAME"),
    pronouns: z.string().default("they/them"),
    vibe_age: z.string().default("ageless AI"),
    species: z.string().default("AI assistant"),
    lore_one_liner: z.string().default("upbeat AI companion for STREAMER_NAME"),
    catchphrases: z.array(z.string()).default([])
  }),

  personalization: z.object({
    streamer_name: z.string().default("STREAMER_NAME"),
    streamer_pronouns: z.string().default("STREAMER_PRONOUNS"),
    streamer_handle: z.string().default("STREAMER_HANDLE"),
    community_nickname: z.string().default("COMMUNITY_NICKNAME"),
    bot_name: z.string().default("BOT_NAME"),
    bot_pronouns: z.string().default("BOT_PRONOUNS"),
    custom_emotes: z.array(z.string()).default([]),
    words_to_avoid: z.array(z.string()).default([])
  }),

  // Advanced (all optional)
  transparency: z.object({
    fourth_wall: z.enum(["AlwaysIC","MostlyIC","ICButClarifySensitive","FreelyAcknowledgeAI"]).optional(),
    alignment: z.enum(["AlwaysBackStreamer","UsuallyBackButGentlyDisagree","IndependentPlayful"]).optional(),
    when_unsure: z.enum(["AdmitUncertainty","PlayfulDeflection","AskClarifying"]).optional()
  }).optional(),

  influences: z.object({
    emulate: z.array(z.string()).max(3).optional(),
    avoid: z.array(z.string()).max(2).optional()
  }).optional(),

  calibration: z.object({
    good_examples: z.array(z.string()).max(4).optional(),
    bad_examples: z.array(z.string()).max(2).optional()
  }).optional(),

  style: z.object({
    locale: z.enum(["US","UK","AU"]).optional(),
    casing: z.enum(["normal","lowercase","occasionalAllCaps"]).optional(),
    asterisk_actions: z.enum(["allow","avoid"]).optional(),
    laugh: z.string().optional(),
    emotes: z.enum(["Twitch","Unicode","Both","Minimal"]).optional(),
    onomatopoeia: z.enum(["allow","limit","avoid"]).optional(),
    kaomoji: z.enum(["none","light","heavy"]).optional()
  }).optional(),

  mood: z.object({
    default_mood: z.array(z.enum(["sunny","chill","dry","cheeky","mysterious","gremlin","stoic"])).max(2).optional(),
    range: z.enum(["narrow","moderate","wide"]).optional(),
    reaction_style: z.string().optional(),
    when_praised: z.enum(["bashful","confident","self_deprecating","playful_deflect","sincere"]).optional(),
    when_criticized: z.enum(["bashful","confident","self_deprecating","playful_deflect","sincere"]).optional()
  }).optional(),

  preferences: z.object({
    favorites: z.array(z.string()).optional(),
    yucks: z.array(z.string()).optional(),
    metaphors: z.array(z.string()).optional()
  }).optional(),

  refusals: z.object({
    style: z.enum(["warm_apologetic","playful_deflect","firm_brief"]).optional(),
    stock_lines: z.array(z.string()).max(3).optional(),
    redirects: z.array(z.string()).max(5).optional()
  }).optional(),

  chattiness: z.object({
    brevity: z.number().min(1).max(10).optional(),
    exclamations: z.enum(["rare","moderate","lots"]).optional(),
    paragraph_style: z.enum(["one_liners","short_bursts","occasional_chunky"]).optional()
  }).optional(),

  improv: z.object({
    mode: z.enum(["strict","light","playful"]).optional(),
    labeling: z.enum(["never","subtle","explicit"]).optional(),
    when_corrected: z.enum(["drop_thank","concede_playfully","hold_until_streamer_says_stop"]).optional()
  }).optional(),

  adaptability: z.object({
    level: z.enum(["rigid","mild","dynamic"]).optional(),
    tone_authority: z.enum(["StreamerGTChat","Equal","AlwaysStreamer"]).optional(),
    allowed_shifts: z.enum(["energy_only","energy_humor","full_mood_limits"]).optional()
  }).optional()
});
export type PersonaConfig = z.infer<typeof PersonaConfig>;
```

---

## 4) Safety Guardrails (fixed)

Hard-code (non-negotiable) checks in UI help text and generation step:

* No hate/harassment/slurs, no sexual content with or about minors, no sexual violence, no doxxing, no self-harm encouragement, no illegal instruction, no violent threats, no extremist praise.
  Note: **Succubus** template is innuendo-only; never explicit.

---

## 5) Live Preview (always on)

**Deterministic client preview** (no API required):

* Use the current config to render 3 sample replies:

  1. *“First-time chatter says hi.”*
  2. *“There’s a lull; fill 1 line.”*
  3. *“Viewer asks for a gentle roast.”*
* Apply tone knobs (energy affects punctuation/cadence; formality affects contractions; emoji density & emotes reflected; rating gates profanity; roasting level gates teasing).
* If `OPENAI_API_KEY` exists, add a **“Enhance Preview”** toggle that calls `/api/preview` to rewrite the same drafts with the chosen persona.

---

## 6) Consistency Checker

Run simple rules on every change (show non-blocking toasts/badges):

* **Deadpan + “lots of !!!”** → suggest “exclamations: moderate/rare.”
* **Energy ≤3 + “occasional ALL CAPS”** → suggest “casing: normal.”
* **Rating G/PG + flirtiness Playful/Bold** → suggest lowering flirtiness or raising rating.
* **Succubus + rating G** → suggest PG-13 minimum.
* **Roasting Off + selected ‘roast’ example lines** → warn; suggest Gentle.
  User can accept a one-click fix or ignore.

---

## 7) System Prompt Generator (comprehensive)

Generate a **~1,400–2,000 word** markdown prompt entirely on the **server** at `/api/generate` with the following inputs:

* `config: PersonaConfig`
* `includeFewShots: boolean` (true if calibration examples exist)

**If no API key** → generate the prompt **deterministically on client** using a string template and the config (no model calls).
**If API key present** → server route may **polish wording**, but must **not** alter safety guardrails or user choices.

**Sections order** (fixed):

1. Purpose & Scope
2. Persona Core (template, values, mood, identity/lore)
3. Voice & Style Rules (energy/formality/humor/mannerisms/chattiness)
4. Boundaries & Safety (rating, toggles, red lines, refusal style)
5. Relationship & Transparency (stay-in-character choices)
6. Improv vs. Factuality
7. Adaptability
8. Personalization Variables (rendered)
9. Few-shot Examples & Anti-examples (if provided)
10. Operational Notes (formatting expectations; no external functionality)

**Template notes**

* Use second-person imperatives to instruct the model.
* Insert the **10 starter templates’ one-line vibes** as inline comments when that template is chosen (for clarity, not as behavior).
* Insert **microcopy** sparingly as comments only, not as rules.

---

## 8) JSON Output

On Generate, display a **JSON tab** with the exact `PersonaConfig` object (post-validation).
Provide **Copy** and **Download** (`persona.json`).

---

## 9) Cheatsheet Output (one-pager)

Render a printable card:

* Persona snapshot (template + two adjectives)
* Do / Don’t (5–7 bullets generated from config)
* Voice sliders (energy/formality) + emoji density
* Catchphrases (if any)
* Refusal tone example (one line)
* “Stay in character” reminder
  Provide **Copy**, **Print**, **Download** (`cheatsheet.md`).

---

## 10) State Management

* Keep in React state; mirror to `localStorage` (`persona_config_v1`) on change (debounced).
* **Import/Export** controls at top-right: Import JSON → load into form; Export JSON → download.

---

## 11) OpenAI Integration (optional but supported)

* Route: `POST /api/generate` & `POST /api/preview`
* Input: `{ config: PersonaConfig, includeFewShots?: boolean }`
* Output: `{ systemPrompt: string }` or `{ previews: string[] }`
* **Server-only** usage of `process.env.OPENAI_API_KEY`.
* If key missing: return 400 with message; UI falls back to client generation.

---

## 12) Acceptance Criteria

1. **Quick Start flow** cannot proceed to Generate until required fields are valid.
2. **Live Preview** updates instantly on any change; “Enhance Preview” only appears if API key configured.
3. **Consistency Checker** surfaces conflicts and offers one-click fixes that modify form state.
4. **Generate** produces three artifacts reliably: System Prompt (>=1,400 words when API is on; otherwise deterministic template ~1,200–1,600), JSON, Cheatsheet.
5. **Export/Import** round-trips without losing any fields.
6. **Succubus** template never produces explicit content; warnings appear if rating too low.
7. All UI copy uses **warm & casual tone** with microcopy under controls.
8. **Mobile** layout stacks form and preview; desktop shows side-by-side.

---

## 13) Starter Content (seed)

**Template one-liners (fixed):**

1. Chill Sidekick — calm, supportive hype with gentle banter and steady positivity.
2. Hype MC — big-energy announcer who celebrates hard and pumps up every win.
3. Cozy Caretaker — warm, soothing, wholesome; tea-and-blankets energy.
4. Gremlin Goblin — playful chaos gremlin; harmless trolling and absurd metaphors.
5. Wise Mentor — composed, encouraging, bite-size wisdom without being preachy.
6. Deadpan Straight-Man — dry, understated wit; calls out nonsense with a wink.
7. Cute Mascot — adorable, emote-forward, punny and upbeat.
8. Brand Ambassador — polished and on-message; friendly, concise, lightly promo.
9. Butler — polite, unflappable, service-first; droll wit and discreet formality.
10. Succubus — playfully flirty and mischievous; consent-first, innuendo only, never explicit.

**Quick Start defaults (pre-filled):**

* Template: **Chill Sidekick**
* Rating **PG-13**; Flirtiness **None**; Roasting **Gentle**; Sensitive topics **Neutral facts only**; Emoji intensity **Medium**
* Voice: Energy **6/10**, Formality **3/10**, Humor **Wholesome + light Dry**, Pacing **Balanced**, Emoji density **Medium**, Words to avoid **[]**
* Values: **empathetic, inclusive, playful, loyal-to-streamer**
* Red lines (always on): **never punch down; prefer kindness over cleverness; avoid trauma bait; steer clear of controversy unless the streamer prompts it**
* Identity & Lore: **BOT_NAME**, **they/them**, **ageless AI**, **AI assistant**, one-liner: “upbeat AI companion for **STREAMER_NAME**”, catchphrases **[]**
* Personalization vars: **STREAMER_NAME, STREAMER_PRONOUNS, STREAMER_HANDLE, COMMUNITY_NICKNAME, BOT_NAME, BOT_PRONOUNS, CUSTOM_EMOTES, WORDS_TO_AVOID**

**Example microcopy seeds** (render small under fields):

* “This sets the vibe—you can tweak everything later.”
* “PG-13 = mild profanity, flirty jokes OK, never explicit.”
* “Roasting ‘Gentle’ = affectionate ribbing; never mean.”
* “Balanced pacing = a sentence or two; keep it snappy.”
* “Catchphrases optional—too many can feel spammy.”
* “If unsure, choose ‘Admit uncertainty’—kind > clever.”

---

## 14) File Hints (suggested)

```
/app
  /api
    /generate/route.ts
    /preview/route.ts
  /export/page.tsx
  /about/page.tsx
  /page.tsx
/components
  LivePreview.tsx
  ConsistencyHints.tsx
  QuickStart.tsx
  AdvancedSections.tsx
  ExportTabs.tsx
  ImportExportBar.tsx
  FormControls/...
/lib
  promptBuilder.ts   // deterministic generator
  previewBuilder.ts  // deterministic preview drafts
  consistency.ts     // rules engine
  storage.ts         // localStorage helpers
/schema/persona.ts
/styles/globals.css
```

---

## 15) Deterministic Prompt Builder (outline)

Create `lib/promptBuilder.ts` that maps `PersonaConfig` → long markdown string.

* Use numbered rules, bulleted style guides, and embed personalization variables.
* Include **Few-shot** from `calibration.good_examples` if present; add **Anti-examples** as “Do not sound like: …”.

---

That’s it—please implement to spec. Once done, deliver:

* a running app,
* the `PersonaConfig` schema,
* and a sample export (system prompt + JSON + cheatsheet) using the Quick Start defaults.
