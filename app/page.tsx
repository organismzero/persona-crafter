"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Play } from "lucide-react";
import QuickStart from "@/components/form/QuickStart";
import AdvancedSections from "@/components/form/AdvancedSections";
import LivePreview from "@/components/LivePreview";
import ConsistencyHints from "@/components/ConsistencyHints";
import ImportExportBar from "@/components/ImportExportBar";
import SettingsPanel from "@/components/SettingsPanel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { evaluateConsistency, type ConsistencyIssue, type ConsistencyResolution } from "@/lib/consistency";
import { clearPersonaConfig, loadPersonaConfig, saveArtifacts, savePersonaConfig } from "@/lib/storage";
import { buildSystemPrompt } from "@/lib/promptBuilder";
import { buildCheatsheet } from "@/lib/cheatsheetBuilder";
import { PersonaConfig, defaultPersonaConfig } from "@/schema/persona";
import { useToast } from "@/components/ui/use-toast";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { SESSION_TOKEN_KEY } from "@/lib/token";

const hasOpenAIToggle = process.env.NEXT_PUBLIC_HAS_OPENAI === "true";

const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [lastSavedAt, setLastSavedAt] = useState<string>();
  const [issues, setIssues] = useState<ConsistencyIssue[]>([]);
  const [enhanceEnabled, setEnhanceEnabled] = useState(false);
  const [enhancedDrafts, setEnhancedDrafts] = useState<string[]>();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionToken, setSessionToken] = useSessionStorage<string>({
    key: SESSION_TOKEN_KEY,
    defaultValue: "",
  });

  const form = useForm<PersonaConfig>({
    resolver: zodResolver(PersonaConfig),
    defaultValues: defaultPersonaConfig,
    mode: "onChange",
  });

  useEffect(() => {
    const stored = loadPersonaConfig();
    form.reset(stored);
    setIssues(evaluateConsistency(stored));
  }, [form]);

  const debouncedPersist = useMemo(
    () =>
      debounce((value: PersonaConfig) => {
        savePersonaConfig(value);
        setLastSavedAt(new Date().toLocaleTimeString());
        setIssues(evaluateConsistency(value));
      }, 350),
    [],
  );

  useEffect(() => {
    const subscription = form.watch((value) => {
      const parsed = PersonaConfig.safeParse(value);
      if (parsed.success) {
        debouncedPersist(parsed.data);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedPersist]);

  const handleApplyResolution = useCallback(
    (resolution: ConsistencyResolution) => {
      const current = PersonaConfig.parse(form.getValues());
      const next = resolution.mutate(current);
      form.reset(next, { keepDirty: true });
      toast({
        title: "Adjusted for harmony",
        description: "Tweaked the config to keep your persona consistent.",
      });
    },
    [form, toast],
  );

  const handleImport = useCallback(
    (incoming: PersonaConfig) => {
      const parsed = PersonaConfig.parse(incoming);
      form.reset(parsed);
      savePersonaConfig(parsed);
      setIssues(evaluateConsistency(parsed));
    },
    [form],
  );

  const handleExport = useCallback(() => {
    const parsed = PersonaConfig.parse(form.getValues());
    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "persona-config.json";
    link.click();
    URL.revokeObjectURL(url);
  }, [form]);

  const handleReset = useCallback(() => {
    form.reset(defaultPersonaConfig);
    clearPersonaConfig();
    setIssues(evaluateConsistency(defaultPersonaConfig));
    setLastSavedAt(undefined);
  }, [form]);

  const enhancePreviews = useCallback(async () => {
    const snapshot = form.getValues();
    const parsed = PersonaConfig.safeParse(snapshot);
    if (!parsed.success) {
      toast({
        title: "Finish Quick Start first",
        description: "We need a valid persona before asking the model to riff.",
      });
      setEnhanceEnabled(false);
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: parsed.data,
          clientToken: sessionToken || undefined,
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to enhance");
      }
      const data = (await response.json()) as { previews: string[] };
      setEnhancedDrafts(data.previews);
    } catch (error) {
      console.warn(error);
      setEnhancedDrafts(undefined);
      toast({
        title: "Enhance unavailable",
        description: "Couldn’t reach the preview enhancer—sticking to the deterministic drafts.",
      });
      setEnhanceEnabled(false);
    } finally {
      setIsEnhancing(false);
    }
  }, [form, sessionToken, toast]);

  const onSubmit = useCallback(
    async (values: PersonaConfig) => {
      const parsed = PersonaConfig.parse(values);
      const includeFewShots = Boolean(parsed.calibration?.good_examples?.length);

      setIsGenerating(true);

      try {
        let systemPrompt = buildSystemPrompt(parsed, { includeFewShots });

        if (hasOpenAIToggle) {
          try {
            const response = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ config: parsed, includeFewShots }),
            });
            if (response.ok) {
              const data = (await response.json()) as { systemPrompt?: string };
              if (data.systemPrompt) {
                systemPrompt = data.systemPrompt;
              }
            }
          } catch (error) {
            console.warn("Generate fallback", error);
          }
        }

        const cheatsheet = buildCheatsheet(parsed);

        savePersonaConfig(parsed);
        saveArtifacts({
          systemPrompt,
          persona: parsed,
          cheatsheet,
          includeFewShots,
          createdAt: new Date().toISOString(),
        });
        toast({
          title: "Persona bundle ready!",
          description: "System prompt, JSON, and cheatsheet saved to localStorage.",
        });
        router.push("/export");
      } finally {
        setIsGenerating(false);
      }
    },
    [router, toast],
  );

  const watchedConfig = form.watch();

  const personaForPreview = useMemo(() => {
    const parsed = PersonaConfig.safeParse(watchedConfig);
    return parsed.success ? parsed.data : defaultPersonaConfig;
  }, [watchedConfig]);

  const previewSignature = useMemo(() => JSON.stringify(personaForPreview), [personaForPreview]);

  useEffect(() => {
    if (!enhanceEnabled) {
      setEnhancedDrafts(undefined);
      return;
    }
    void enhancePreviews();
  }, [enhanceEnabled, enhancePreviews, previewSignature]);

  const disableGenerate = !form.formState.isValid;
  const hasClientToken = Boolean(sessionToken);
  const canEnhance = hasOpenAIToggle || hasClientToken;

  useEffect(() => {
    if (!canEnhance && enhanceEnabled) {
      setEnhanceEnabled(false);
    }
  }, [canEnhance, enhanceEnabled]);

  return (
    <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 lg:flex-row lg:gap-10">
      <div className="pointer-events-none absolute inset-0 -z-10 blur-3xl">
        <div className="absolute left-10 top-0 h-64 w-64 rounded-full bg-primary/15" />
        <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-secondary/30" />
      </div>
      <div className="w-full rounded-3xl border border-white/60 bg-card/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl lg:w-7/12 lg:p-8">
        <header className="mb-8 space-y-5">
          <div className="flex flex-col gap-6 rounded-2xl border border-border/80 bg-gradient-to-br from-white via-white/95 to-secondary/40 p-6 shadow-lg shadow-primary/5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Cozy persona builder
              </div>
              <h1 className="text-3xl font-bold text-foreground">Persona Crafter</h1>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Shape your chatbot’s vibe in minutes. Start with the guided essentials, sprinkle in advanced lore and voice tweaks,
              and watch the live preview respond instantly.
            </p>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                <Link href="/about" className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline">
                  About
                </Link>
                <Link href="/export" className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline">
                  Latest export
                </Link>
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                <SettingsPanel token={sessionToken} onTokenChange={setSessionToken} />
                <ImportExportBar
                  onImport={handleImport}
                  onExport={handleExport}
                  onReset={handleReset}
                  lastSavedAt={lastSavedAt}
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Everything saves locally to your browser—no external storage, no drama. You can export or re-import your persona
            config anytime.
          </p>
        </header>
        <Form {...form}>
          <form className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
            <section aria-labelledby="quick-start-heading" className="space-y-10">
              <div>
                <h2 id="quick-start-heading" className="sr-only">
                  Quick Start
                </h2>
                <QuickStart form={form} />
              </div>
              <AdvancedSections form={form} />
            </section>
            <ConsistencyHints issues={issues} onApply={handleApplyResolution} />
            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6">
              <h3 className="text-lg font-semibold">Ready to Generate?</h3>
              <p className="text-sm text-muted-foreground">
                We’ll build a long-form system prompt, JSON config, and printable cheatsheet. You can tweak them all before sharing.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button type="submit" size="lg" disabled={disableGenerate || isGenerating} className="gap-2">
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {isGenerating ? "Working..." : "Generate persona bundle"}
                </Button>
                {disableGenerate ? (
                  <p className="text-xs text-red-500">Finish the required fields in Quick Start to continue.</p>
                ) : (
                  <p className="text-xs text-muted-foreground">You’re good to go! Tap Generate anytime.</p>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div className="w-full lg:w-5/12">
        <div className="sticky top-20 flex flex-col gap-6">
          <div className="rounded-3xl border border-white/60 bg-card/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-foreground">Live Persona Preview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try different combinations and see how your bot would greet newcomers, fill dead air, or deliver a roast before
              committing to an export.
            </p>
          </div>
          <LivePreview
            config={personaForPreview}
            enhanceAvailable={canEnhance}
            enhanceEnabled={enhanceEnabled}
            onToggleEnhance={(checked) => {
              if (!canEnhance) {
                toast({
                  title: "Add an OpenAI token",
                  description: "Use the Settings button to provide a token for Enhance Preview.",
                });
                return;
              }
              setEnhanceEnabled(checked);
            }}
            enhancedDrafts={enhancedDrafts}
            isEnhancing={isEnhancing}
            hasClientToken={hasClientToken}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;
