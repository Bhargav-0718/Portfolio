# The Unfinished Archive

> Some things are built. Some things are questioned. Everything leaves a trail.

The personal portfolio of Bhargav Bidkar, presented as an investigative archive.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run check        # lint + typecheck + format check
npm run content:todo # regenerate CONTENT-TODO.md
```

Stack: Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · Zod.

## Where things live

| What                                                   | Where                                        |
| ------------------------------------------------------ | -------------------------------------------- |
| Name, links, email, résumé path, hero copy, navigation | `src/config/site.ts`                         |
| Education, experience, positions, skills (from the CV) | `content/profile.ts`                         |
| Case files                                             | `content/cases/*.mdx`                        |
| Human Element stories                                  | `content/leadership/*.mdx`                   |
| Cabinet of Curiosity                                   | `content/curiosity/*.mdx`                    |
| Field Journal                                          | `content/field-notes/*.mdx`                  |
| Content schemas (what fields are allowed)              | `src/lib/content/schema.ts`                  |
| Design tokens (colour, type, spacing, motion)          | `src/styles/tokens.css`, `src/lib/motion.ts` |
| Fonts                                                  | `src/lib/fonts.ts`                           |
| Images, diagrams, résumé                               | `public/` (see `ASSETS.md`)                  |

## Rooms

The site is a building. Every page is a room on the floor plan in `src/config/rooms.ts`:
its number, name, URL, position on a 4×2 grid, and which rooms share a doorway.

- Wrap every page in `<Room id="…">` (inside `page.tsx`, not a layout). It adds the doorway
  transition and the "Doorways" exits at the bottom.
- Link between rooms with `<RoomLink to="…">` (client) or `<Link transitionTypes={travelTypes(from, to)}>`,
  so the transition slides in the direction you're walking on the plan.
- Changing the plan (positions or `doors`) updates the floor-plan map, the exits and the
  transition directions automatically.

## Blog

Essays from [Through My Mind's Eye](https://through-my-minds-eye.blogspot.com/) appear in the Reading Room
(`/field-journal`, "The writing desk") and the Lobby. They're read from the blog's public Blogger feed by
`src/lib/blog.ts`, cached for about an hour, so **new posts show up on the site by themselves**: just publish on
Blogger. Only plain text is taken from the feed; each card links to the full essay on the blog. The blog address
and sign-off live in `src/config/site.ts` (`blog`).

## Résumés

Several versions can be on display (e.g. Product and Tech). Visitors switch between them on the exhibit placard.

1. Drop the PDF into `public/cv/` (e.g. `public/cv/bhargav-bidkar-tech.pdf`).
2. Add or edit its entry in `content/resumes.ts`. Set `primary: true` on the version shown by default.
3. Run `npm run resume:previews` to render the page images (`--all` forces a full re-render).

Stable URLs:

| URL                | Serves                                 |
| ------------------ | -------------------------------------- |
| `/resume`          | Exhibit page, primary version          |
| `/resume/<id>`     | Exhibit page, that version (shareable) |
| `/resume.pdf`      | Redirect to the primary PDF            |
| `/resume/<id>.pdf` | Redirect to that version's PDF         |

Set `public: false` on a version to hide it from the switcher while keeping its direct link working.

## Adding content

Create a new `.mdx` file in the right `content/` folder. The filename becomes the URL slug.
Frontmatter is validated at build time, and a bad field fails the build with the file name and field.

### Adding a case file

1. Copy `content/cases/contract-review-decision-support.mdx` (the reference case) to a new file, e.g.
   `content/cases/my-project.mdx`. It appears in the Museum at `/museum/my-project`.
2. Write the body with these `##` headings (leave out any that don't apply; they're skipped):
   `The Brief`, `The Hypotheses`, `The Investigation`, `The Finding`, `The Open Questions`.
   Use `<Placeholder>…</Placeholder>` for anything not written yet.
3. Add artifacts under `evidence:`. Types: `image`, `svg`, `table`, `comparison`, `note`, `code`, `link`.
   Every artifact needs a `caption` and a `provenance` (`actual`, `illustrative` or `placeholder`).
   For a PDF document, run `npm run pdf:preview -- public/path/to/file.pdf` and use the PNG it prints.
4. `featured: true` puts the case in the Lobby's "Now showing" (the first three by `order`).

Honesty fields used across all collections:

- `involvement`: `built` · `contributed` · `studied` · `explored`
- `status`: `verified` · `needs-review` · `placeholder` (anything not verified is flagged in the UI)
- `draft: true`: visible in `npm run dev`, excluded from production
- `todo: [...]`: missing information, collected into `CONTENT-TODO.md`
- Evidence `provenance`: `actual` · `illustrative` · `placeholder`
- A link with `href: null` is shown as "link pending", never as a dead link

## Design system in one paragraph

Dark obsidian (`#191919`) is the default surface. Archive paper (`#E9E2D5`) panels are used for evidence and documents.
Add the `surface-paper` class to any container and every semantic colour (`text-fg`, `text-accent`,
`border-line` …) flips to its paper-legible version. Oxide marks exhibits and active states. Field green marks findings.
Newsreader is for questions and narrative, Inter Tight for interface and body text, IBM Plex Mono for labels (`label` and `meta` utilities).
