"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ExportTabs from "@/components/ExportTabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadArtifacts, type GeneratedArtifacts } from "@/lib/storage";
import { PersonaConfig, defaultPersonaConfig } from "@/schema/persona";

const ExportPageClient = () => {
  const [artifacts, setArtifacts] = useState<GeneratedArtifacts | null>(() => loadArtifacts());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setArtifacts(loadArtifacts());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!artifacts) {
    return (
      <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col justify-center gap-4 px-4 py-10 text-center">
        <Card>
          <CardHeader>
            <CardTitle>No exports yet</CardTitle>
            <CardDescription>
              Generate the bundle from the questionnaire first—then you’ll see your prompt, JSON, and cheatsheet here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/">Back to wizard</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const persona = PersonaConfig.safeParse(artifacts.persona).success
    ? artifacts.persona
    : defaultPersonaConfig;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">Your Persona Bundle</h1>
        <p className="text-sm text-muted-foreground">
          Timestamp: {new Date(artifacts.createdAt).toLocaleString()} — Few-shot examples{" "}
          {artifacts.includeFewShots ? "included" : "not embedded"}.
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>Template: {persona.template}</span>
          <span>Rating: {persona.rating}</span>
          <span>Flirtiness: {persona.flirtiness}</span>
          <span>Roasting: {persona.roasting}</span>
        </div>
      </header>
      <ExportTabs systemPrompt={artifacts.systemPrompt} cheatsheet={artifacts.cheatsheet} persona={persona} />
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            - Keep the JSON as your single source of truth; you can re-import it to tweak the persona anytime.
            <br />
            - Paste the cheatsheet into a notion doc or print for quick reference during stream.
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default ExportPageClient;
