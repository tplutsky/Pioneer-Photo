import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Undo2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageShell, PrivacyBanner } from "@/components/SiteChrome";
import { SamplePhoto } from "@/components/SamplePhoto";
import { AlbumCover } from "@/components/AlbumCover";
import { getCover } from "@/data/covers";
import { PHOTOS, photoById } from "@/data/photos";
import { readPrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

const TITLE = "Organize — Pioneer Photo Albums Library";
const DESC =
  "Let's make an album. Review demo smart groupings by week, place, people and occasion, then drag memories into a beautiful album. Photos never leave your device.";

export const Route = createFileRoute("/organize")({
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
  component: OrganizePage,
});

const GROUPS: { label: string; ids: string[] }[] = [
  { label: "Same week", ids: ["p04", "p17", "p10", "p29"] },
  { label: "Similar location", ids: ["p08", "p18", "p23"] },
  { label: "Possible birthday", ids: ["p09", "p27"] },
  { label: "Beach / outdoor", ids: ["p32", "p25", "p11"] },
  { label: "Same people", ids: ["p02", "p16", "p28"] },
  { label: "Likely holiday", ids: ["p12", "p22", "p31", "p03"] },
];

interface LocalPreview {
  id: string;
  name: string;
  url: string;
}

function OrganizePage() {
  const reduced = useReducedMotion();
  const [inbox, setInbox] = useState<string[]>(PHOTOS.map((p) => p.id));
  const [selected, setSelected] = useState<string[]>([]);
  const [album, setAlbum] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [albumName, setAlbumName] = useState("Untitled Album");
  const [dateRange, setDateRange] = useState("");
  const [tags, setTags] = useState("");
  const [history, setHistory] = useState<{ inbox: string[]; album: string[] }[]>([]);
  const [shelved, setShelved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previews, setPreviews] = useState<LocalPreview[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const coverId = typeof window !== "undefined" ? readPrefs().chosenCoverId : "burgundy-gold-frame";

  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  const push = useCallback(
    (nextInbox: string[], nextAlbum: string[]) => {
      setHistory((h) => [...h.slice(-19), { inbox, album }]);
      setInbox(nextInbox);
      setAlbum(nextAlbum);
    },
    [inbox, album],
  );

  function addIds(ids: string[]) {
    const fresh = ids.filter((i) => !album.includes(i));
    if (fresh.length === 0) return;
    push(
      inbox.filter((i) => !fresh.includes(i)),
      [...album, ...fresh],
    );
    setSelected([]);
  }

  function undo() {
    const last = history[history.length - 1];
    if (!last) return;
    setInbox(last.inbox);
    setAlbum(last.album);
    setHistory((h) => h.slice(0, -1));
  }

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const next: LocalPreview[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 24)
      .map((f) => ({ id: `${f.name}-${f.size}-${Math.random()}`, name: f.name, url: URL.createObjectURL(f) }));
    setPreviews((p) => [...p, ...next]);
    toast.success(`${next.length} local preview${next.length === 1 ? "" : "s"} added`, {
      description: "Temporary in-browser previews. Nothing is uploaded or stored.",
    });
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-4xl sm:text-5xl">Let's make an album.</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Pull photos out of the inbox, accept a grouping, or drag your own files in for a
          temporary preview.
        </p>
        <div className="mt-4">
          <PrivacyBanner />
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            onFiles(e.dataTransfer.files);
          }}
          className={cn(
            "mt-8 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            dragOver ? "border-gold bg-secondary" : "border-border bg-card/60",
          )}
        >
          <Upload className="text-muted-foreground mx-auto h-6 w-6" aria-hidden />
          <p className="mt-3 text-sm font-medium">Drag photos here, or choose them from your device</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="bg-walnut text-primary-foreground tactile mt-4 rounded-md px-5 py-2.5 text-sm font-semibold active:translate-y-px"
          >
            Choose photos
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => onFiles(e.target.files)}
          />
          <p className="text-muted-foreground mt-3 text-xs">
            Previews are temporary in-browser links only. Nothing is uploaded, nothing is stored.
          </p>
          {previews.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {previews.map((p) => (
                <img
                  key={p.id}
                  src={p.url}
                  alt={`Local preview of ${p.name}`}
                  className="border-border h-20 w-28 rounded-sm border object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr_1fr]">
          <section className="card-parchment rounded-lg p-5">
            <h2 className="text-xl">Inbox</h2>
            <p className="text-muted-foreground text-xs">{inbox.length} sample photos waiting</p>
            {inbox.length === 0 ? (
              <p className="hand text-secondary-foreground mt-8 text-center text-xl">
                Somewhere in here is a memory worth framing.
              </p>
            ) : (
              <div className="mt-4 grid max-h-[420px] grid-cols-3 gap-2 overflow-y-auto pr-1">
                {inbox.map((id) => {
                  const p = photoById(id)!;
                  const on = selected.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", id)}
                      aria-pressed={on}
                      onClick={() => setSelected((s) => (on ? s.filter((x) => x !== id) : [...s, id]))}
                      className={cn(
                        "tactile relative rounded-sm border-2 p-0.5",
                        on ? "border-gold" : "border-transparent",
                      )}
                      title={p.caption}
                    >
                      <SamplePhoto photo={p} className="aspect-[4/3] w-full" />
                      {favorites.includes(id) && (
                        <Star className="text-gold absolute top-1 right-1 h-4 w-4 fill-current" aria-hidden />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addIds(selected)}
                disabled={selected.length === 0}
                className="bg-primary text-primary-foreground tactile rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Add {selected.length || ""} to album
              </button>
              <button
                type="button"
                onClick={() => setFavorites((f) => Array.from(new Set([...f, ...selected])))}
                disabled={selected.length === 0}
                className="border-border tactile rounded-md border px-3 py-2 text-sm disabled:opacity-40"
              >
                Favorite
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelected([]);
                  toast("Left in To Be Sorted", { description: "You can come back to these any time." });
                }}
                disabled={selected.length === 0}
                className="border-border tactile rounded-md border px-3 py-2 text-sm disabled:opacity-40"
              >
                To Be Sorted
              </button>
              <button
                type="button"
                onClick={undo}
                disabled={history.length === 0}
                className="border-border tactile inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm disabled:opacity-40"
              >
                <Undo2 className="h-4 w-4" aria-hidden /> Undo
              </button>
            </div>
          </section>

          <section className="card-parchment rounded-lg p-5">
            <h2 className="text-xl">Suggested groupings</h2>
            <p className="text-muted-foreground text-xs">
              Demo smart suggestions — simple date, place and occasion rules, not AI.
            </p>
            <div className="mt-4 space-y-3">
              {GROUPS.map((g) => (
                <div key={g.label} className="border-border rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{g.label}</h3>
                    <button
                      type="button"
                      onClick={() => addIds(g.ids)}
                      className="bg-walnut text-primary-foreground tactile rounded-md px-3 py-1.5 text-xs font-semibold active:translate-y-px"
                    >
                      Add group
                    </button>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    {g.ids.map((id) => {
                      const p = photoById(id);
                      return p ? <SamplePhoto key={id} photo={p} className="h-10 w-14" /> : null
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              if (id) addIds([id]);
            }}
            className="card-parchment rounded-lg p-5"
          >
            <h2 className="text-xl">Selected album</h2>
            <div className="mt-3 space-y-2">
              <input
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                aria-label="Album name"
                className="border-border bg-card w-full rounded-md border px-3 py-2 text-sm"
              />
              <input
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="Date range, e.g. July 2019"
                aria-label="Date range"
                className="border-border bg-card w-full rounded-md border px-3 py-2 text-sm"
              />
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags, comma separated"
                aria-label="Tags"
                className="border-border bg-card w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              {album.length} photos placed · drop photos here
            </p>
            <div className="mt-3 grid min-h-[120px] grid-cols-3 gap-2">
              {album.map((id) => {
                const p = photoById(id);
                return p ? <SamplePhoto key={id} photo={p} className="aspect-[4/3] w-full" /> : null
              })}
            </div>
            <button
              type="button"
              disabled={album.length === 0}
              onClick={() => setShelved(true)}
              className="bg-primary text-primary-foreground tactile mt-4 w-full rounded-md px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
            >
              Shelve this album
            </button>
          </section>
        </div>

        {shelved && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0.3 } : { type: "spring", stiffness: 100, damping: 15 }}
            className="card-parchment paper-grain mt-12 grid items-center gap-8 rounded-lg p-8 md:grid-cols-[240px_1fr]"
          >
            <AlbumCover
              cover={getCover(coverId)}
              title={albumName}
              subtitle={dateRange || "New chapter"}
              className="aspect-[3/4] w-full"
            />
            <div>
              <h2 className="text-3xl">Another chapter, beautifully shelved.</h2>
              <p className="text-muted-foreground mt-2">
                {album.length} photos, {tags ? `tagged ${tags}, ` : ""}ready to open.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/album/$id"
                  params={{ id: "summer-coast" }}
                  search={{ reveal: true }}
                  className="bg-walnut text-primary-foreground tactile rounded-md px-5 py-2.5 text-sm font-semibold active:translate-y-px"
                >
                  See an Album Reveal
                </Link>
                <Link
                  to="/waitlist"
                  className="bg-primary text-primary-foreground tactile rounded-md px-5 py-2.5 text-sm font-semibold active:translate-y-px"
                >
                  Loved it? Be first to organize your own.
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
