import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center py-20">
      <Card className="max-w-2xl text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-muted">404</p>
        <h1 className="mt-4 text-5xl font-semibold">That route is off-program.</h1>
        <p className="mt-4 text-base text-muted">
          The page you were looking for is missing, but your momentum does not have to be.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">Back to landing page</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
