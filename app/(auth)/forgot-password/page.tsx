"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordResetAction } from "@/lib/actions/auth";
import { FormSubmit } from "@/components/ui/form-submit";
import { Input } from "@/components/ui/input";

const initialState = { ok: false, message: "", resetUrl: "" };

export default function ForgotPasswordPage() {
  const [state, action] = useActionState(requestPasswordResetAction, initialState);

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-muted">Password reset</p>
      <h1 className="mt-3 text-4xl font-semibold">Get back in quickly.</h1>
      <p className="mt-3 text-sm text-muted">
        In local mode, the reset link is shown instantly so the full flow works without email setup.
      </p>

      <form action={action} className="mt-8 space-y-4">
        <Input name="email" type="email" placeholder="Email address" required />
        <p className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>{state.message}</p>
        <FormSubmit pendingLabel="Creating reset link...">Create reset link</FormSubmit>
      </form>

      {state.resetUrl ? (
        <div className="mt-5 rounded-[1.5rem] border border-border bg-surface-soft p-4 text-sm">
          <p className="font-semibold">Local reset link</p>
          <Link href={state.resetUrl} className="mt-2 inline-block break-all font-semibold text-accent">
            {state.resetUrl}
          </Link>
        </div>
      ) : null}

      <p className="mt-5 text-sm text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-accent">
          Log in
        </Link>
      </p>
    </div>
  );
}
