/**
 * Renders every page of every résumé PDF to a PNG, so the archive can hang
 * the résumé as an image instead of embedding a PDF viewer.
 *
 *   npm run resume:previews          only re-renders PDFs that changed
 *   npm run resume:previews -- --all re-renders everything
 *
 * Output:
 *   public/cv/previews/<id>-<page>.png
 *   src/generated/resume-previews.json   (page sizes + content hash)
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pdf } from "pdf-to-img";
import { resumes } from "../content/resumes.ts";

type Page = { src: string; width: number; height: number };
type Manifest = Record<string, { hash: string; pages: Page[] }>;

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const outDir = path.join(publicDir, "cv", "previews");
const manifestPath = path.join(root, "src", "generated", "resume-previews.json");
const force = process.argv.includes("--all");

/** PNG stores width and height as big-endian uint32 at bytes 16 and 20. */
const pngSize = (buf: Buffer) => ({ width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) });

const previous: Manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};
const next: Manifest = {};

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });

for (const version of resumes) {
  const file = path.join(publicDir, version.file);
  if (!fs.existsSync(file)) {
    console.warn(`! ${version.id}: ${version.file} not found in public/ — skipped`);
    continue;
  }

  const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 16);
  const cached = previous[version.id];
  const cachedFilesExist = cached?.pages.every((p) => fs.existsSync(path.join(publicDir, p.src)));
  if (!force && cached?.hash === hash && cachedFilesExist) {
    next[version.id] = cached;
    console.log(`· ${version.id}: unchanged`);
    continue;
  }

  // Remove stale pages for this version before re-rendering.
  for (const old of fs.readdirSync(outDir).filter((f) => f.startsWith(`${version.id}-`))) {
    fs.rmSync(path.join(outDir, old));
  }

  const doc = await pdf(file, { scale: 2.5 });
  const pages: Page[] = [];
  let n = 1;
  for await (const image of doc) {
    const name = `${version.id}-${n}.png`;
    fs.writeFileSync(path.join(outDir, name), image);
    pages.push({ src: `/cv/previews/${name}`, ...pngSize(image) });
    n++;
  }
  await doc.destroy();

  next[version.id] = { hash, pages };
  console.log(`✓ ${version.id}: ${pages.length} page(s) rendered`);
}

// Delete images belonging to versions that were removed from the registry.
const ids = new Set(resumes.map((r) => r.id));
for (const file of fs.readdirSync(outDir)) {
  const id = file.replace(/-\d+\.png$/, "");
  if (file.endsWith(".png") && !ids.has(id)) {
    fs.rmSync(path.join(outDir, file));
    console.log(`− removed ${file} (version no longer listed)`);
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(next, null, 2) + "\n");
console.log(`Manifest written to src/generated/resume-previews.json`);
