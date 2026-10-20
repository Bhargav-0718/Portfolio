import type { CSSProperties } from "react";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { getRoom, travelTypes } from "@/lib/rooms";
import { DirectoryBoard } from "./DirectoryBoard";

const DOWNLIGHTS = 7;

/** First screen of the Lobby: who, what, and the way in. */
export function Arrival() {
  const lobby = getRoom("lobby");
  const { headline, headlineEmphasis } = site.hero;
  const lead = headline.endsWith(headlineEmphasis) ? headline.slice(0, -headlineEmphasis.length) : headline;
  const emphasis = headline.endsWith(headlineEmphasis) ? headlineEmphasis : "";

  // Reflections of the downlights in the polished floor, aligned with the fittings above.
  const reflections = Array.from({ length: DOWNLIGHTS }, (_, i) => {
    const x = ((i + 0.5) / DOWNLIGHTS) * 100;
    return `radial-gradient(ellipse 3% 100% at ${x.toFixed(2)}% 0, rgb(255 232 196 / 0.1), transparent 80%)`;
  }).join(", ");

  return (
    <section className="lobby-arrival" aria-labelledby="lobby-title">
      <div aria-hidden className="lobby-wall" />
      <div aria-hidden className="lobby-lights">
        {Array.from({ length: DOWNLIGHTS }, (_, i) => (
          <span key={i} className="lobby-downlight" style={{ "--i": i } as CSSProperties} />
        ))}
      </div>
      <div aria-hidden className="lobby-floor">
        <div className="absolute inset-0" style={{ background: reflections }} />
      </div>

      <div className="frame grid w-full items-center gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="label text-accent">{site.hero.eyebrow}</p>
          <h1
            id="lobby-title"
            className="mt-6 max-w-[17ch] text-[clamp(2.6rem,1.4rem+3.6vw,4.9rem)] leading-[1.02] tracking-tight"
          >
            {lead}
            {emphasis ? <em className="text-accent-mark">{emphasis}</em> : null}
          </h1>
          <p className="mt-8 measure text-lede text-fg-muted">{site.hero.supporting}</p>
          <p className="mt-5 meta text-fg-faint">
            {site.descriptor} · {site.location}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink
              href={getRoom("museum").href}
              variant="primary"
              transitionTypes={travelTypes(lobby, getRoom("museum"))}
              icon={<ArrowUp aria-hidden className="size-3.5" />}
            >
              Enter the Museum
            </ButtonLink>
            <ButtonLink
              href={getRoom("record").href}
              transitionTypes={travelTypes(lobby, getRoom("record"))}
              icon={<ArrowLeft aria-hidden className="size-3.5" />}
            >
              View résumé
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-4">
          <DirectoryBoard />
        </div>
      </div>
    </section>
  );
}
