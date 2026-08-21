/**
 * Client-only demo movie of a sample Album Reveal.
 * Drawn on a canvas and recorded in the browser — nothing is uploaded.
 */

export interface RevealMovieFrame {
  title: string;
  caption?: string;
  hues: number[];
}

export interface RevealMovieOptions {
  albumTitle: string;
  dateRange: string;
  photoCount: number;
  coverBase: string;
  coverShade: string;
  coverInk: string;
  frames: RevealMovieFrame[];
  reducedMotion: boolean;
  onProgress?: (ratio: number) => void;
}

function pickMime(): { mime: string; ext: string } {
  const candidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];
  for (const mime of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime)) {
      return { mime, ext: mime.includes("mp4") ? "mp4" : "webm" };
    }
  }
  return { mime: "", ext: "webm" };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fillParchment(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#f4ead4");
  g.addColorStop(1, "#e8d8b8");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(80, 52, 28, 0.04)";
  for (let i = 0; i < 40; i += 1) {
    ctx.fillRect(0, i * 18, w, 1);
  }
}

function drawPhotoCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  hue: number,
  caption: string,
) {
  ctx.save();
  ctx.fillStyle = "#f7f1e4";
  roundRect(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(80, 52, 28, 0.18)";
  ctx.stroke();

  const pad = 14;
  const ph = h - 48;
  const sky = `hsl(${hue} 42% 78%)`;
  const mid = `hsl(${(hue + 18) % 360} 34% 52%)`;
  const pg = ctx.createLinearGradient(x, y, x, y + ph);
  pg.addColorStop(0, sky);
  pg.addColorStop(1, mid);
  ctx.fillStyle = pg;
  ctx.fillRect(x + pad, y + pad, w - pad * 2, ph - pad);

  ctx.fillStyle = `hsl(${(hue + 200) % 360} 28% 32%)`;
  ctx.beginPath();
  ctx.moveTo(x + pad, y + pad + ph * 0.72);
  ctx.lineTo(x + pad + w * 0.35, y + pad + ph * 0.48);
  ctx.lineTo(x + w - pad, y + pad + ph * 0.7);
  ctx.lineTo(x + w - pad, y + pad + ph - pad);
  ctx.lineTo(x + pad, y + pad + ph - pad);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "hsl(45 90% 78%)";
  ctx.beginPath();
  ctx.arc(x + w * 0.72, y + pad + 22, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#5a4a34";
  ctx.font = "22px Caveat, 'Segoe Script', cursive";
  ctx.textAlign = "center";
  ctx.fillText(caption, x + w / 2, y + h - 14, w - 16);
  ctx.restore();
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: RevealMovieOptions,
) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, opts.coverBase);
  g.addColorStop(1, opts.coverShade);
  ctx.fillStyle = g;
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(216, 177, 105, 0.7)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + w * 0.12, y + h * 0.28, w * 0.76, h * 0.34);
  ctx.fillStyle = opts.coverInk;
  ctx.textAlign = "center";
  ctx.font = "600 28px Fraunces, Georgia, serif";
  ctx.fillText(opts.albumTitle, x + w / 2, y + h * 0.44, w * 0.7);
  ctx.font = "14px Karla, sans-serif";
  ctx.fillStyle = "rgba(216, 177, 105, 0.95)";
  ctx.fillText(opts.dateRange, x + w / 2, y + h * 0.52, w * 0.7);
}

