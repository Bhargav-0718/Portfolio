/**
 * Renders page 1 of a PDF in public/ to a PNG beside it, for use as evidence
 * (certificates, documents). Prints the image size for the content file.
 *
 *   npm run pdf:preview -- public/certificates/iccis-2026-presentation.pdf
 */
import fs from "node:fs";
import path from "node:path";
import { pdf } from "pdf-to-img";

const input = process.argv[2];
if (!input || !input.endsWith(".pdf") || !fs.existsSync(input)) {
  console.error("Usage: npm run pdf:preview -- <path/to/file.pdf>");
  process.exit(1);
}

const doc = await pdf(input, { scale: 2 });
const image = await doc.getPage(1);
await doc.destroy();

const output = input.replace(/\.pdf$/, ".png");
fs.writeFileSync(output, image);

const width = image.readUInt32BE(16);
const height = image.readUInt32BE(20);
const src = "/" + path.relative("public", output).split(path.sep).join("/");
console.log(`✓ ${src}  width: ${width}  height: ${height}`);
