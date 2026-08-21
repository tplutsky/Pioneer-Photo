/**
 * Cover Catalog — official Pioneer product photos from pioneerphotoalbums.com
 * (apex WordPress media API). Files live in /public/pioneer/covers and
 * /public/pioneer/spines. CSS/SVG skins are fallbacks only.
 */

export type CoverCollection =
  | "Classic"
  | "Linen"
  | "Leatherette"
  | "Floral"
  | "Travel"
  | "Wedding"
  | "Baby"
  | "Heritage"
  | "Seasonal";

export type CoverFormat = "4x6" | "5x7" | "8x10" | "Square" | "Scrapbook";

export type CoverMaterial =
  | "Leatherette"
  | "Linen"
  | "Bonded Leather"
  | "Printed Board"
  | "Cloth"
  | "Archival Buckram";

export type LicensingStatus = "original-placeholder" | "official-pioneer";

export interface AlbumCoverDef {
  id: string;
  name: string;
  collection: CoverCollection;
  color: string;
  material: CoverMaterial;
  style: string;
  /** CSS/SVG style key rendered by <AlbumCover /> if the photo fails. */
  coverImage: string;
  /** Official Pioneer front/cover JPEG under /pioneer/covers/. */
  photoSrc?: string;
  /** Official spine crop (or cover cropped to a tall spine) under /pioneer/spines/. */
  spineSrc?: string;
  formats: CoverFormat[];
  licensingStatus: LicensingStatus;
}

const official = (
  sku: string,
  collection: CoverCollection,
  color: string,
  material: CoverMaterial,
  style: string,
  formats: CoverFormat[],
  file = sku,
): AlbumCoverDef => ({
  id: sku.toLowerCase(),
  name: sku,
  collection,
  color,
  material,
  style,
  coverImage: `css:${sku.toLowerCase()}`,
  photoSrc: `/pioneer/covers/${file}.jpg`,
  spineSrc: `/pioneer/spines/${file}.jpg`,
  formats,
  licensingStatus: "official-pioneer",
});

