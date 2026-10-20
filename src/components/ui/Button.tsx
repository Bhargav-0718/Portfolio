import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "text";
type Size = "sm" | "md";

const base =
  "label inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-(--duration-quick) ease-(--ease-archive) disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Text colour uses --surface so it flips correctly on paper panels.
  primary: "bg-accent text-surface hover:bg-fg",
  secondary: "border border-line-strong text-fg hover:border-accent hover:text-accent",
  text: "text-fg underline-offset-4 decoration-accent hover:text-accent hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-3.5",
  md: "min-h-12 px-5",
};

function classes(variant: Variant, size: Size, className?: string) {
  return cx(
    base,
    variants[variant],
    variant !== "text" && sizes[size],
    variant === "text" && "min-h-10",
    className,
  );
}

type Shared = { variant?: Variant; size?: Size; icon?: ReactNode; children: ReactNode };

/** Internal navigation, external links and downloads, all with one look. */
export function ButtonLink({
  href,
  variant = "secondary",
  size = "md",
  icon,
  children,
  className,
  external,
  transitionTypes,
  ...rest
}: Shared & {
  href: string;
  external?: boolean;
  /** Doorway transition for internal links, e.g. travelTypes(from, to). */
  transitionTypes?: string[];
} & Omit<ComponentProps<"a">, "href" | "children">) {
  const content = (
    <>
      {children}
      {icon}
    </>
  );
  const cls = classes(variant, size, className);

  if (external || rest.download !== undefined || /^(https?:|mailto:)/.test(href) || href.endsWith(".pdf")) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} transitionTypes={transitionTypes} {...rest}>
      {content}
    </Link>
  );
}

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  children,
  className,
  type = "button",
  ...rest
}: Shared & Omit<ComponentProps<"button">, "children">) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      {children}
      {icon}
    </button>
  );
}
