/**
 * Sample photo set — 30+ ORIGINAL abstract, photo-like placeholders.
 * Each entry is rendered as layered CSS/SVG by <SamplePhoto />.
 * No real people, no copyrighted or commercial imagery, nothing hotlinked.
 */

export type PhotoCategory =
  | "landscape"
  | "family-moment"
  | "holiday"
  | "travel"
  | "food"
  | "baby"
  | "outdoor";

export interface SamplePhotoDef {
  id: string;
  category: PhotoCategory;
  caption: string;
  date: string;
  place: string;
  people: string[];
  tags: string[];
  /** Base hue for the generated abstract scene. */
  hue: number;
  seed: number;
  favorite?: boolean;
}

const mk = (
  id: string,
  category: PhotoCategory,
  caption: string,
  date: string,
  place: string,
  people: string[],
  tags: string[],
  hue: number,
  seed: number,
  favorite = false,
): SamplePhotoDef => ({ id, category, caption, date, place, people, tags, hue, seed, favorite });

export const PHOTOS: SamplePhotoDef[] = [
  mk("p01", "landscape", "The long road home", "1989-06-11", "Blue Ridge", [], ["road", "summer"], 32, 1),
  mk("p02", "family-moment", "Everyone squeezed onto the porch", "1989-06-12", "Grandma's house", ["Mom", "Dad", "Nan"], ["porch", "family"], 28, 2, true),
  mk("p03", "holiday", "The tree, finally lit", "1991-12-24", "Home", ["Dad"], ["christmas"], 12, 3),
  mk("p04", "travel", "First morning in a new city", "2023-04-03", "Kyoto", ["Sam"], ["japan", "spring"], 340, 4),
  mk("p05", "food", "Sunday sauce on the stove", "2024-02-11", "Kitchen", ["Mom"], ["dinner"], 25, 5),
  mk("p06", "baby", "Nine days old", "2021-03-20", "Home", ["Mia"], ["newborn"], 200, 6, true),
  mk("p07", "outdoor", "Backyard, before the rain", "2016-05-02", "Home", ["Sam", "Jo"], ["yard"], 140, 7),
  mk("p08", "landscape", "Low tide, long light", "2019-07-14", "Cape Shore", [], ["beach", "coast"], 210, 8, true),
  mk("p09", "family-moment", "Candles and a bad singing voice", "2017-09-09", "Home", ["Jo", "Mom"], ["birthday"], 40, 9),
  mk("p10", "travel", "Train window blur", "2023-04-05", "Osaka line", ["Sam"], ["japan", "train"], 220, 10),
  mk("p11", "outdoor", "Somebody found a frog", "2016-06-18", "Creek", ["Jo"], ["kids", "creek"], 150, 11),
  mk("p12", "holiday", "Paper crowns at the table", "2022-12-25", "Home", ["Mom", "Dad", "Mia"], ["christmas"], 8, 12),
  mk("p13", "food", "Peaches on the windowsill", "2024-07-30", "Kitchen", [], ["summer", "fruit"], 55, 13),
  mk("p14", "landscape", "Fog over the hill road", "1990-10-06", "County line", [], ["autumn"], 90, 14),
  mk("p15", "baby", "First real laugh", "2021-08-02", "Living room", ["Mia"], ["milestone"], 320, 15, true),
  mk("p16", "family-moment", "Four generations, one couch", "2015-11-26", "Grandma's house", ["Nan", "Mom", "Jo"], ["family"], 30, 16),
  mk("p17", "travel", "Blossoms and a paper map", "2023-04-07", "Kyoto", ["Sam"], ["japan", "spring"], 350, 17, true),
  mk("p18", "outdoor", "Kite that never quite flew", "2019-07-16", "Cape Shore", ["Jo"], ["beach"], 195, 18),
  mk("p19", "food", "The good plates, for no reason", "2024-03-17", "Dining room", [], ["dinner"], 20, 19),
  mk("p20", "landscape", "Sunset over the parking lot", "2025-05-05", "Town", [], ["everyday"], 45, 20),
  mk("p21", "family-moment", "Reading the same page twice", "2025-01-19", "Home", ["Mia", "Dad"], ["quiet"], 260, 21),
  mk("p22", "holiday", "Sparklers, slightly out of focus", "2022-07-04", "Driveway", ["Jo", "Sam"], ["fourth"], 65, 22),
  mk("p23", "travel", "Ferry deck, cold hands", "2019-07-19", "Harbor", ["Mom"], ["boat"], 230, 23),
  mk("p24", "baby", "Tiny socks on the radiator", "2021-01-30", "Home", [], ["newborn"], 15, 24),
  mk("p25", "outdoor", "Trail markers and wet boots", "2018-10-14", "Ridge Trail", ["Sam"], ["hike"], 130, 25),
  mk("p26", "landscape", "Field that goes on forever", "1987-08-21", "Farm road", [], ["vintage"], 75, 26),
  mk("p27", "food", "Birthday cake, homemade lean", "2017-09-09", "Kitchen", ["Mom"], ["birthday"], 350, 27),
  mk("p28", "family-moment", "Nobody looking at the camera", "2024-11-28", "Dining room", ["Mom", "Dad", "Jo", "Mia"], ["thanksgiving"], 35, 28, true),
  mk("p29", "travel", "Lanterns after the rain", "2023-04-09", "Gion", ["Sam"], ["japan", "night"], 25, 29),
  mk("p30", "outdoor", "First snow, last patience", "2022-01-08", "Front yard", ["Jo", "Mia"], ["snow"], 215, 30),
  mk("p31", "holiday", "Easter eggs in tall grass", "2025-04-20", "Backyard", ["Mia"], ["easter"], 110, 31),
  mk("p32", "landscape", "Storm coming in sideways", "2018-08-30", "Coast road", [], ["weather"], 240, 32),
  mk("p33", "baby", "Asleep mid-sentence", "2021-11-11", "Car seat", ["Mia"], ["nap"], 285, 33),
  mk("p34", "family-moment", "Kitchen dancing", "2025-06-14", "Kitchen", ["Mom", "Mia"], ["everyday"], 50, 34),
  mk("p35", "food", "Coffee, second cup", "2025-02-02", "Home", [], ["morning"], 38, 35),
];

export const photoById = (id: string) => PHOTOS.find((p) => p.id === id);
