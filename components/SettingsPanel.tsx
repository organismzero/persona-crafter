"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Settings2, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

type SettingsPanelProps = {
  token: string;
  onTokenChange: (token: string) => void;
};

const SettingsPanel = ({ token, onTokenChange }: SettingsPanelProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [draft, setDraft] = useState(token);

  useEffect(() => {
    setDraft(token);
  }, [token]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = draft.trim();
    onTokenChange(value);
    toast({
      title: "API token saved",
      description: value ? "Live preview will use your token this session." : "Removed saved token.",
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setDraft("");
    onTokenChange("");
    toast({ title: "Token cleared", description: "Enhance Preview will fall back to deterministic drafts." });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="relative gap-2 rounded-full px-4">
          <Settings2 className="h-4 w-4" aria-hidden="true" />
          Settings
          {token ? <span className="absolute -right-1 -top-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary shadow" /> : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl border border-border/70 bg-card/95 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:max-w-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Settings2 className="h-5 w-5 text-primary" />
              Session Settings
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Provide an OpenAI API token for client-side preview enhancements. Stored only in this browser tab.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="openai-token">
              OpenAI API token
            </label>
            <div className="relative">
              <Input
                id="openai-token"
                type={showToken ? "text" : "password"}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="sk-..."
                className="pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowToken((prev) => !prev)}
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">Toggle API token visibility</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Stored in <code>sessionStorage</code>. It’s cleared automatically when you close this tab.
            </p>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <Button type="button" variant="ghost" className="gap-1" onClick={handleClear}>
              <X className="h-4 w-4" />
              Clear token
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
