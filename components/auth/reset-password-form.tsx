"use client";

import Link from "next/link";
import { useActionState } from "react";

import { resetPasswordAction } from "@/lib/actions/auth";
import { FormSubmit } from "@/components/ui/form-submit";
import { Input } from "@/components/ui/input";

const initialState = { ok: false, message: "" };

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPasswordAction, initialState);

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-muted">Choose a new password</p>
      <h1 className="mt-3 text-4xl font-semibold">Reset and re-enter strong.</h1>
      <form action={action} className="mt-8 space-y-4">
        <input type="hidden" name="token" value={token} />
        <Input name="password" type="password" placeholder="New password" required />
        <p className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>{state.message}</p>
        <FormSubmit pendingLabel="Updating password...">Update password</FormSubmit>
      </form>
      <p className="mt-5 text-sm text-muted">
        Back to{" "}
        <Link href="/login" className="font-semibold text-accent">
          login
        </Link>
      </p>
    </div>
  );
}
