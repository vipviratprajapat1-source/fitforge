import Link from "next/link";

import { Logo } from "@/components/layout/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="page-shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-4 max-w-md text-sm text-muted">
            Premium fitness momentum for workouts, nutrition, recovery, and community.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm font-semibold text-muted">
          <Link href="/login" className="transition hover:text-foreground">
            Login
          </Link>
          <Link href="/signup" className="transition hover:text-foreground">
            Get started
          </Link>
          <a href="#pricing" className="transition hover:text-foreground">
            Pricing
          </a>
          <a href="#faq" className="transition hover:text-foreground">
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}
