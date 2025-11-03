import type { MetadataRoute } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const manifest = (): MetadataRoute.Manifest => ({
  name: "Persona Crafter",
  short_name: "Persona Crafter",
  description: "Build a cozy chatbot persona with live previews and exportable assets.",
  start_url: `${basePath || "."}/`,
  display: "standalone",
  lang: "en",
  background_color: "#0f172a",
  theme_color: "#2563eb",
  icons: [
    {
      src: `${basePath}/icon.svg`,
      sizes: "any",
      type: "image/svg+xml",
    },
  ],
});

export default manifest;
