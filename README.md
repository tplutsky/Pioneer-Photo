# Pioneer Photo Albums Library

A local demo of a family photo-album library: shelf, flip-through albums, cover catalog, and a waitlist form. Built with TanStack Start, React, TypeScript, and Tailwind CSS.

## How to run

You can use bun or npm.

    cd pioneer-photo-albums-library
    bun install        # or: npm install
    bun run dev        # or: npm run dev

Production build: bun run build or npm run build.
Preview: bun run preview or npm run preview.

## Official art

Official Pioneer Photo Albums logos and product photos live in public/pioneer/. They are first-party assets from pioneerphotoalbums.com: wagon/wordmark, left logo, and a starter set of SKU cover JPEGs. The Cover Catalog uses those photos where they fit and keeps CSS/SVG skins as fallbacks.

## What this demo does not do

- No server photo upload. This app does not accept or store user photos on a server. Sample pages use built-in illustrations only.
- No billing. There is no payment integration, no card form, and no checkout.
- Waitlist is local/demo. Submitting the waitlist form saves an entry in this browser only (localStorage). Nothing is sent to a backend.

