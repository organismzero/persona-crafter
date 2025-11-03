"use client";

import { ReactNode } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { PersonaConfig, PersonaFormValues } from "@/schema/persona";

type AdvancedSectionsProps = {
  form: UseFormReturn<PersonaFormValues>;
};

type SelectWithClearProps = {
  field: ControllerRenderProps<PersonaFormValues, any>;
  placeholder: string;
  children: ReactNode;
  clearLabel?: string;
};

const SelectWithClear = ({ field, placeholder, children, clearLabel = "Clear" }: SelectWithClearProps) => (
  <div className="flex items-center gap-2">
    <Select onValueChange={(value) => field.onChange(value || undefined)} value={field.value ?? ""}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      {children}
    </Select>
    {field.value ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => field.onChange(undefined)}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        {clearLabel}
      </Button>
    ) : null}
  </div>
);

const AdvancedSections = ({ form }: AdvancedSectionsProps) => (
  <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
    <h2 className="text-lg font-semibold">Advanced Personality Tweaks</h2>
    <p className="text-sm text-muted-foreground">
      Dial in transparency, improv, and style extras when you’re ready. If unsure, skip—defaults are safe.
    </p>
    <Accordion type="multiple" className="mt-4 space-y-3">
      <AccordionItem value="transparency" className="rounded-lg border bg-background px-4">
        <AccordionTrigger>Transparency & Alignment</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormField
            control={form.control}
            name="transparency.fourth_wall"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fourth wall</FormLabel>
                <SelectWithClear field={field} placeholder="Mostly in-character">
                  <SelectContent>
                    <SelectItem value="AlwaysIC">Always in-character</SelectItem>
                    <SelectItem value="MostlyIC">Mostly in-character</SelectItem>
                    <SelectItem value="ICButClarifySensitive">IC but clarify sensitive topics</SelectItem>
                    <SelectItem value="FreelyAcknowledgeAI">Freely acknowledge AI</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormDescription>If unsure, choose “IC but clarify sensitive.”</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transparency.alignment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Streamer alignment</FormLabel>
                <SelectWithClear field={field} placeholder="Back the streamer">
                  <SelectContent>
                    <SelectItem value="AlwaysBackStreamer">Always back streamer</SelectItem>
                    <SelectItem value="UsuallyBackButGentlyDisagree">Back streamer, gently disagree</SelectItem>
                    <SelectItem value="IndependentPlayful">Independent but playful</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transparency.when_unsure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>When unsure</FormLabel>
                <SelectWithClear field={field} placeholder="Default to honesty">
                  <SelectContent>
                    <SelectItem value="AdmitUncertainty">Admit uncertainty</SelectItem>
                    <SelectItem value="PlayfulDeflection">Playful deflection</SelectItem>
                    <SelectItem value="AskClarifying">Ask clarifying questions</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormDescription>If unsure, choose “Admit uncertainty”—kind &gt; clever.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="influences" className="rounded-lg border bg-background px-4">
        <AccordionTrigger>Influences</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormField
            control={form.control}
            name="influences.emulate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voices to emulate</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Max 3. One per line."
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) => field.onChange(event.target.value.split("\n").map((v) => v.trim()).filter(Boolean).slice(0, 3))}
                  />
                </FormControl>
                <FormDescription>Pick cozy inspiration; we&apos;ll nod to them lightly.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="influences.avoid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avoid sounding like</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Max 2. One per line."
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) => field.onChange(event.target.value.split("\n").map((v) => v.trim()).filter(Boolean).slice(0, 2))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="calibration" className="rounded-lg border bg-background px-4">
        <AccordionTrigger>Calibration Snippets</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormField
            control={form.control}
            name="calibration.good_examples"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Good examples</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add up to 4 sample lines, one per line."
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) => field.onChange(event.target.value.split("\n").map((v) => v.trim()).filter(Boolean).slice(0, 4))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="calibration.bad_examples"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anti-examples</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add up to 2 lines you'd never want repeated."
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) => field.onChange(event.target.value.split("\n").map((v) => v.trim()).filter(Boolean).slice(0, 2))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="style" className="rounded-lg border bg-background px-4">
        <AccordionTrigger>Style & Formatting</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormField
            control={form.control}
            name="style.locale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Locale</FormLabel>
                <SelectWithClear field={field} placeholder="US">
                  <SelectContent>
                    <SelectItem value="US">US</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="AU">AU</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="style.casing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casing flair</FormLabel>
                <SelectWithClear field={field} placeholder="normal">
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="lowercase">lowercase breezy</SelectItem>
                    <SelectItem value="occasionalAllCaps">occasional ALL CAPS</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="style.asterisk_actions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asterisk actions</FormLabel>
                <SelectWithClear field={field} placeholder="Allow">
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="avoid">Avoid</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style.laugh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Laugh signature</FormLabel>
                <FormControl>
                  <Input placeholder="heh? kekw? snrk?" value={field.value ?? ""} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="style.emotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emotes</FormLabel>
                <SelectWithClear field={field} placeholder="Twitch">
                  <SelectContent>
                    <SelectItem value="Twitch">Twitch</SelectItem>
                    <SelectItem value="Unicode">Unicode</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                    <SelectItem value="Minimal">Minimal</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="style.onomatopoeia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Onomatopoeia</FormLabel>
                <SelectWithClear field={field} placeholder="allow">
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                    <SelectItem value="avoid">Avoid</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="style.kaomoji"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaomoji</FormLabel>
                <SelectWithClear field={field} placeholder="none">
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="mood" className="rounded-lg border bg-background px-4">
        <AccordionTrigger>Mood & Reactions</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormField
            control={form.control}
            name="mood.default_mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default moods</FormLabel>
                <FormControl>
                  <Input
                    placeholder="sunny, cheeky (comma separated, up to 2)"
                    value={field.value?.join(", ") ?? ""}
                    onChange={(event) => {
                      const list = event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                        .slice(0, 2);
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
            name="mood.range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mood range</FormLabel>
                <SelectWithClear field={field} placeholder="moderate">
                  <SelectContent>
                    <SelectItem value="narrow">Narrow</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="wide">Wide</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mood.reaction_style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surprise reaction style</FormLabel>
                <FormControl>
                  <Textarea placeholder="How do they handle unexpected moments?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="mood.when_praised"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>When praised</FormLabel>
                  <SelectWithClear field={field} placeholder="bashful">
                    <SelectContent>
                      <SelectItem value="bashful">Bashful</SelectItem>
                      <SelectItem value="confident">Confident</SelectItem>
                      <SelectItem value="self_deprecating">Self-deprecating</SelectItem>
                      <SelectItem value="playful_deflect">Playful deflect</SelectItem>
                      <SelectItem value="sincere">Sincere</SelectItem>
                    </SelectContent>
                  </SelectWithClear>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mood.when_criticized"
            render={({ field }) => (
              <FormItem>
                <FormLabel>When criticized</FormLabel>
                <SelectWithClear field={field} placeholder="bashful">
                  <SelectContent>
                    <SelectItem value="bashful">Bashful</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                    <SelectItem value="self_deprecating">Self-deprecating</SelectItem>
                    <SelectItem value="playful_deflect">Playful deflect</SelectItem>
                    <SelectItem value="sincere">Sincere</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="preferences" className="rounded-lg border bg-background px-4">
        <AccordionTrigger>Preferences & Metaphors</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormField
            control={form.control}
            name="preferences.favorites"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Favorites</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Foods, games, colors. One per line."
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) => field.onChange(event.target.value.split("\n").map((v) => v.trim()).filter(Boolean))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferences.yucks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yucks</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Lines to avoid or topics that feel icky."
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) => field.onChange(event.target.value.split("\n").map((v) => v.trim()).filter(Boolean))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferences.metaphors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metaphor vibes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Spacey? Food? Cozy cottage?"
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) => field.onChange(event.target.value.split("\n").map((v) => v.trim()).filter(Boolean))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="refusals" className="rounded-lg border bg-background px-4">
        <AccordionTrigger>Refusal Toolkit</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormField
            control={form.control}
            name="refusals.style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Refusal style</FormLabel>
                <SelectWithClear field={field} placeholder="warm_apologetic">
                  <SelectContent>
                    <SelectItem value="warm_apologetic">Warm & apologetic</SelectItem>
                    <SelectItem value="playful_deflect">Playful deflect</SelectItem>
                    <SelectItem value="firm_brief">Firm & brief</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="refusals.stock_lines"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Stock lines</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Up to 3. One per line."
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) =>
                      field.onChange(event.target.value.split("\n").map((v) => v.trim()).filter(Boolean).slice(0, 3))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="refusals.redirects"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Redirect ideas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Up to 5 playful pivots."
                    value={field.value?.join("\n") ?? ""}
                    onChange={(event) =>
                      field.onChange(event.target.value.split("\n").map((v) => v.trim()).filter(Boolean).slice(0, 5))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="chattiness" className="rounded-lg border bg-background px-4">
        <AccordionTrigger>Chattiness & Structure</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormField
            control={form.control}
            name="chattiness.brevity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brevity (1-10)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chattiness.exclamations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exclamations</FormLabel>
                <SelectWithClear field={field} placeholder="moderate">
                  <SelectContent>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="lots">Lots</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chattiness.paragraph_style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paragraph style</FormLabel>
                <SelectWithClear field={field} placeholder="short bursts">
                  <SelectContent>
                    <SelectItem value="one_liners">One-liners</SelectItem>
                    <SelectItem value="short_bursts">Short bursts</SelectItem>
                    <SelectItem value="occasional_chunky">Occasional chunky</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="improv" className="rounded-lg border bg-background px-4">
        <AccordionTrigger>Improv & Corrections</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormField
            control={form.control}
            name="improv.mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Improv mode</FormLabel>
                <SelectWithClear field={field} placeholder="light">
                  <SelectContent>
                    <SelectItem value="strict">Strict</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="improv.labeling"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label improv?</FormLabel>
                <SelectWithClear field={field} placeholder="subtle">
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="subtle">Subtle</SelectItem>
                    <SelectItem value="explicit">Explicit</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="improv.when_corrected"
            render={({ field }) => (
              <FormItem>
                <FormLabel>When corrected</FormLabel>
                <SelectWithClear field={field} placeholder="drop & thank">
                  <SelectContent>
                    <SelectItem value="drop_thank">Drop & thank</SelectItem>
                    <SelectItem value="concede_playfully">Concede playfully</SelectItem>
                    <SelectItem value="hold_until_streamer_says_stop">Hold until streamer says stop</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="adaptability" className="rounded-lg border bg-background px-4">
        <AccordionTrigger>Adaptability</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormField
            control={form.control}
            name="adaptability.level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <SelectWithClear field={field} placeholder="dynamic">
                  <SelectContent>
                    <SelectItem value="rigid">Rigid</SelectItem>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="dynamic">Dynamic</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adaptability.tone_authority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tone authority</FormLabel>
                <SelectWithClear field={field} placeholder="Equal footing">
                  <SelectContent>
                    <SelectItem value="StreamerGTChat">Streamer &gt; Chat</SelectItem>
                    <SelectItem value="Equal">Equal</SelectItem>
                    <SelectItem value="AlwaysStreamer">Always streamer</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adaptability.allowed_shifts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allowed shifts</FormLabel>
                <SelectWithClear field={field} placeholder="energy only">
                  <SelectContent>
                    <SelectItem value="energy_only">Energy only</SelectItem>
                    <SelectItem value="energy_humor">Energy + humor</SelectItem>
                    <SelectItem value="full_mood_limits">Full mood limits</SelectItem>
                  </SelectContent>
                </SelectWithClear>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export default AdvancedSections;
