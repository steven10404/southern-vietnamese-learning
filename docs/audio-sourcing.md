# Southern Vietnamese Audio Sourcing

This project treats Southern Vietnamese audio as a verified asset, not a loose label.

## Source Tiers

1. Verified Southern TTS
   - FPT.AI voices: `lannhi`, `linhsan`
   - Viettel AI voice group: `Southern Accent`
   - Use these for bulk phrase and vocabulary audio.

2. Verified Human Recording
   - A native Southern Vietnamese speaker records or reviews the clip.
   - Mark it as verified only after listening for Southern features such as `d/gi` near `y`, softer final consonants, and Southern lexical choices where relevant.

3. Reference Only
   - Forvo is useful for comparing real human voices, but it does not reliably label North/South accent.
   - Do not mark a Forvo clip as Southern until the specific speaker/clip is manually checked.

## Local File Convention

Generated or approved files should live under:

```text
audio/south/
```

Use the generated manifest path for filenames:

```text
data/audio-manifest.json
```

Each target has:

- `text`: phrase, word, or example sentence
- `localPath`: where the final MP3 should be stored
- `acceptedSources`: sources that can count as Southern
- `forvoReferenceUrl`: human reference search, not automatic approval

## Safe Integration Rule

Never put FPT, Viettel, Zalo, or other TTS API keys in browser JavaScript. Use a local script or server-side proxy, then cache the resulting audio files locally.

## Current Next Step

Run the manifest generator after content changes:

```powershell
node scripts/prepare-audio-manifest.mjs
```

Then generate a small pilot batch first, ideally 20 to 30 high-value items, and listen before creating the full library.
