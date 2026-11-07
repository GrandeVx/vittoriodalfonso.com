
### Tech Stack

- Next.js
- Tailwindcss
- Local MDX content validated with Zod

Ready to Deploy on **Vercel**

### Journey

Journey lives in the same application at `/{lang}/journey`. This keeps the
portfolio theme, locales, navigation, and deployment in one codebase; a
`journey.vittoriodalfonso.com` hostname can point to this route at the hosting
layer without creating a second app.

Research content is imported read-only from the local Research database and
the `The Journey` category:

```bash
npm run import:research
```

The importer discovers Research's current `data.db` and legacy `data.sqlite`
locations. Optional `--db` and `--research-root` arguments can override them.
It generates:

- editable editorial content in `markdown/journey/{it,en}/*.mdx`;
- normalized annotation geometry in `public/journey/data/*.json`;
- the matching PDFs in `public/journey/papers/*.pdf`;
- first-page JPEG previews in `public/journey/previews/*.jpg` (rendered with macOS `sips`).

The MDX files remain the human-readable editorial source. JSON is a derived
payload used only to keep highlights and comments aligned with PDF pages.

Journey entries share `title`, `description`, `date`, `language`, and `kind`.
Use `kind: paper` for the PDF reader; `note`, `experiment`, and `article`
render as regular MDX posts. Paper-only fields such as `pdf`, `annotations`,
`paperYear`, and `sourceUrl` are optional for the other entry types.

### Books

The bilingual book index lives at `/{lang}/books`. Edit `lib/books.ts` to add
books, assign `readYear`, and set `yearEstimated: true` when the year is an
approximation. Amazon matches also record `purchaseYear`; this is used as the
estimated reading year, never presented as a confirmed reading date. Optional
`comment.it` and `comment.en` appear when a book is
selected. Keep the cover source URL with each image. Position 18 in the first
photo is reserved until the book can be identified.
