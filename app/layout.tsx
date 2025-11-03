import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/use-toast";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Persona Crafter",
  description: "Build a cozy chatbot persona with live previews and exportable assets.",
  manifest: `${basePath}/manifest.json`,
  icons: {
    icon: `${basePath}/icon.svg`,
    shortcut: `${basePath}/icon.svg`,
    apple: `${basePath}/icon.svg`,
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
      {children}
      <div id="modal-root" />
      <div id="toast-root" />
      <Toaster />
    </body>
  </html>
);

export default RootLayout;
