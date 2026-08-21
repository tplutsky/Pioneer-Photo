import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/SiteChrome";
import { AlbumCover } from "@/components/AlbumCover";
import {
  COLLECTIONS,
  COVERS,
  COVER_COLORS,
  FORMATS,
  MATERIALS,
  type CoverCollection,
  type CoverFormat,
  type CoverMaterial,
} from "@/data/covers";
import { readPrefs, writePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

const TITLE = "Cover Catalog — Pioneer Photo Albums Library";
const DESC =
  "Choose a cover that feels like the memory inside. Official Pioneer product photos plus original CSS/SVG fallbacks, filtered by collection, color, format and material.";

export const Route = createFileRoute("/covers")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoversPage,
});

function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T | "All";
  onChange: (v: T | "All") => void;
}) {
  return (
    <div>
      <h2 className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
        {label}
      </h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["All", ...options] as (T | "All")[]).map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={cn(
              "tactile rounded-full border px-3 py-1.5 text-sm active:translate-y-px",
              value === o
                ? "bg-walnut text-primary-foreground border-walnut"
                : "border-border text-muted-foreground hover:bg-secondary",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function CoversPage() {
  const [collection, setCollection] = useState<CoverCollection | "All">("All");
  const [color, setColor] = useState<string | "All">("All");
  const [format, setFormat] = useState<CoverFormat | "All">("All");
  const [material, setMaterial] = useState<CoverMaterial | "All">("All");
  const [chosen, setChosen] = useState<string>(() => readPrefs().chosenCoverId);

  const list = useMemo(
    () =>
      COVERS.filter(
        (c) =>
          (collection === "All" || c.collection === collection) &&
          (color === "All" || c.color === color) &&
          (material === "All" || c.material === material) &&
          (format === "All" || c.formats.includes(format)),
      ),
    [collection, color, material, format],
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-4xl sm:text-5xl">Choose a cover that feels like the memory inside.</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Forty official Pioneer SKUs, stored with this demo from pioneerphotoalbums.com. Every
          collection, color, format, and material here has a real product. If a photo fails to
          load, a CSS/SVG skin still paints the cover. No retailer scrapes.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Chips label="Collections" options={COLLECTIONS} value={collection} onChange={setCollection} />
          <Chips label="Colors" options={COVER_COLORS} value={color} onChange={setColor} />
          <Chips label="Formats" options={FORMATS} value={format} onChange={setFormat} />
          <Chips label="Material" options={MATERIALS} value={material} onChange={setMaterial} />
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((c) => {
            const active = chosen === c.id;
            return (
              <div key={c.id} className="card-parchment rounded-lg p-4">
                <AlbumCover cover={c} title={c.name} subtitle={c.collection} className="aspect-[3/4] w-full" />
                <h2 className="mt-3 text-base">{c.name}</h2>
                <p className="text-muted-foreground text-xs">
                  {c.material} · {c.style}
                  {c.licensingStatus === "official-pioneer" ? " · Official Pioneer" : ""}
                </p>
                <p className="text-muted-foreground/80 mt-1 text-xs">{c.formats.join(" · ")}</p>
                <button
                  type="button"
                  onClick={() => {
                    setChosen(c.id);
                    writePrefs({ chosenCoverId: c.id });
                    toast.success(`“${c.name}” set as your album cover`, {
                      description: "Saved locally as a demo preference.",
                    });
                  }}
                  className={cn(
                    "tactile mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold active:translate-y-px",
                    active
                      ? "bg-forest text-primary-foreground"
                      : "bg-primary text-primary-foreground hover:shadow-[var(--shadow-lift)]",
                  )}
                >
                  {active ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden /> Current cover
                    </>
                  ) : (
                    "Use this cover"
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="text-muted-foreground mt-16 text-center">
            No covers match those filters yet.
          </p>
        )}

        <div className="border-border mt-16 border-t pt-6">
          <p className="text-muted-foreground text-sm">
            Every card is an official Pioneer SKU (front JPEG in /pioneer/covers). Library
            spines use a matching crop from the same first-party photo. CSS/SVG is fallback
            only.
          </p>
          <Link to="/library" className="text-primary mt-3 inline-block text-sm underline underline-offset-4">
            Back to your library
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
