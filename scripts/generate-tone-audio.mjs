import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const sampleRate = 44100;
const duration = 1.05;
const amplitude = 0.28;
const outDir = join(process.cwd(), "audio", "reference");

const contours = [
  ["tone-ngang.wav", [[0, 220], [1, 220]]],
  ["tone-huyen.wav", [[0, 215], [1, 150]]],
  ["tone-sac.wav", [[0, 190], [1, 285]]],
  ["tone-hoi-nga.wav", [[0, 200], [0.42, 155], [1, 260]]],
  ["tone-nang.wav", [[0, 185], [0.45, 125], [1, 145]]],
];

function interpolate(points, t) {
  for (let i = 0; i < points.length - 1; i += 1) {
    const [leftT, leftHz] = points[i];
    const [rightT, rightHz] = points[i + 1];
    if (t >= leftT && t <= rightT) {
      const pct = (t - leftT) / (rightT - leftT);
      return leftHz + (rightHz - leftHz) * pct;
    }
  }
  return points[points.length - 1][1];
}

function writeWav(fileName, points) {
  const frameCount = Math.floor(sampleRate * duration);
  const dataSize = frameCount * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  let phase = 0;

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < frameCount; i += 1) {
    const t = i / frameCount;
    const fade = Math.min(1, i / 900, (frameCount - i) / 1200);
    const hz = interpolate(points, t);
    phase += (2 * Math.PI * hz) / sampleRate;
    const sample = Math.sin(phase) * amplitude * fade;
    buffer.writeInt16LE(Math.max(-1, Math.min(1, sample)) * 32767, 44 + i * 2);
  }

  mkdirSync(dirname(join(outDir, fileName)), { recursive: true });
  writeFileSync(join(outDir, fileName), buffer);
}

mkdirSync(outDir, { recursive: true });
for (const [fileName, points] of contours) {
  writeWav(fileName, points);
}

console.log(`Generated ${contours.length} tone reference files in ${outDir}`);
