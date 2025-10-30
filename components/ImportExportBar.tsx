import { useRef } from "react";
import { Download, RefreshCw, Upload } from "lucide-react";
import type { PersonaConfig } from "@/schema/persona";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type ImportExportBarProps = {
  onImport: (config: PersonaConfig) => void;
  onExport: () => void;
  onReset: () => void;
  lastSavedAt?: string;
};

const ImportExportBar = ({ onImport, onExport, onReset, lastSavedAt }: ImportExportBarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const parsed = JSON.parse(content) as PersonaConfig;
      onImport(parsed);
      toast({
        title: "Config imported ✅",
        description: "Loaded persona settings from your file.",
      });
    } catch (error) {
      console.error("Failed to import config", error);
      toast({
        title: "Import failed",
        description: "The file doesn't look like a valid persona config. Try again?",
      });
    } finally {
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-white/60 px-3 py-2 text-right text-xs text-muted-foreground shadow-inner shadow-primary/5 sm:flex-row sm:items-center sm:justify-end">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />
      {lastSavedAt ? <span className="hidden sm:inline">Last autosave: {lastSavedAt}</span> : null}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          className="gap-1 rounded-full px-4"
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={onExport} className="gap-1 rounded-full px-4">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={onReset} className="gap-1 rounded-full px-4">
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ImportExportBar;
