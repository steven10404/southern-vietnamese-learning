import fs from "node:fs/promises";

const contentPath = new URL("../data/content.json", import.meta.url);
const manifestPath = new URL("../data/audio-manifest.json", import.meta.url);
const rootUrl = new URL("../", import.meta.url);

const content = JSON.parse(await fs.readFile(contentPath, "utf8"));
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

async function exists(relativePath) {
  try {
    await fs.access(new URL(relativePath, rootUrl));
    return true;
  } catch {
    return false;
  }
}

function audioConfig(target) {
  return {
    src: target.localPath,
    dialect: "southern",
    verified: true,
    provider: "verified_local",
  };
}

let linked = 0;

for (const target of manifest.targets || []) {
  if (!(await exists(target.localPath))) continue;

  if (target.kind === "phrase") {
    const phrase = content.phrases?.find((item) => item.vn === target.text);
    if (phrase) {
      phrase.audio = audioConfig(target);
      linked += 1;
    }
  }

  if (target.kind === "word") {
    const item = content.vocabulary?.find((entry) => entry.word === target.text);
    if (item) {
      item.audio = audioConfig(target);
      linked += 1;
    }
  }

  if (target.kind === "example") {
    const item = content.vocabulary?.find((entry) => entry.example === target.text);
    if (item) {
      item.exampleAudio = audioConfig(target);
      linked += 1;
    }
  }
}

await fs.writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
console.log(`Linked ${linked} verified Southern audio files.`);
