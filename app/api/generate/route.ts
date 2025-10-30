import { NextResponse } from "next/server";
import { PersonaConfig as personaSchema } from "@/schema/persona";
import type { PersonaConfig } from "@/schema/persona";
import { buildSystemPrompt } from "@/lib/promptBuilder";

type GeneratePayload = {
  config: PersonaConfig;
  includeFewShots?: boolean;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  let payload: GeneratePayload;
  try {
    payload = (await request.json()) as GeneratePayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = personaSchema.safeParse(payload.config);
  if (!parsed.success) {
    return NextResponse.json({ message: "Persona config failed validation." }, { status: 422 });
  }

  const deterministic = buildSystemPrompt(parsed.data, {
    includeFewShots: payload.includeFewShots,
  });

  if (!apiKey) {
    return NextResponse.json(
      {
        message: "OPENAI_API_KEY not configured. Falling back to deterministic prompt.",
        systemPrompt: deterministic,
      },
      { status: 400 },
    );
  }

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 2500,
        messages: [
          {
            role: "system",
            content:
              "You polish system prompts for streaming chatbots. Do not remove safety guardrails or personalization placeholders. Keep markdown structure intact and ensure length stays above 1,400 words.",
          },
          {
            role: "user",
            content: `Polish this prompt while keeping all rules, sections, and safety statements untouched:\n\n${deterministic}`,
          },
        ],
      }),
    });

    if (!completion.ok) {
      throw new Error("OpenAI request failed");
    }

    const data = (await completion.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const polished = data?.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({
      systemPrompt: polished?.length ? polished : deterministic,
    });
  } catch (error) {
    console.error("OpenAI generate error", error);
    return NextResponse.json(
      {
        message: "OpenAI enhancement failed. Using deterministic output.",
        systemPrompt: deterministic,
      },
      { status: 502 },
    );
  }
}
