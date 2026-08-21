# Pioneer Photo Albums Library

A local demo of a family photo-album library: a wooden shelf, page-curl flip-through, official Pioneer covers, and a waitlist form. Built with TanStack Start, React, TypeScript, Tailwind CSS, and Framer Motion.

Your photos stay on your device. This demo does not upload or store your originals.

## How to run

You can use bun or npm.

    bun install        # or: npm install
    bun run dev        # or: npm run dev

Production build: `bun run build` or `npm run build`.  
Preview: `bun run preview` or `npm run preview`.

## Routes

| Path | What it is |
| --- | --- |
| `/` | Landing: hero, looping album preview, interactive shelf |
| `/library` | Memory library — shelf or grid, filters, search |
| `/album/:id` | Open a sample album, turn pages, play Album Reveal |
| `/album/:id?open=1` | First tap opens the book immediately |
| `/album/:id?reveal=1` | Starts the branded Album Reveal |
| `/organize` | Local-only organize demo (file chooser / drag-and-drop) |
| `/covers` | Cover catalog — official Pioneer photos + CSS/SVG fallbacks |
| `/waitlist` | 30-day free trial waitlist (saved in this browser only) |
| `/privacy` | Privacy promises and how it works |

TanStack Start uses file-based routes in `src/routes/`. See `src/routes/README.md` for the framework conventions. Do not add `src/pages/` or Next.js-style layouts.

## What you can try

- **Open an album** from the first tap on the landing page. Pages turn with a paper curl (or a simple fade if you prefer reduced motion).
- **Pick a spine** on the shelf. Each spine shows a short date and the photo count.
- **Play Album Reveal** for a branded walk-through of a sample album, with the official wagon mark.
- **Save as a short movie (demo)** records that reveal in the browser and downloads a file to this device. Nothing is sent to a server.
- **Organize** lets you choose local image files for a temporary preview. Object URLs are revoked when you leave.
- **Cover Catalog** uses official Pioneer product photos where they fit, and original skins when they do not.

## Official art

Official Pioneer Photo Albums logos and product photos live in `public/pioneer/`. They are first-party assets from pioneerphotoalbums.com.

| File | Use |
| --- | --- |
| `logo-wagon.jpg` | Header / footer wagon mark, favicon |
| `logo-left.png` | Wordmark lockup on the landing hero and Album Reveal |
| `album2.jpg` | Classic navy / gold-spine cover |
| `BDP35-W.jpg` | White bookbound |
| `STC504-NB.jpg` | Navy post-bound scrapbook |
| `DA200SF-BK.jpg` | Black bi-directional |
| `DA200SF-BN.jpg` | Brown bi-directional |
| `DA200CBF-R.jpg` | Red cloth bookbound |
| `WFM46-SilverFrame-wText.jpg` | Silver frame wedding |
| `MB10CBFI.jpg` | Ivory memory book |

The Cover Catalog uses those photos where they fit and keeps CSS/SVG skins as fallbacks. Sample “photographs” inside albums are original abstract illustrations — no real people, no retailer scrapes.

## Motion

Page curls, the landing hero parallax, shelf settle, and Album Reveal all respect `prefers-reduced-motion`. When that preference is on, the app fades instead of curling, skips parallax, and still lets you save a short movie with still holds instead of interpolated motion.

## What this demo does not do

- No server photo upload. This app does not accept or store user photos on a server. Sample pages use built-in illustrations only. Local file picks stay in the tab as temporary previews.
- No billing. There is no payment integration, no card form, and no checkout.
- Waitlist is local/demo. Submitting the waitlist form saves an entry in this browser only (`localStorage`). Nothing is sent to a backend.
- Sharing private albums is disabled. “Copy demo link” copies the sample album URL only.

## Privacy line (keep this wording)

> Your photos stay on your device. This demo does not upload or store your originals.
