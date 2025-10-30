import { NextResponse } from "next/server";
import { buildPreviewReplies } from "@/lib/previewBuilder";
import { PersonaConfig as personaSchema } from "@/schema/persona";
import type { PersonaConfig } from "@/schema/persona";

type PreviewPayload = {
  config: PersonaConfig;
  clientToken?: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: PreviewPayload;
  try {
    payload = (await request.json()) as PreviewPayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = personaSchema.safeParse(payload.config);
  if (!parsed.success) {
    return NextResponse.json({ message: "Persona config failed validation." }, { status: 422 });
  }

  const baseline = buildPreviewReplies(parsed.data);

  const envToken = process.env.OPENAI_API_KEY?.trim();
  const clientToken = payload.clientToken?.trim();
  const activeToken = envToken || (clientToken ? clientToken : undefined);

  if (!activeToken) {
    return NextResponse.json(
      {
        message: "No OpenAI API key available. Add a client token in Settings to unlock Enhance Preview.",
        previews: baseline,
      },
      { status: 400 },
    );
  }

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeToken}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 800,
        messages: [
          {
            role: "system",
            content:
              "You craft short sample chat replies for a streamer co-host. Use the provided persona summary. Keep safety guardrails intact.",
          },
          {
            role: "user",
            content: [
              "Persona config JSON:",
              JSON.stringify(parsed.data, null, 2),
              "",
              "Create three distinct replies for:",
              "1. First-time chatter says hi.",
              "2. There's a lull; fill 1 line.",
              "3. Viewer asks for a gentle roast.",
              "",
              "Respond with minified JSON only (no markdown, no code fences) in the shape:",
              '{"previews":["reply for scenario 1","reply for scenario 2","reply for scenario 3"]}',
              "Each reply must be a string under 320 characters that reflects the persona voice and safety guardrails. Do not include numbering or scenario labels inside the strings.",
            ].join("\n"),
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
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("No content");
    }

    let enhanced = baseline;
    try {
      const parsedContent = JSON.parse(content) as { previews?: unknown };
      if (Array.isArray(parsedContent.previews)) {
        const cleaned = parsedContent.previews
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter((item): item is string => Boolean(item));
        if (cleaned.length) {
          enhanced = cleaned.slice(0, 3);
        }
      }
    } catch (jsonError) {
      console.warn("Preview enhance JSON parse failed", jsonError);
    }

    const previews = [...enhanced];
    while (previews.length < 3) {
      previews.push(baseline[previews.length]);
    }

    return NextResponse.json({ previews });
  } catch (error) {
    console.error("OpenAI preview error", error);
    return NextResponse.json(
      {
        message: "OpenAI enhancement failed. Using deterministic previews.",
        previews: baseline,
      },
      { status: 502 },
    );
  }
}
