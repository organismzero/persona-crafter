# Persona Crafter

Persona Crafter is a Next.js (App Router) application for shaping a streamer chatbot persona. It guides creators through a friendly personality questionnaire, previews responses on the fly, and generates three exportable artifacts (system prompt, JSON config, cheatsheet) ready for production use or further tweaking.

## Features

- **Quick Start wizard** and **advanced tuning**
  - Zod-backed validation via `schema/persona.ts`
  - Microcopy hints underneath each input
  - Personalization variables with safe defaults
- **Live preview**
  - Deterministic preview builder on the client
  - Optional OpenAI-enhanced rewrites when a session token is provided
- **Consistency checker**
  - Surface persona mismatches (rating vs flirtiness, deadpan vs exclamations, etc.)
  - One-click fixes that mutate form state safely
- **Generation workflow**
  - Deterministic prompt builder (`lib/promptBuilder.ts`) for ~1.5k-word markdown
  - Cheatsheet builder (`lib/cheatsheetBuilder.ts`) for printable reference
  - Optional OpenAI polish using the session token (falls back to deterministic output)
- **Export page**
  - Tabs for system prompt, JSON config, and cheatsheet
  - Copy/download actions for each artifact
  - Autosaved bundle stored in `localStorage`
- **Import/Export controls**
  - JSON round-trip of the entire persona state (`persona_config_v1`)
  - Debounced persistence to local storage
- **Session settings panel**
  - Add/remove a client-side OpenAI API token (stored in `sessionStorage`)
  - Unlocks Enhance Preview even when no server token is configured
- **Static-export ready**
  - `next.config.mjs` leverages `output: "export"`
  - Tailwind CSS v4 via `@tailwindcss/postcss`
  - Favicon supplied by `app/icon.tsx`

## Tech Stack

- **Framework**: Next.js 16 with the App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Tailwind Animate, Next font pipeline
- **UI primitives**: shadcn/ui (Radix UI under the hood)
- **State & forms**: `react-hook-form` + Zod validation
- **Persistence**: Browser `localStorage` (no external database)
- **Optional AI polish**: Client-side OpenAI REST calls powered by a user-supplied session token

## Getting Started

### Prerequisites

- Node.js 20+ (required by Tailwind CSS v4 tooling)
- npm 9+ or an equivalent package manager

### Installation

```bash
npm install
```

### Development server

```bash
npm run dev
```

Navigate to `http://localhost:3000`. Hot reloading is handled by Turbopack.

### Optional: add a client token

Open the **Settings** button in the questionnaire header (or browse to `/settings`) to provide a per-session OpenAI API key. The token lives in `sessionStorage` so it disappears when the tab closes.

### Type checking & linting

```bash
npm run type-check
npm run lint
```

### Build & Export

```bash
npm run build    # next build && next export
```

Static files will be emitted to `out/`, suitable for GitHub Pages or any static host.

### Sample artifacts

Generate example outputs (system prompt, config JSON, cheatsheet) using Quick Start defaults:

```bash
npm run generate:samples
```

Artifacts land in the `/samples` directory.

## Environment Variables

No environment variables are required for the static deployment. Enter an OpenAI API key in the in-app **Settings** panel to enable polish and enhanced previews—your key stays in `sessionStorage` for the current tab only.

## Project Structure

```
app/
  layout.tsx           # Root layout with Inter font + Toaster
  page.tsx             # Questionnaire wizard & live preview
  export/page.tsx      # Artifact export view (dynamic import client)
  about/page.tsx       # Project info & privacy note
  api/generate/        # Optional server route for OpenAI polish (unused on static deploy)
  api/preview/         # Optional server route for OpenAI preview (unused on static deploy)
  icon.tsx             # Static favicon via ImageResponse

components/
  form/QuickStart.tsx  # Quick start sections
  form/AdvancedSections.tsx
  LivePreview.tsx      # Deterministic preview + enhance toggle
  ConsistencyHints.tsx # Rules engine surface & quick fixes
  ExportTabs.tsx       # Tabs with copy/download/print actions
  ExportPageClient.tsx # Client component for export page
  .../ui/*             # shadcn/ui components

lib/
  promptBuilder.ts     # Deterministic markdown builder
  previewBuilder.ts    # Client preview generator
  cheatsheetBuilder.ts # One-pager markdown builder
  consistency.ts       # Rules engine for persona checks
  storage.ts           # Local storage helper utilities
  utils.ts             # Tailwind classname merge

schema/
  persona.ts           # Zod schema + defaults

scripts/
  generate-sample.js   # Node script for sample exports
```

## Accessibility & UX Notes

- All form controls have associated labels/aria attributes.
- Keyboard navigation is supported via Radix UI primitives.
- Microcopy provides quick hints without overwhelming the layout.
- Single-column form layout keeps long copy from overflowing on mobile/desktop.

## Deployment

1. Run `npm run build` locally or in CI.
2. Deploy the contents of `out/` to your static host (GitHub Pages, Netlify, Vercel static, etc.).
3. Ensure `NEXT_PUBLIC_BASE_PATH`/`assetPrefix` are set if deploying to a sub-path.

## License

This project inherits its license from the repository owner. Add appropriate licensing text here.
