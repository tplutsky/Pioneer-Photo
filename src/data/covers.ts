/**
 * Cover Catalog — official Pioneer product photos plus CSS/SVG fallbacks.
 *
 * Official JPEGs live in /public/pioneer/ (first-party pioneerphotoalbums.com).
 * `coverImage` is the CSS/SVG style key used when no photo is present or the
 * photo fails to load. `photoSrc` points at an official product JPEG when one
 * matches the cover.
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
  | "Kraft Paper"
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
  /** CSS/SVG style key rendered by <AlbumCover /> as the fallback skin. */
  coverImage: string;
  /** Official Pioneer product photo under /pioneer/, when one fits. */
  photoSrc?: string;
  formats: CoverFormat[];
  licensingStatus: LicensingStatus;
}

export const COVERS: AlbumCoverDef[] = [
  {
    id: "burgundy-gold-frame",
    name: "Classic Navy Album",
    collection: "Classic",
    color: "Navy",
    material: "Bonded Leather",
    style: "Gold spine lettering (album2)",
    coverImage: "css:burgundy-gold-frame",
    photoSrc: "/pioneer/album2.jpg",
    formats: ["4x6", "5x7", "8x10"],
    licensingStatus: "official-pioneer",
  },
  {
    id: "ivory-linen-emboss",
    name: "White Bookbound",
    collection: "Linen",
    color: "Ivory",
    material: "Linen",
    style: "BDP35-W bookbound / post",
    coverImage: "css:ivory-linen-emboss",
    photoSrc: "/pioneer/BDP35-W.jpg",
    formats: ["5x7", "8x10", "Square"],
    licensingStatus: "official-pioneer",
  },
  {
    id: "navy-heritage-spine",
    name: "Navy Post-Bound",
    collection: "Heritage",
    color: "Navy",
    material: "Bonded Leather",
    style: "STC504-NB scrapbook",
    coverImage: "css:navy-heritage-spine",
    photoSrc: "/pioneer/STC504-NB.jpg",
    formats: ["8x10", "Scrapbook"],
    licensingStatus: "official-pioneer",
  },
  {
    id: "floral-garden",
    name: "Garden Floral",
    collection: "Floral",
    color: "Rose",
    material: "Printed Board",
    style: "Hand-drawn garden print",
    coverImage: "css:floral-garden",
    formats: ["4x6", "5x7", "Square"],
    licensingStatus: "original-placeholder",
  },
  {
    id: "kraft-travel-journal",
    name: "Kraft Travel Journal",
    collection: "Travel",
    color: "Kraft",
    material: "Kraft Paper",
    style: "Stitched journal with stamps",
    coverImage: "css:kraft-travel-journal",
    formats: ["4x6", "Scrapbook"],
    licensingStatus: "original-placeholder",
  },
  {
    id: "sage-botanical",
    name: "Sage Botanical",
    collection: "Floral",
    color: "Sage",
    material: "Cloth",
    style: "Pressed-leaf motif",
    coverImage: "css:sage-botanical",
    formats: ["5x7", "8x10", "Square"],
    licensingStatus: "original-placeholder",
  },
  {
    id: "black-archival",
    name: "Black Bi-Directional",
    collection: "Classic",
    color: "Black",
    material: "Archival Buckram",
    style: "DA200SF-BK fabric",
    coverImage: "css:black-archival",
    photoSrc: "/pioneer/DA200SF-BK.jpg",
    formats: ["8x10", "Scrapbook"],
    licensingStatus: "official-pioneer",
  },
  {
    id: "warm-brown-family",
    name: "Brown Bi-Directional",
    collection: "Heritage",
    color: "Walnut",
    material: "Bonded Leather",
    style: "DA200SF-BN fabric",
    coverImage: "css:warm-brown-family",
    photoSrc: "/pioneer/DA200SF-BN.jpg",
    formats: ["5x7", "8x10"],
    licensingStatus: "official-pioneer",
  },
  {
    id: "pale-blue-baby",
    name: "Pale Blue Baby",
    collection: "Baby",
    color: "Pale Blue",
    material: "Cloth",
    style: "Soft scallop border",
    coverImage: "css:pale-blue-baby",
    formats: ["4x6", "Square"],
    licensingStatus: "original-placeholder",
  },
  {
    id: "red-gold-holiday",
    name: "Red Cloth Bookbound",
    collection: "Seasonal",
    color: "Deep Red",
    material: "Cloth",
    style: "DA200CBF-R bi-directional",
    coverImage: "css:red-gold-holiday",
    photoSrc: "/pioneer/DA200CBF-R.jpg",
    formats: ["4x6", "5x7", "Square"],
    licensingStatus: "official-pioneer",
  },
  {
    id: "pearl-wedding",
    name: "Silver Frame Wedding",
    collection: "Wedding",
    color: "Pearl",
    material: "Linen",
    style: "WFM46 silver frame",
    coverImage: "css:pearl-wedding",
    photoSrc: "/pioneer/WFM46-SilverFrame-wText.jpg",
    formats: ["8x10", "Square", "Scrapbook"],
    licensingStatus: "official-pioneer",
  },
  {
    id: "forest-expedition",
    name: "Forest Expedition",
    collection: "Travel",
    color: "Forest Green",
    material: "Leatherette",
    style: "Compass rose deboss",
    coverImage: "css:forest-expedition",
    formats: ["4x6", "5x7", "Scrapbook"],
    licensingStatus: "original-placeholder",
  },
  {
    id: "memory-book-ivory",
    name: "Ivory Memory Book",
    collection: "Heritage",
    color: "Ivory",
    material: "Cloth",
    style: "MB10CBFI memory book",
    coverImage: "css:ivory-linen-emboss",
    photoSrc: "/pioneer/MB10CBFI.jpg",
    formats: ["5x7", "8x10"],
    licensingStatus: "official-pioneer",
  },
];

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
  "Kraft Paper",
  "Cloth",
  "Archival Buckram",
];

export const COVER_COLORS = Array.from(new Set(COVERS.map((c) => c.color)));

export const getCover = (id: string) => COVERS.find((c) => c.id === id) ?? COVERS[0]!;
