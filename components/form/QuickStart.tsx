"use client";

import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Sparkles, Volume2 } from "lucide-react";
import type { PersonaConfig } from "@/schema/persona";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

type QuickStartProps = {
  form: UseFormReturn<PersonaConfig>;
};

const templateOptions: Array<{ value: PersonaConfig["template"]; label: string; vibe: string }> = [
  { value: "Chill Sidekick", label: "Chill Sidekick", vibe: "calm hype & steady positivity." },
  { value: "Hype MC", label: "Hype MC", vibe: "max energy announcer who pops off." },
  { value: "Cozy Caretaker", label: "Cozy Caretaker", vibe: "soft tea-and-blankets comfort." },
  { value: "Gremlin Goblin", label: "Gremlin Goblin", vibe: "chaotic good, harmless trolling gremlin." },
  { value: "Wise Mentor", label: "Wise Mentor", vibe: "calm guidance with nuggets of wisdom." },
  { value: "Deadpan Straight-Man", label: "Deadpan Straight-Man", vibe: "dry wit with a wink." },
  { value: "Cute Mascot", label: "Cute Mascot", vibe: "adorable, emote-happy hype." },
  { value: "Brand Ambassador", label: "Brand Ambassador", vibe: "polished, on-message friendliness." },
  { value: "Butler", label: "Butler", vibe: "unflappable service, droll charm." },
  { value: "Succubus", label: "Succubus", vibe: "playfully flirty, innuendo only." },
];

const ratings: PersonaConfig["rating"][] = ["G", "PG", "PG-13", "M"];
const flirtLevels: PersonaConfig["flirtiness"][] = ["None", "Subtle", "Playful", "Bold"];
const roastLevels: PersonaConfig["roasting"][] = ["Off", "Gentle", "Medium", "OnCommand"];
const sensitiveOptions: PersonaConfig["sensitive_topics"][] = [
  "Avoid",
  "NeutralFactsOnly",
  "AllowedWithCare",
];
const emojiIntensityOptions: PersonaConfig["emoji_intensity"][] = ["None", "Light", "Medium", "Heavy"];
const pacingOptions: PersonaConfig["voice"]["pacing"][] = ["Slow", "Balanced", "Rapid"];
const emojiDensityOptions: PersonaConfig["voice"]["emoji_density"][] = ["None", "Light", "Medium", "Heavy"];
const humorOptions: PersonaConfig["voice"]["humor"] = [
  "Wholesome",
  "Dry",
  "Absurd",
  "Chaotic",
  "DadJokes",
  "Deadpan",
];

const valueOptions = [
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
] as const satisfies PersonaConfig["values"][number][];

const redLineOptions = [
  "no_punching_down",
  "kindness_over_cleverness",
  "avoid_trauma_bait",
  "no_controversy_unless_streamer_prompts",
] as const satisfies PersonaConfig["red_lines"][number][];

const toggleArrayValue = <T,>(field: ControllerRenderProps<PersonaConfig, any>, value: T, limit?: number) => {
  const current = (field.value as T[]) ?? [];
  const exists = current.includes(value);
  if (exists) {
    const next = current.filter((item) => item !== value);
    field.onChange(next);
  } else {
    if (limit && current.length >= limit) {
      return;
    }
    field.onChange([...current, value]);
  }
};

