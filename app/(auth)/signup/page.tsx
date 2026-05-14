"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { signUpAction } from "@/lib/actions/auth";
import { FormSubmit } from "@/components/ui/form-submit";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const initialState = { ok: false, message: "" };

export default function SignupPage() {
  const router = useRouter();
  const [state, action] = useActionState(signUpAction, initialState);

  useEffect(() => {
    if (state.ok) {
      const timer = setTimeout(() => router.push("/login?created=1"), 1200);
      return () => clearTimeout(timer);
    }
  }, [router, state.ok]);

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-muted">Create account</p>
      <h1 className="mt-3 text-4xl font-semibold">Start your next streak properly.</h1>
      <p className="mt-3 text-sm text-muted">
        Your account is created locally and works immediately with the full app.
      </p>

      <form action={action} className="mt-8 space-y-4">
        <Input name="name" placeholder="Full name" required />
        <Input name="email" type="email" placeholder="Email address" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Select name="goal" defaultValue="RECOMPOSITION">
          <option value="FAT_LOSS">Fat loss</option>
          <option value="MUSCLE_GAIN">Muscle gain</option>
          <option value="RECOMPOSITION">Recomposition</option>
          <option value="ENDURANCE">Endurance</option>
          <option value="WELLNESS">Wellness</option>
        </Select>
        <p className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>{state.message}</p>
        <FormSubmit pendingLabel="Creating account...">Create account</FormSubmit>
      </form>

      <p className="mt-5 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent">
          Log in
        </Link>
      </p>
    </div>
  );
}
