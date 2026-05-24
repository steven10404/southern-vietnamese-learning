import fs from "node:fs/promises";

const contentPath = new URL("../data/content.json", import.meta.url);
const manifestPath = new URL("../data/audio-manifest.json", import.meta.url);
const content = JSON.parse(await fs.readFile(contentPath, "utf8"));

const approvedSouthernSources = [
  {
    provider: "FPT.AI",
    voices: ["lannhi", "linhsan"],
    proof: "official docs mark both voices as female southern",
    output: ["mp3", "wav"],
  },
  {
    provider: "Viettel AI",
    voices: ["Southern Accent"],
    proof: "official web UI exposes Southern Accent",
    output: ["mp3", "wav"],
  },
  {
    provider: "Manual recording",
    voices: ["southern native speaker"],
    proof: "human-reviewed before marking verified",
    output: ["mp3", "wav", "webm"],
  },
];

function forvoSearchUrl(text) {
  return `https://forvo.com/search/${encodeURIComponent(text.replace(/[.!?。！？]+$/g, "").trim())}/vi/`;
}

function slug(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "item";
}

const seen = new Set();
const targets = [];

function addTarget(kind, text, meta = {}) {
  const normalized = text.trim();
  if (!normalized || seen.has(`${kind}:${normalized}`)) return;
  seen.add(`${kind}:${normalized}`);
  const index = String(targets.length + 1).padStart(3, "0");
  const id = `${kind}-${index}-${slug(normalized)}`;
  const target = {
    id,
    kind,
    text: normalized,
    localPath: `audio/south/${id}.mp3`,
    status: "needs_southern_audio",
    dialectRequirement: "southern_vietnamese",
    acceptedSources: ["FPT.AI:lannhi", "FPT.AI:linhsan", "ViettelAI:SouthernAccent", "manual:southern_native_verified"],
    rejectedAsVerifiedSource: ["Forvo:unverified_accent"],
    ...meta,
  };
  if (kind === "word") {
    target.forvoReferenceUrl = forvoSearchUrl(normalized);
  }
  targets.push(target);
}

for (const phrase of content.phrases || []) {
  addTarget("phrase", phrase.vn, {
    zh: phrase.zh,
    topic: phrase.topic,
    level: phrase.level,
  });
}

for (const item of content.vocabulary || []) {
  addTarget("word", item.word, {
    zh: item.meaning,
    category: item.category,
    level: item.level,
  });
  addTarget("example", item.example, {
    zh: item.exampleZh,
    sourceWord: item.word,
    category: item.category,
    level: item.level,
  });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  purpose: "Track audio targets for the Southern Vietnamese learning site.",
  policy: {
    verifiedSouthernOnly: true,
    forvoRole: "reference_only_until_a_speaker_is_manually_verified_as_southern",
    browserRule: "Do not expose TTS API keys in frontend code.",
  },
  approvedSouthernSources,
  targetCount: targets.length,
  targets,
};

await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${targets.length} targets to data/audio-manifest.json`);
