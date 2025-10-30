import { useMemo, useState } from "react";
import { Wand2 } from "lucide-react";
import type { PersonaConfig } from "@/schema/persona";
import { buildPreviewReplies } from "@/lib/previewBuilder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type LivePreviewProps = {
  config: PersonaConfig;
  enhanceAvailable: boolean;
  enhanceEnabled: boolean;
  onToggleEnhance: (enabled: boolean) => void;
  enhancedDrafts?: string[];
  isEnhancing?: boolean;
};

const PREVIEW_IDS = [
  { id: "first-time", label: "First-time chatter" },
  { id: "lull", label: "Fill the lull" },
  { id: "roast", label: "Gentle roast" },
] as const;

const LivePreview = ({
  config,
  enhanceAvailable,
  enhanceEnabled,
  onToggleEnhance,
  enhancedDrafts,
  isEnhancing,
}: LivePreviewProps) => {
  const [activeTab, setActiveTab] = useState<(typeof PREVIEW_IDS)[number]["id"]>("first-time");

  const deterministicDrafts = useMemo(() => buildPreviewReplies(config), [config]);
  const drafts = enhanceEnabled && enhancedDrafts?.length ? enhancedDrafts : deterministicDrafts;

  const helper = {
    first: drafts[0] ?? deterministicDrafts[0],
    lull: drafts[1] ?? deterministicDrafts[1],
    roast: drafts[2] ?? deterministicDrafts[2],
  };

  return (
    <Card className="sticky top-24 flex h-fit flex-col gap-4 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          Live Preview
          {enhanceAvailable ? (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Switch
                aria-label="Toggle enhanced preview"
                checked={enhanceEnabled}
                onCheckedChange={onToggleEnhance}
                disabled={isEnhancing}
              />
              <span className="flex items-center gap-1">
                <Wand2 className="h-4 w-4" />
                Enhance
              </span>
            </span>
          ) : (
            <Badge variant="secondary">Deterministic</Badge>
          )}
        </CardTitle>
        <CardDescription>
          These drafts mimic how the persona will greet folks, keep energy flowing, and handle playful roasts.
        </CardDescription>
        <div className="flex flex-wrap gap-2 pt-2 text-xs text-muted-foreground">
          <Badge variant="outline">Rating: {config.rating}</Badge>
          <Badge variant="outline">Flirtiness: {config.flirtiness}</Badge>
          <Badge variant="outline">Roasting: {config.roasting}</Badge>
          <Badge variant="outline">Energy: {config.voice.energy}/10</Badge>
          <Badge variant="outline">Formality: {config.voice.formality}/10</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            {PREVIEW_IDS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs sm:text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="first-time" className="rounded-md border bg-muted/40 p-4 text-sm leading-relaxed">
            {helper.first}
          </TabsContent>
          <TabsContent value="lull" className="rounded-md border bg-muted/40 p-4 text-sm leading-relaxed">
            {helper.lull}
          </TabsContent>
          <TabsContent value="roast" className="rounded-md border bg-muted/40 p-4 text-sm leading-relaxed">
            {helper.roast}
          </TabsContent>
        </Tabs>
        <Separator />
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>
            Preview tips: energy affects punctuation, formality tweaks contractions, emoji density controls sparkle, and roasting
            rules guard the tone.
          </p>
          {enhanceAvailable ? (
            <p>
              Enhanced previews call OpenAI with your config to polish the copy. Toggle when you want a second opinion without
              changing your defaults.
            </p>
          ) : (
            <p>The deterministic preview runs entirely in your browser. No API key required.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePreview;
