// Renders one piece (a reel or a long video) with Remotion. Python calls it (src/marketmedia/
// remotion.py) after working out the film: which scenes, how long each, their voices and when each
// word is said (props.json). Rendering is local: Chrome Headless Shell on this machine, no cloud.
//
//   node remotion/render.mjs --piece reels/2026-11-09-jensen-huang --props <json> --public <dir>
//        [--out build/reel.mp4] [--stills build/short-frames] [--frames 120,240]
//
// --out makes the film; --stills leaves one PNG per scene, as it stands when its narration ends
// (the one to look at, and a reel's cover); --frames adds PNGs of those frames of the film.
import { bundle } from "@remotion/bundler";
import { ensureBrowser, renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, word, i, all) => (word.startsWith("--") ? [...pairs, [word.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]] : pairs), []),
);
const say = (line) => process.stdout.write(`${line}\n`);
const fail = (line) => { process.stderr.write(`${line}\n`); process.exit(1); };

if (!args.piece || !args.props || !args.public) fail("usage: render.mjs --piece <folder> --props <json> --public <dir> [--out <mp4>] [--stills <dir>] [--frames 1,2]");
const piece = path.resolve(args.piece);
const props = JSON.parse(fs.readFileSync(args.props, "utf-8"));

// The entry of this piece: its scenes, each the default export of slides/<scene>.tsx.
const work = path.join(piece, "build", "remotion");
fs.mkdirSync(work, { recursive: true });
const posix = (p) => p.split(path.sep).join("/");
const names = props.scenes.map((s) => s.name);
const lines = [`import { registerRoot } from "remotion";`, `import { makeRoot } from ${JSON.stringify(posix(path.join(HERE, "src", "root.tsx")))};`];
names.forEach((name, i) => {
  const file = path.join(piece, "slides", `${name}.tsx`);
  if (!fs.existsSync(file)) fail(`no slides/${name}.tsx in ${path.basename(piece)}`);
  lines.push(`import S${i} from ${JSON.stringify(posix(file))};`);
});
lines.push(`registerRoot(makeRoot({ ${names.map((n, i) => `${JSON.stringify(n)}: S${i}`).join(", ")} }));`);
const entry = path.join(work, "entry.tsx");
fs.writeFileSync(entry, lines.join("\n") + "\n");

const modules = path.join(HERE, "node_modules");
const started = Date.now();
const serveUrl = await bundle({
  entryPoint: entry,
  publicDir: path.resolve(args.public),
  outDir: path.join(work, "bundle"),
  // Webpack's cache keeps hundreds of MB per piece in .cache/ at the repo's root; a bundle takes a few seconds without it.
  enableCaching: false,
  // The slides live outside this folder: they find Remotion, React and the kit here.
  webpackOverride: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      modules: [modules, ...(config.resolve?.modules ?? ["node_modules"])],
      alias: { ...(config.resolve?.alias ?? {}), "@mh/kit": path.join(HERE, "src", "kit", "index.ts") },
    },
    resolveLoader: { ...(config.resolveLoader ?? {}), modules: [modules, ...(config.resolveLoader?.modules ?? ["node_modules"])] },
  }),
});
say(`  bundled in ${((Date.now() - started) / 1000).toFixed(1)} s`);

await ensureBrowser();
const missing = new Set();
const onBrowserLog = (log) => {
  const found = /^mh-missing (\S+) (.*)$/.exec(log.text);
  if (found) missing.add(`${found[1]}: waits for ${found[2]}, which its narration does not say`);
  else if (log.type === "error") say(`  page error: ${log.text}`);
};
const composition = await selectComposition({ serveUrl, id: "Film", inputProps: props, onBrowserLog });
const concurrency = Math.max(1, Math.min(8, Math.floor(os.cpus().length * 0.75)));

if (args.out) {
  let shown = -1;
  const t0 = Date.now();
  await renderMedia({
    composition, serveUrl, inputProps: props, codec: "h264", audioCodec: "aac", audioBitrate: "192k",
    pixelFormat: "yuv420p", crf: 18, x264Preset: "medium", outputLocation: path.resolve(args.out), concurrency, onBrowserLog,
    onProgress: ({ progress }) => {
      const tenth = Math.floor(progress * 10);
      if (tenth > shown) { shown = tenth; say(`  ${tenth * 10} %`); }
    },
  });
  say(`  ${path.relative(process.cwd(), path.resolve(args.out))}: ${composition.durationInFrames} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}

const still = async (frame, file) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await renderStill({ composition, serveUrl, inputProps: props, frame, output: file, imageFormat: "png", onBrowserLog });
};
if (args.stills) {
  const last = composition.durationInFrames - 1;
  for (const s of props.scenes) {
    // As its narration ends, before the next scene covers it.
    const frame = Math.min(last, Math.round((s.start + Math.min(s.spoken, s.seconds)) * props.fps) - 1);
    await still(Math.max(0, frame), path.join(path.resolve(args.stills), `${s.name}.png`));
  }
  say(`  ${props.scenes.length} stills in ${path.relative(process.cwd(), path.resolve(args.stills))}/`);
}
if (typeof args.frames === "string") {
  for (const n of args.frames.split(",").map(Number).filter(Number.isFinite)) {
    await still(n, path.join(work, "frames", `${String(n).padStart(5, "0")}.png`));
  }
}
for (const line of missing) say(`  ${line}`);
