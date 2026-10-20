import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * Index number in the margin, eyebrow, serif title, optional intro.
 * The index column is what makes sections read as drawers of one archive.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  intro,
  as: Heading = "h2",
  id,
  className,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
}) {
  return (
    <header className={cx("grid gap-x-8 gap-y-4 md:grid-cols-12", className)}>
      <p className="hidden label text-fg-faint md:col-span-2 md:block md:pt-3" aria-hidden>
        {index}
      </p>
      <div className="md:col-span-9">
        <p className="label text-accent">
          <span aria-hidden className="text-fg-faint md:hidden">
            {index} /{" "}
          </span>
          {eyebrow}
        </p>
        <Heading
          id={id}
          className={cx("mt-4", Heading === "h1" ? "text-headline" : "text-title md:text-[2.5rem]")}
        >
          {title}
        </Heading>
        {intro ? <div className="mt-6 measure text-lede text-fg-muted">{intro}</div> : null}
      </div>
    </header>
  );
}
