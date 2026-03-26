import type { ReactNode } from "react";
import Link from "next/link";

import { LogoutForm } from "@/components/auth/logout-form";
import { getButtonClasses } from "@/components/ui/button";

type AppShellProps = {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  activeSection?: "leads" | "candidates";
  children: ReactNode;
};

export function AppShell({
  title,
  description,
  ctaLabel,
  ctaHref,
  activeSection = "leads",
  children,
}: AppShellProps) {
  return (
    <main className="min-h-screen w-full px-3 py-3 sm:px-4 sm:py-4 lg:px-4 lg:py-4 xl:px-5 xl:py-5">
      <div className="flex w-full flex-col gap-3 lg:min-w-[1280px] lg:flex-row lg:items-start lg:gap-4">
        <div className="lg:w-[256px] lg:shrink-0">
          <aside className="rounded-[28px] border border-white/60 bg-white/88 p-3 shadow-xl shadow-slate-200/60 backdrop-blur lg:fixed lg:left-4 lg:top-4 lg:bottom-4 lg:z-10 lg:flex lg:w-[256px] lg:flex-col lg:px-4 lg:py-5 xl:left-5 xl:top-5 xl:bottom-5">
            <div className="space-y-6">
              <div className="rounded-[20px] border border-slate-200/80 bg-slate-50/85 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-700">
                  My BPM Mini
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  Single Operator Workspace
                </p>
              </div>

              <nav aria-label="Primary" className="space-y-2">
                <Link
                  aria-current={activeSection === "leads" ? "page" : undefined}
                  className={getButtonClasses(
                    activeSection === "leads" ? "default" : "ghost",
                    "w-full justify-start rounded-xl px-3.5 py-2.5 text-[11px] uppercase tracking-[0.18em]",
                  )}
                  href="/leads"
                >
                  Leads
                </Link>
                <Link
                  aria-current={activeSection === "candidates" ? "page" : undefined}
                  className={getButtonClasses(
                    activeSection === "candidates" ? "default" : "ghost",
                    "w-full justify-start rounded-xl px-3.5 py-2.5 text-[11px] uppercase tracking-[0.18em]",
                  )}
                  href="/candidates"
                >
                  Candidates
                </Link>
              </nav>
            </div>

            <div className="mt-4 border-t border-slate-200/80 pt-3 lg:mt-auto">
              <LogoutForm buttonClassName="w-full justify-start rounded-xl" />
            </div>
          </aside>
        </div>

        <div className="w-full lg:min-w-[980px] lg:flex-1">
          <div className="space-y-4 lg:min-w-[980px] lg:pr-1">
            <header className="flex flex-col gap-3 rounded-[24px] border border-white/60 bg-white/85 px-5 py-4 shadow-xl shadow-slate-200/60 backdrop-blur sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-950 lg:text-[28px]">{title}</h1>
                {description ? (
                  <p className="mt-1.5 max-w-3xl text-[13px] leading-5 text-slate-600">
                    {description}
                  </p>
                ) : null}
              </div>

              {ctaHref && ctaLabel ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Link className={getButtonClasses("default")} href={ctaHref}>
                    {ctaLabel}
                  </Link>
                </div>
              ) : null}
            </header>

            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
