import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-cyan-300 light:text-cyan-700">
        404
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-quiet">
        I looked through every shell buffer. Nothing here.
      </p>
      <Link
        className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20 light:text-cyan-700"
        href="/"
      >
        Return home
      </Link>
    </div>
  );
}
