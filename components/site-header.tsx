"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/journey", label: "Journey" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-400/15 bg-slate-950/80 backdrop-blur-lg light:border-slate-200/80 light:bg-slate-50/90">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          className="group inline-flex items-center gap-2 text-base font-semibold tracking-tight"
          href="/"
        >
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-accent-cyan shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-glowPulse" />
          <span className="transition group-hover:text-cyan-300 light:group-hover:text-cyan-700">
            superada.ai
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Primary" className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  className={`rounded-full border px-3 py-2 text-xs font-medium tracking-wide transition sm:text-sm ${
                    isActive
                      ? "border-cyan-300/50 bg-cyan-400/10 text-cyan-200 light:border-cyan-500/40 light:bg-cyan-500/10 light:text-cyan-700"
                      : "border-transparent text-slate-300 hover:border-cyan-400/25 hover:text-cyan-200 light:text-slate-600 light:hover:border-slate-300 light:hover:text-slate-900"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
