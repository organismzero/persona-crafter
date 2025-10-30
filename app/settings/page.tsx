"use client";

import SettingsPanel from "@/components/SettingsPanel";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { SESSION_TOKEN_KEY } from "@/lib/token";

const SettingsPage = () => {
  const [token, setToken] = useSessionStorage<string>({ key: SESSION_TOKEN_KEY, defaultValue: "" });

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col justify-center gap-6 px-4 py-12">
      <div className="rounded-3xl border border-white/60 bg-card/95 p-8 text-center shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold text-foreground">Session Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the OpenAI API token used for client-side preview enhancements.
        </p>
        <div className="mt-6 flex justify-center">
          <SettingsPanel token={token} onTokenChange={setToken} />
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
