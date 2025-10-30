import { useCallback } from "react";
import { Download, Copy } from "lucide-react";
import type { PersonaConfig } from "@/schema/persona";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

type ExportTabsProps = {
  systemPrompt: string;
  persona: PersonaConfig;
  cheatsheet: string;
};

const downloadFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const ExportTabs = ({ systemPrompt, persona, cheatsheet }: ExportTabsProps) => {
  const { toast } = useToast();

  const copyText = useCallback(
    async (text: string, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast({
          title: `Copied ${label}!`,
          description: "Paste it into your favorite prompt runner or notes app.",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Copy failed",
          description: "Clipboard permissions denied. Try manual select + copy.",
        });
      }
    },
    [toast],
  );

  const personaJson = JSON.stringify(persona, null, 2);

  return (
    <Tabs defaultValue="system" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="system">System Prompt</TabsTrigger>
        <TabsTrigger value="json">JSON Config</TabsTrigger>
        <TabsTrigger value="cheatsheet">Cheatsheet</TabsTrigger>
      </TabsList>
      <TabsContent value="system">
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button size="sm" variant="outline" className="gap-1" onClick={() => copyText(systemPrompt, "system prompt")}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button size="sm" className="gap-1" onClick={() => downloadFile("persona-prompt.md", systemPrompt)}>
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
            <pre className="max-h-[60vh] overflow-y-auto rounded-md border bg-muted/50 p-4 text-xs leading-relaxed">
              {systemPrompt}
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="json">
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button size="sm" variant="outline" className="gap-1" onClick={() => copyText(personaJson, "JSON config")}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button size="sm" className="gap-1" onClick={() => downloadFile("persona.json", personaJson)}>
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
            <pre className="max-h-[60vh] overflow-y-auto rounded-md border bg-muted/50 p-4 text-xs leading-relaxed">
              {personaJson}
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="cheatsheet">
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button size="sm" variant="outline" className="gap-1" onClick={() => copyText(cheatsheet, "cheatsheet")}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
              <Button size="sm" className="gap-1" onClick={() => downloadFile("cheatsheet.md", cheatsheet)}>
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
            <pre className="max-h-[60vh] overflow-y-auto rounded-md border bg-muted/50 p-4 text-xs leading-relaxed">
              {cheatsheet}
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ExportTabs;