export async function exportAlbumRevealMovie(opts: RevealMovieOptions): Promise<{
  blob: Blob;
  filename: string;
}> {
  if (typeof document === "undefined" || typeof MediaRecorder === "undefined") {
    throw new Error("This browser cannot save a short movie.");
  }

  const { mime, ext } = pickMime();
  if (!mime) {
    throw new Error("This browser cannot save a short movie. Play the Album Reveal instead.");
  }

  const W = 1280;
  const H = 720;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not open a drawing surface.");

  let logo: HTMLImageElement | null = null;
  try {
    logo = await loadImage("/pioneer/logo-wagon.jpg");
  } catch {
    logo = null;
  }

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const hold = opts.reducedMotion ? 1400 : 900;
  const scenes = 2 + Math.min(opts.frames.length, 3) + 1;
  const totalMs = scenes * hold;
  const started = performance.now();

  const wordmark = "Pioneer Photo Albums Library";

  function chrome() {
    fillParchment(ctx!, W, H);
    if (logo) {
      ctx!.drawImage(logo, 36, 28, 56, 44);
    }
    ctx!.fillStyle = "#3a2a1c";
    ctx!.font = "600 18px Karla, sans-serif";
    ctx!.textAlign = "left";
    ctx!.fillText(wordmark, logo ? 104 : 36, 56);
    ctx!.fillStyle = "rgba(90, 74, 52, 0.7)";
    ctx!.font = "13px Karla, sans-serif";
    ctx!.fillText("Sample album · demo content", logo ? 104 : 36, 76);
  }

  function drawScene(elapsed: number) {
    const idx = Math.min(scenes - 1, Math.floor(elapsed / hold));
    chrome();

    if (idx === 0) {
      ctx!.fillStyle = "#3a2a1c";
      ctx!.font = "600 48px Fraunces, Georgia, serif";
      ctx!.textAlign = "center";
      ctx!.fillText("Album Reveal", W / 2, 250);
      ctx!.font = "28px Fraunces, Georgia, serif";
      ctx!.fillText(opts.albumTitle, W / 2, 310);
      ctx!.fillStyle = "#8a6a32";
      ctx!.font = "16px Karla, sans-serif";
      ctx!.fillText(`${opts.dateRange}  ·  ${opts.photoCount} photos`, W / 2, 350);
      return;
    }

    if (idx === 1) {
      drawCover(ctx!, W / 2 - 170, 130, 340, 460, opts);
      return;
    }

    if (idx === scenes - 1) {
      ctx!.fillStyle = "#3a2a1c";
      ctx!.font = "600 40px Fraunces, Georgia, serif";
      ctx!.textAlign = "center";
      ctx!.fillText("Your photos stay on your device.", W / 2, 300);
      ctx!.font = "18px Karla, sans-serif";
      ctx!.fillStyle = "#5a4a34";
      ctx!.fillText("This demo does not upload or store your originals.", W / 2, 344);
      ctx!.font = "16px Karla, sans-serif";
      ctx!.fillText(wordmark, W / 2, 420);
      return;
    }

    const frame = opts.frames[idx - 2];
    if (!frame) return;
    ctx!.fillStyle = "#3a2a1c";
    ctx!.font = "600 22px Fraunces, Georgia, serif";
    ctx!.textAlign = "center";
    ctx!.fillText(frame.title, W / 2, 118);

    const cards = Math.min(2, frame.hues.length || 1);
    const cardW = 420;
    const cardH = 300;
    const gap = 36;
    const startX = (W - cards * cardW - (cards - 1) * gap) / 2;
    for (let i = 0; i < cards; i += 1) {
      drawPhotoCard(
        ctx!,
        startX + i * (cardW + gap),
        170,
        cardW,
        cardH,
        frame.hues[i] ?? 40,
        frame.caption ?? "A page from the album",
      );
    }
  }

  const done = new Promise<Blob>((resolve, reject) => {
    recorder.onerror = () => reject(new Error("Could not record the movie."));
    recorder.onstop = () => resolve(new Blob(chunks, { type: mime }));
  });

  recorder.start(120);

  await new Promise<void>((resolve) => {
    const tick = (now: number) => {
      const elapsed = now - started;
      drawScene(elapsed);
      opts.onProgress?.(Math.min(1, elapsed / totalMs));
      if (elapsed >= totalMs) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  if (recorder.state !== "inactive") recorder.stop();
  stream.getTracks().forEach((t) => t.stop());

  const blob = await done;
  const slug = opts.albumTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return { blob, filename: `${slug || "album"}-reveal-demo.${ext}` };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
}
