import { PHOTOS } from "./photos";

export type AlbumCategory =
  | "Family"
  | "Travel"
  | "Celebrations"
  | "Kids"
  | "Holidays"
  | "Favorites"
  | "Unsorted";

export type PageLayout = "1-up" | "2-up" | "4-up" | "collage";

export interface AlbumPage {
  id: string;
  layout: PageLayout;
  photoIds: string[];
  caption?: string;
}

export interface DemoAlbum {
  id: string;
  title: string;
  dateRange: string;
  sortDate: string;
  updatedAt: string;
  coverId: string;
  categories: AlbumCategory[];
  place: string;
  people: string[];
  tags: string[];
  photoCount: number;
  memoryNote: string;
  pages: AlbumPage[];
}

const layouts: PageLayout[] = ["1-up", "2-up", "4-up", "collage", "2-up", "1-up"];

function buildPages(albumId: string, ids: string[]): AlbumPage[] {
  const pages: AlbumPage[] = [];
  let i = 0;
  let n = 0;
  while (i < ids.length) {
    const layout = layouts[n % layouts.length]!;
    const size = layout === "1-up" ? 1 : layout === "2-up" ? 2 : 4;
    const slice = ids.slice(i, i + size);
    if (slice.length === 0) break;
    pages.push({
      id: `${albumId}-pg${n + 1}`,
      layout,
      photoIds: slice,
      caption: PHOTOS.find((p) => p.id === slice[0])?.caption ?? "",
    });
    i += size;
    n += 1;
  }
  // Albums read better as full spreads.
  if (pages.length % 2 === 1) {
    pages.push({ id: `${albumId}-pg${pages.length + 1}`, layout: "1-up", photoIds: [] });
  }
  return pages;
}

const def = (
  id: string,
  title: string,
  dateRange: string,
  sortDate: string,
  updatedAt: string,
  coverId: string,
  categories: AlbumCategory[],
  place: string,
  people: string[],
  tags: string[],
  photoIds: string[],
  photoCount: number,
  memoryNote: string,
): DemoAlbum => ({
  id,
  title,
  dateRange,
  sortDate,
  updatedAt,
  coverId,
  categories,
  place,
  people,
  tags,
  photoCount,
  memoryNote,
  pages: buildPages(id, photoIds),
});

