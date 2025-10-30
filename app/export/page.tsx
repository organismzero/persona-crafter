import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ExportPageClient = dynamic(() => import("@/components/ExportPageClient"), { ssr: false });

export const metadata: Metadata = {
  title: "Export Persona Bundle",
};

const ExportPage = () => <ExportPageClient />;

export default ExportPage;
