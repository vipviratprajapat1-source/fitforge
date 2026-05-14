"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_CREDENTIALS } from "@/lib/constants";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Wrong email or password. Use the demo account or create a new one.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-muted">Welcome back</p>
      <h1 className="mt-3 text-4xl font-semibold">Log in to your rhythm.</h1>
      <p className="mt-3 text-sm text-muted">
        Demo access: <span className="font-semibold text-foreground">{DEMO_CREDENTIALS.email}</span> /{" "}
        <span className="font-semibold text-foreground">{DEMO_CREDENTIALS.password}</span>
      </p>

      <form action={handleSubmit} className="mt-8 space-y-4">
        <Input name="email" type="email" placeholder="Email address" defaultValue={DEMO_CREDENTIALS.email} required />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          defaultValue={DEMO_CREDENTIALS.password}
          required
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="font-semibold text-accent">
          Forgot password
        </Link>
        <Link href="/signup" className="font-semibold text-muted hover:text-foreground">
          Create account
        </Link>
      </div>
    </div>
  );
}