export const ALBUMS: DemoAlbum[] = [
  def(
    "early-years",
    "The Early Years",
    "1987–1992",
    "1987-08-21",
    "2026-02-02",
    "warm-brown-family",
    ["Family", "Favorites"],
    "Farm road",
    ["Nan", "Mom", "Dad"],
    ["vintage", "family", "summer"],
    ["p26", "p01", "p02", "p14", "p03", "p16"],
    148,
    "Scanned prints, soft grain, and a lot of porch light. Written by you, kept by you.",
  ),
  def(
    "growing-family",
    "Our Growing Family",
    "2015–2017",
    "2015-11-26",
    "2026-01-28",
    "ivory-linen-emboss",
    ["Family", "Kids"],
    "Home",
    ["Mom", "Dad", "Jo", "Sam"],
    ["family", "birthday", "yard"],
    ["p16", "p07", "p11", "p09", "p27", "p25"],
    212,
    "The years the house got louder. Mostly backyard, mostly unposed.",
  ),
  def(
    "summer-coast",
    "Summer on the Coast",
    "July 2019",
    "2019-07-14",
    "2026-01-11",
    "pale-blue-baby",
    ["Travel", "Favorites"],
    "Cape Shore",
    ["Mom", "Jo"],
    ["beach", "coast", "summer"],
    ["p08", "p18", "p23", "p32"],
    96,
    "Two weeks of salt air. The light did most of the work.",
  ),
  def(
    "mias-first-year",
    "Mia's First Year",
    "2021",
    "2021-01-30",
    "2026-02-14",
    "floral-garden",
    ["Kids", "Family", "Favorites"],
    "Home",
    ["Mia"],
    ["baby", "milestone", "newborn"],
    ["p24", "p06", "p15", "p33"],
    308,
    "From tiny socks to the first real laugh, in order, finally.",
  ),
  def(
    "holidays-at-home",
    "Holidays at Home",
    "2022",
    "2022-01-08",
    "2025-12-30",
    "red-gold-holiday",
    ["Holidays", "Celebrations"],
    "Home",
    ["Mom", "Dad", "Jo", "Mia"],
    ["christmas", "snow", "fourth"],
    ["p30", "p22", "p12", "p03"],
    134,
    "The year every holiday happened in the same three rooms.",
  ),
  def(
    "japan-spring",
    "Japan in Spring",
    "2023",
    "2023-04-03",
    "2026-02-09",
    "forest-expedition",
    ["Travel", "Favorites"],
    "Kyoto",
    ["Sam"],
    ["japan", "spring", "travel"],
    ["p04", "p17", "p10", "p29"],
    241,
    "Blossoms, trains, and one paper map that never folded back correctly.",
  ),
  def(
    "sunday-dinners",
    "Sunday Dinners",
    "2024",
    "2024-02-11",
    "2026-02-16",
    "sage-botanical",
    ["Family", "Celebrations"],
    "Kitchen",
    ["Mom"],
    ["dinner", "food"],
    ["p05", "p19", "p13", "p28"],
    88,
    "A whole year told in table settings and second helpings.",
  ),
  def(
    "small-moments",
    "Small Moments",
    "2025",
    "2025-01-19",
    "2026-02-18",
    "kraft-travel-journal",
    ["Family", "Favorites"],
    "Home",
    ["Mia", "Dad", "Mom"],
    ["everyday", "quiet", "morning"],
    ["p21", "p35", "p34", "p20", "p31"],
    176,
    "Nothing happened, which turned out to be the whole point.",
  ),
  def(
    "favorites-through-years",
    "Favorites Through the Years",
    "1987–2025",
    "2000-01-01",
    "2026-02-19",
    "burgundy-gold-frame",
    ["Favorites"],
    "Everywhere",
    ["Nan", "Mom", "Dad", "Jo", "Sam", "Mia"],
    ["favorites", "best-of"],
    ["p02", "p08", "p15", "p17", "p28", "p06"],
    64,
    "The ones you'd grab first. Marked with a star, kept together.",
  ),
  def(
    "to-be-sorted",
    "To Be Sorted",
    "Mixed dates",
    "2026-01-01",
    "2026-02-20",
    "black-archival",
    ["Unsorted"],
    "Various",
    [],
    ["inbox", "unsorted"],
    ["p20", "p35", "p13", "p25"],
    119,
    "Everything waiting for a home. No rush.",
  ),
  def(
    "birthdays-and-candles",
    "Birthdays & Candles",
    "2016–2024",
    "2017-09-09",
    "2026-01-05",
    "pearl-wedding",
    ["Celebrations", "Kids"],
    "Home",
    ["Jo", "Mom"],
    ["birthday", "cake"],
    ["p09", "p27", "p22", "p12"],
    102,
    "Eight years of the same song, sung badly, on purpose.",
  ),
  def(
    "trail-days",
    "Trail Days",
    "2018–2019",
    "2018-08-30",
    "2025-11-20",
    "navy-heritage-spine",
    ["Travel", "Family"],
    "Ridge Trail",
    ["Sam"],
    ["hike", "outdoors", "weather"],
    ["p25", "p32", "p14", "p01"],
    58,
    "Wet boots, good weather windows, one storm that came in sideways.",
  ),
];

export const ALBUM_CATEGORIES: (AlbumCategory | "All")[] = [
  "All",
  "Family",
  "Travel",
  "Celebrations",
  "Kids",
  "Holidays",
  "Favorites",
  "Unsorted",
];

export const albumById = (id: string) => ALBUMS.find((a) => a.id === id);

export const LIBRARY_STATS = {
  albums: ALBUMS.length,
  photos: 1846,
  lastOrganized: "today",
};
