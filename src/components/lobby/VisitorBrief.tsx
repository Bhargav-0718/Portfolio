import { awards, chaired } from "@content/mun";
import { achievements, education, experience, interests, positions, summary } from "@content/profile";
import { Reveal } from "@/components/motion/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { formatUpdated } from "@/lib/resumes";

type Row = { label: string; value: string; note?: string; pending?: boolean };

const period = (p: { start: string; end: string | "present" } | null) =>
  p ? `${formatUpdated(p.start)} – ${p.end === "present" ? "present" : formatUpdated(p.end)}` : undefined;

/**
 * The reception logbook: the short version of who keeps this archive.
 * Every row comes from content/profile.ts; nothing here is written freehand.
 */
export function VisitorBrief() {
  const current = experience.find((e) => e.current);
  const previous = experience.find((e) => !e.current && e.source === "cv");
  const study = education[0];
  const lead = positions.find((p) => p.source === "cv");
  const research = achievements.find((a) => a.work);

  const rows: Row[] = [
    current && {
      label: "Currently",
      value: `${current.role}, ${current.organisation}`,
      note: current.period
        ? [period(current.period), current.summary[0]].filter(Boolean).join(" · ")
        : "Dates to be added",
      pending: !current.period,
    },
    previous && {
      label: previous.period?.end === "present" ? "Also" : "Previously",
      value: `${previous.role}, ${previous.organisation}`,
      note: [period(previous.period), previous.location].filter(Boolean).join(" · "),
    },
    research && {
      label: "Research",
      value: research.title,
      note: `“${research.work}” · ${research.detail}`,
    },
    study && {
      label: "Studying",
      value: `${study.degree}, IIIT Nagpur`,
      note: period(study.period),
    },
    lead && {
      label: "Led",
      value: `${lead.title}, ${lead.organisation}`,
      note: `Deputy Secretary-General, IIITN-MUN 3.0 (200+ delegates) · ${chaired.length} MUN committees chaired · ${awards.filter((a) => a.award === "Best Delegate").length} × Best Delegate`,
    },
    {
      label: "Off duty",
      value: interests.reading.join(", "),
    },
  ].filter(Boolean) as Row[];

  return (
    <section aria-labelledby="visitor-brief" className="frame py-section">
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="label text-accent">Reception · Visitor&apos;s brief</p>
          <h2 id="visitor-brief" className="mt-4 text-title md:text-[2.5rem]">
            Before you walk in.
          </h2>
          <p className="mt-4 max-w-[28rem] text-fg-muted">
            The short version, signed in at the front desk. The long version is filed room by room.
          </p>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-8">
          <div className="surface-paper relative px-5 py-6 shadow-[0_24px_50px_-24px_rgb(0_0_0/0.9)] sm:px-8 sm:py-8">
            {/* Logbook margin rule */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-[7.75rem] hidden w-px bg-accent-mark/40 sm:block"
            />
            <dl>
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-x-8 gap-y-1 border-b border-line py-4 first:pt-0 sm:grid-cols-[5.75rem_1fr]"
                >
                  <dt className="pt-1 label text-accent">{row.label}</dt>
                  <dd>
                    <p className="font-serif text-[1.2rem] leading-snug">{row.value}</p>
                    {row.note ? (
                      <p
                        className={row.pending ? "mt-1 meta text-fg-faint italic" : "mt-1 meta text-fg-muted"}
                      >
                        {row.note}
                      </p>
                    ) : null}
                  </dd>
                </div>
              ))}
              <div className="grid gap-x-8 gap-y-1 pt-4 sm:grid-cols-[5.75rem_1fr]">
                <dt className="pt-1 label text-accent">In my words</dt>
                <dd>
                  {summary ? (
                    <blockquote className="font-serif text-[1.15rem] leading-relaxed text-fg italic">
                      “{summary[0]}”
                    </blockquote>
                  ) : (
                    <Placeholder label="Summary">A short personal summary, in my own words.</Placeholder>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