export const COVERS: AlbumCoverDef[] = [
  official("DA200SF-BK", "Classic", "Black", "Archival Buckram", "Black fabric bi-directional", ["4x6", "8x10"]),
  official("DA200SF-BN", "Heritage", "Walnut", "Bonded Leather", "Brown fabric bi-directional", ["4x6", "5x7", "8x10"]),
  official("DA200CBF-BK", "Classic", "Black", "Cloth", "Black cloth bi-directional", ["4x6"]),
  official("DA200CBF-R", "Seasonal", "Deep Red", "Cloth", "Red cloth bi-directional", ["4x6", "5x7", "Square"]),
  official("DA200CBF-SG", "Floral", "Sage", "Cloth", "Sage cloth bi-directional", ["4x6", "5x7"]),
  official("DA200CBF-SB", "Baby", "Pale Blue", "Cloth", "Sky-blue cloth bi-directional", ["4x6", "Square"]),
  official("BDP35-W", "Linen", "Ivory", "Linen", "White bookbound / post", ["5x7", "8x10", "Square"]),
  official("BDP35-NB", "Classic", "Navy", "Bonded Leather", "Navy bookbound / post", ["5x7", "8x10"]),
  official("BDP35-BK", "Classic", "Black", "Bonded Leather", "Black bookbound / post", ["5x7"]),
  official("BDP35-BR", "Heritage", "Burgundy", "Bonded Leather", "Burgundy bookbound / post", ["5x7"]),
  official("BDP35-HG", "Travel", "Forest Green", "Bonded Leather", "Hunter-green bookbound / post", ["5x7"]),
  official("BDP35-BB", "Heritage", "Plum", "Bonded Leather", "Plum bookbound / post", ["5x7"]),
  official("STC504-NB", "Heritage", "Navy", "Bonded Leather", "Navy post-bound scrapbook", ["Scrapbook", "8x10"]),
  official("STC504-BR", "Heritage", "Burgundy", "Bonded Leather", "Burgundy post-bound scrapbook", ["Scrapbook"]),
  official("STC504-HG", "Travel", "Forest Green", "Bonded Leather", "Hunter-green post-bound scrapbook", ["Scrapbook"]),
  official("STC204-NB", "Heritage", "Navy", "Bonded Leather", "Navy mini post-bound scrapbook", ["Scrapbook"]),
  official("WFM46-SilverFrame-wText", "Wedding", "Pearl", "Linen", "Silver frame wedding", ["4x6", "Square"], "WFM46-SilverFrame-wText"),
  official("WFM46-GoldFrame-wText", "Wedding", "Ivory", "Linen", "Gold frame wedding", ["4x6", "Square"], "WFM46-GoldFrame-wText"),
  official("MB10CBFI", "Heritage", "Ivory", "Cloth", "Ivory memory book", ["5x7", "8x10"]),
  official("MB10CBF-BK", "Classic", "Black", "Cloth", "Black memory book", ["8x10"]),
  official("MB10CBF-R", "Seasonal", "Deep Red", "Cloth", "Red memory book", ["8x10"]),
  official("5COL240W", "Classic", "Ivory", "Cloth", "White five-window collage", ["5x7", "Square"]),
  official("5COL240B-P", "Baby", "Rose", "Cloth", "Baby pink five-window collage", ["4x6", "Square"]),
  official("5COL240TR", "Travel", "Walnut", "Leatherette", "Travel five-window collage", ["4x6", "Square"]),
  official("5COL240FM", "Classic", "Black", "Cloth", "Family five-window collage", ["4x6", "Square"]),
  official("A4100-F", "Floral", "Sage", "Printed Board", "Botanical print cover", ["4x6"]),
  official("EV246G-L", "Wedding", "Ivory", "Printed Board", "Live Laugh Love gold-dot", ["4x6", "Square"]),
  official("EV246FB-OGN", "Travel", "Forest Green", "Printed Board", "Organic green event cover", ["4x6", "Square"]),
  official("SJ100-BR", "Leatherette", "Burgundy", "Leatherette", "Burgundy gold-frame journal", ["4x6"]),
  official("SJ100-W", "Linen", "Ivory", "Leatherette", "White stitch journal", ["4x6"]),
  official("LM100-BR", "Leatherette", "Burgundy", "Leatherette", "Burgundy leatherette memo", ["4x6"]),
  official("LM100-NB", "Leatherette", "Navy", "Leatherette", "Navy leatherette memo", ["4x6"]),
  official("T12CBF-BK", "Classic", "Black", "Cloth", "12×12 black cloth scrapbook", ["Scrapbook"]),
  official("DA200LLL-S", "Linen", "Ivory", "Linen", "Linen-look bi-directional", ["4x6", "Square"]),
  official("CLB346-BN", "Leatherette", "Walnut", "Leatherette", "Brown cloth-leatherette book", ["4x6", "5x7"]),
  official("DA200CBFN-WP", "Linen", "Plum", "Linen", "Plum linen window", ["4x6", "Square"]),
  official("DA200CBFE-BB", "Linen", "Sand", "Linen", "Sand linen window", ["4x6", "Square"]),
  official("DA200CBFN-WM", "Heritage", "Walnut", "Linen", "Espresso linen window", ["4x6", "Square"]),
  official("TXT200TR", "Travel", "Walnut", "Leatherette", "Travel word-cover", ["4x6", "Square"]),
  official("JMV207-NB", "Travel", "Navy", "Leatherette", "Navy journal memo", ["4x6"]),
];

/** Older demo ids still resolve after the SKU catalog landed. */
const LEGACY_IDS: Record<string, string> = {
  "burgundy-gold-frame": "bdp35-nb",
  "ivory-linen-emboss": "bdp35-w",
  "navy-heritage-spine": "stc504-nb",
  "floral-garden": "a4100-f",
  "kraft-travel-journal": "txt200tr",
  "sage-botanical": "da200cbf-sg",
  "black-archival": "da200sf-bk",
  "warm-brown-family": "da200sf-bn",
  "pale-blue-baby": "da200cbf-sb",
  "red-gold-holiday": "da200cbf-r",
  "pearl-wedding": "wfm46-silverframe-wtext",
  "forest-expedition": "bdp35-hg",
  "memory-book-ivory": "mb10cbfi",
};

export const COLLECTIONS: CoverCollection[] = [
  "Classic",
  "Linen",
  "Leatherette",
  "Floral",
  "Travel",
  "Wedding",
  "Baby",
  "Heritage",
  "Seasonal",
];

export const FORMATS: CoverFormat[] = ["4x6", "5x7", "8x10", "Square", "Scrapbook"];

export const MATERIALS: CoverMaterial[] = [
  "Leatherette",
  "Linen",
  "Bonded Leather",
  "Printed Board",
  "Cloth",
  "Archival Buckram",
];

export const COVER_COLORS = Array.from(new Set(COVERS.map((c) => c.color)));

export const getCover = (id: string) => {
  const resolved = LEGACY_IDS[id] ?? id;
  return COVERS.find((c) => c.id === resolved) ?? COVERS[0]!;
};
