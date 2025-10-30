import type { Metadata } from "next";
import ExportPageClient from "@/components/ExportPageClient";

export const metadata: Metadata = {
  title: "Export Persona Bundle",
};

const ExportPage = () => <ExportPageClient />;

export default ExportPage;
