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
- **Cover Catalog** lists 40 official Pioneer SKUs. Every collection, color, format, and material filter has at least one real product. CSS/SVG is fallback only.
- **Library and landing shelves** show all twelve demo albums. Each spine is a crop of the official cover (title + year on top of the real binding).

## Official art

Official Pioneer Photo Albums logos and product photos live in `public/pioneer/`. They are first-party JPEGs from the public WordPress media API at `https://pioneerphotoalbums.com/media/wp-json/wp/v2/media` (apex host only — not www, not retailers). Fronts are stored in `public/pioneer/covers/`. Spine crops of those same fronts live in `public/pioneer/spines/`. The UI does not hotlink the live site.

| File | Use |
| --- | --- |
| `logo-wagon.jpg` | Header / footer wagon mark, favicon |
| `logo-left.png` | Wordmark lockup on the landing hero and Album Reveal |
| `covers/*.jpg` | Catalog cards — clean official fronts |
| `spines/*.jpg` | Library / landing shelf — spine or left-edge crop |

### SKUs in this demo (40)

DA200SF-BK, DA200SF-BN, DA200CBF-BK, DA200CBF-R, DA200CBF-SG, DA200CBF-SB, BDP35-W, BDP35-NB, BDP35-BK, BDP35-BR, BDP35-HG, BDP35-BB, STC504-NB, STC504-BR, STC504-HG, STC204-NB, WFM46-SilverFrame-wText, WFM46-GoldFrame-wText, MB10CBFI, MB10CBF-BK, MB10CBF-R, 5COL240W, 5COL240B-P, 5COL240TR, 5COL240FM, A4100-F, EV246G-L, EV246FB-OGN, SJ100-BR, SJ100-W, LM100-BR, LM100-NB, T12CBF-BK, DA200LLL-S, CLB346-BN, DA200CBFN-WP, DA200CBFE-BB, DA200CBFN-WM, TXT200TR, JMV207-NB.

Sample “photographs” inside albums are original abstract illustrations — no real people, no retailer scrapes.

## Motion

Page curls, the landing hero parallax, shelf settle, and Album Reveal all respect `prefers-reduced-motion`. When that preference is on, the app fades instead of curling, skips parallax, and still lets you save a short movie with still holds instead of interpolated motion.

## What this demo does not do

- No server photo upload. This app does not accept or store user photos on a server. Sample pages use built-in illustrations only. Local file picks stay in the tab as temporary previews.
- No billing. There is no payment integration, no card form, and no checkout.
- Waitlist is local/demo. Submitting the waitlist form saves an entry in this browser only (`localStorage`). Nothing is sent to a backend.
- Sharing private albums is disabled. “Copy demo link” copies the sample album URL only.

## Privacy line (keep this wording)

> Your photos stay on your device. This demo does not upload or store your originals.
