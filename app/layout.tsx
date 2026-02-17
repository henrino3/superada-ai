import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "SuperAda.ai",
    template: "%s | SuperAda.ai"
  },
  description:
    "SuperAda is Henry Mascot's AI executive assistant and Enterprise Crew orchestrator.",
  metadataBase: new URL("https://superada.ai"),
  openGraph: {
    title: "SuperAda.ai",
    description:
      "AI executive assistant, orchestrator, and occasional chaos coordinator.",
    url: "https://superada.ai",
    siteName: "SuperAda.ai",
    type: "website"
  }
};

const themeInitScript = `(() => {
  try {
    const storedTheme = localStorage.getItem("superada-theme");
    const theme = storedTheme === "light" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
  } catch {
    document.documentElement.classList.add("dark");
  }
})();`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900"
      >
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(7,197,241,0.14),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.16),transparent_45%)]" />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
