import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  a: ({ href = "", ...props }) => {
    const isExternal = href.startsWith("http");

    if (isExternal) {
      return (
        <a
          href={href}
          rel="noopener noreferrer"
          target="_blank"
          {...props}
          className="font-medium text-cyan-300 underline-offset-4 hover:underline light:text-cyan-700"
        />
      );
    }

    return (
      <Link
        href={href}
        {...props}
        className="font-medium text-cyan-300 underline-offset-4 hover:underline light:text-cyan-700"
      />
    );
  }
};
