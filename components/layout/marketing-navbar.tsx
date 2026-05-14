import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

export function MarketingNavbar() {
  return (
    <header className="page-shell sticky top-4 z-40">
      <div className="glass-panel flex items-center justify-between rounded-[1.75rem] px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-semibold text-muted lg:flex">
          <a href="#features" className="transition hover:text-foreground">
            Features
          </a>
          <a href="#pricing" className="transition hover:text-foreground">
            Pricing
          </a>
          <a href="#stories" className="transition hover:text-foreground">
            Success
          </a>
          <a href="#faq" className="transition hover:text-foreground">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-muted transition hover:text-foreground">
            Log in
          </Link>
          <Link href="/signup">
            <Button>Start free</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
