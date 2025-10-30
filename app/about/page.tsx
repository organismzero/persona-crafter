import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About – Persona Crafter",
};

const AboutPage = () => (
  <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col gap-6 px-4 py-10">
    <section>
      <h1 className="text-3xl font-semibold">About Persona Crafter</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Persona Crafter helps streamers spin up a chatbot personality without touching docs or spreadsheets. The wizard keeps
        your answers local, validates safety guardrails, and produces a long-form system prompt, JSON config, and printable cheatsheet.
      </p>
    </section>
    <Separator />
    <Card>
      <CardHeader>
        <CardTitle>Privacy promise</CardTitle>
        <CardDescription>No external database, no telemetry, no surprise uploads.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>All persona data lives in your browser’s localStorage. You can export or wipe it any time.</p>
        <p>Any optional OpenAI calls run through server-side routes and only if you supply an API key via environment variable.</p>
        <p>We never transmit personal information by default. Stick to handles or placeholders unless you’re sure.</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Need a refresher?</CardTitle>
        <CardDescription>Hop back to the questionnaire or jump straight to exports.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          Return to wizard
        </Link>
        <Link href="/export" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          View latest exports
        </Link>
      </CardContent>
    </Card>
  </main>
);

export default AboutPage;