const QuickStart = ({ form }: QuickStartProps) => (
  <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-1 text-lg font-semibold">
            Starter Template
            <span className="text-sm font-normal text-muted-foreground">
              This sets the vibe—you can tweak everything later.
            </span>
          </CardTitle>
        </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                <div className="grid grid-cols-1 gap-3">
                  {templateOptions.map((option) => {
                    const isActive = field.value === option.value;
                    return (
                      <Button
                        key={option.value}
                        type="button"
                        variant={isActive ? "default" : "outline"}
                        className="h-auto justify-start gap-2 p-4 text-left"
                        onClick={() => field.onChange(option.value)}
                      >
                        <span className="flex-1 font-semibold">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.vibe}</span>
                      </Button>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Content Rating & Boundaries</CardTitle>
          <span className="text-sm text-muted-foreground">
            PG-13 = mild profanity, flirty jokes OK, never explicit.
          </span>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ratings.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Dial in what’s comfy for stream + community.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="flirtiness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flirtiness</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Flirt level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {flirtLevels.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Keep it playful, consent-first.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roasting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roasting dial</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Roasting level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roastLevels.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Roasting “Gentle” = affectionate ribbing; never mean.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sensitive_topics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sensitive topics</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sensitivity guardrails" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sensitiveOptions.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Choose how cautiously the bot approaches tricky subjects.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emoji_intensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji intensity</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Emoji level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {emojiIntensityOptions.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Choose how extra the emoji cadence feels.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            Voice & Energy
            <Volume2 className="h-5 w-5 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="voice.energy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Energy level</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Chill 1</span>
                  <span>Party 10</span>
                </div>
                <FormDescription>Sets pacing, exclamation marks, and hype.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="voice.formality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formality</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Slangy 1</span>
                  <span>Polished 10</span>
                </div>
                <FormDescription>Controls contractions, slang, and phrasing.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voice.humor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Humor palette</FormLabel>
                <div className="flex flex-col gap-2">
                  {humorOptions.map((option) => {
                    const isActive = field.value?.includes(option);
                    return (
                      <Button
                        key={option}
                        type="button"
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleArrayValue(field, option)}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>
                <FormDescription>Pick vibes that make the bot feel like your co-host.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voice.pacing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pacing</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pacing" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pacingOptions.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Balanced pacing = a sentence or two; keep it snappy.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voice.emoji_density"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji density</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Emoji density" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {emojiDensityOptions.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Controls how many emoji show up per message.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voice.words_to_avoid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Words to avoid</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Comma separate words or short phrases to skip."
                    value={field.value?.join(", ") ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      const list = value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean);
                      field.onChange(list);
                    }}
                  />
                </FormControl>
                <FormDescription>Optional guardrail for personal cringe words.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Core Values & Red Lines</CardTitle>
          <span className="text-sm text-muted-foreground">
            Pick 3-5 values to anchor tone. Red lines stay firm.
          </span>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="values"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Values</FormLabel>
                <div className="flex flex-col gap-2">
                  {valueOptions.map((option) => {
                    const isChecked = field.value?.includes(option);
                    return (
                      <label
                        key={option}
                        className="flex items-center gap-2 rounded-md border border-border bg-background p-2 text-sm"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleArrayValue(field, option, 5)}
                        />
                        <span className="capitalize">{option.replace(/_/g, " ")}</span>
                      </label>
                    );
                  })}
                </div>
                <FormDescription>Values fuel the bot’s heart. Minimum three, max five.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="red_lines"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Red lines</FormLabel>
                <div className="flex flex-col gap-2">
                  {redLineOptions.map((option) => {
                    const isChecked = field.value?.includes(option);
                    return (
                      <label
                        key={option}
                        className="flex items-center gap-2 rounded-md border border-border bg-background p-2 text-sm"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleArrayValue(field, option)}
                        />
                        <span className="capitalize">{option.replace(/_/g, " ")}</span>
                      </label>
                    );
                  })}
                </div>
                <FormDescription>Non-negotiable guardrails baked into every response.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Bot Identity & Lore</CardTitle>
          <span className="text-sm text-muted-foreground">Catchphrases optional—too many can feel spammy.</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="identity.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bot name</FormLabel>
                <FormControl>
                  <Input placeholder="BOT_NAME" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identity.pronouns"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pronouns</FormLabel>
                <FormControl>
                  <Input placeholder="they/them" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identity.vibe_age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vibe age</FormLabel>
                <FormControl>
                  <Input placeholder="ageless AI" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identity.species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Species / type</FormLabel>
                <FormControl>
                  <Input placeholder="AI assistant" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identity.lore_one_liner"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Lore one-liner</FormLabel>
                <FormControl>
                  <Textarea placeholder="Short sentence that sums up the persona" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identity.catchphrases"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Catchphrases</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add one per line. Sprinkle, don't spam."
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      const list = value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean);
                      field.onChange(list);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            Personalization Variables
            <Sparkles className="h-5 w-5 text-primary" />
          </CardTitle>
          <span className="text-sm text-muted-foreground">Embed your names, handles, and inside jokes.</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="personalization.streamer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Streamer name</FormLabel>
                <FormControl>
                  <Input placeholder="STREAMER_NAME" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personalization.streamer_pronouns"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Streamer pronouns</FormLabel>
                <FormControl>
                  <Input placeholder="STREAMER_PRONOUNS" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personalization.streamer_handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Streamer handle</FormLabel>
                <FormControl>
                  <Input placeholder="STREAMER_HANDLE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personalization.community_nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community nickname</FormLabel>
                <FormControl>
                  <Input placeholder="COMMUNITY_NICKNAME" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personalization.bot_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bot name in chat</FormLabel>
                <FormControl>
                  <Input placeholder="BOT_NAME" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personalization.bot_pronouns"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bot pronouns</FormLabel>
                <FormControl>
                  <Input placeholder="BOT_PRONOUNS" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="personalization.custom_emotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom emotes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add one per line, e.g. :chatheart:"
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      const list = value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean);
                      field.onChange(list);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="personalization.words_to_avoid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Words to avoid (personal)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Words or jokes your community dislikes."
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      const list = value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean);
                      field.onChange(list);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
  </div>
);

export default QuickStart;
