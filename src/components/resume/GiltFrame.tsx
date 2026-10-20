import Image from "next/image";
import type { ResumePage } from "@/lib/resumes";

/**
 * The antique gilt frame with a paper mount, holding page 1 of a résumé.
 * Sized by the `--frame-w` custom property on an ancestor (see record-room.css).
 * Decorative: the surrounding UI carries the accessible description.
 */
export function GiltFrame({
  page,
  ownerName,
  sizes,
  priority,
  versionKey,
}: {
  page: ResumePage | undefined;
  ownerName: string;
  sizes: string;
  priority?: boolean;
  /** Changing this replays the "developing photograph" animation. */
  versionKey?: string;
}) {
  return (
    <div className="gilt">
      <div className="gilt-cove">
        <div className="gilt-bead">
          <div className="gilt-lip">
            <div className="gilt-mat">
              {page ? (
                <Image
                  key={versionKey}
                  src={page.src}
                  width={page.width}
                  height={page.height}
                  alt=""
                  sizes={sizes}
                  priority={priority}
                  className="block h-auto w-full animate-develop bg-white shadow-[0_1px_3px_rgb(0_0_0/0.3)]"
                />
              ) : (
                <div className="flex aspect-[1/1.29] flex-col items-center justify-center gap-2 bg-white text-center text-[#191919]">
                  <span className="font-serif text-xl">{ownerName}</span>
                  <span className="label text-[#5a554d]">Preview not rendered</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
