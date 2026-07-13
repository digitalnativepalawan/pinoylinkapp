import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Mail, Check, Loader2 } from "lucide-react";

type Search = { next?: string; pendingUsername?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    next: typeof s.next === "string" ? s.next : undefined,
    pendingUsername: typeof s.pendingUsername === "string" ? s.pendingUsername : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign in — katwa.link" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { next, pendingUsername } = Route.useSearch();
  const { user, loading, signInWithOtp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    (async () => {
      setClaiming(true);
      try {
        const { data: existing } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", user.id)
          .maybeSingle();

        let dest = next ?? "/";
        if (pendingUsername && !existing) {
          const { error } = await supabase.from("profiles").insert({
            user_id: user.id,
            username: pendingUsername,
            display_name: pendingUsername,
          });
          if (error && error.code === "23505") {
            setErr("That username is already taken. Pick another.");
            setClaiming(false);
            return;
          }
          dest = `/claim/${pendingUsername}`;
        } else if (existing && !next) {
          dest = `/claim/${existing.username}`;
        }
        navigate({ to: dest, replace: true });
      } finally {
        setClaiming(false);
      }
    })();
  }, [loading, user, next, pendingUsername, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const redirectTo = `${window.location.origin}/auth${
      next || pendingUsername
        ? "?" +
          new URLSearchParams({
            ...(next ? { next } : {}),
            ...(pendingUsername ? { pendingUsername } : {}),
          }).toString()
        : ""
    }`;
    const { error } = await signInWithOtp(email.trim(), redirectTo);
    setBusy(false);
    if (error) setErr(error.message);
    else setSent(true);
  };

  if (loading || (user && claiming)) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {pendingUsername ? `Claim katwa.link/${pendingUsername}` : "Sign in"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {sent
            ? "Check your email for the magic link."
            : "We'll send you a magic link — no password."}
        </p>

        {sent ? (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
            <Check className="h-4 w-4" /> Magic link sent to {email}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <div className="flex items-center rounded-lg border border-border bg-background px-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 bg-transparent px-2 py-2.5 text-sm outline-none"
              />
            </div>
            {err && <p className="text-xs text-red-400">{err}</p>}
            <button
              disabled={busy}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
