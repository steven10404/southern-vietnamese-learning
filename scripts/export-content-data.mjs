import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync("app.js", "utf8");
const prefix = source.slice(0, source.indexOf("let activeLesson"));
const sandbox = {};

runInNewContext(`${prefix}\nglobalThis.content = { tones, rules, routine, lessons, phrases, sources };`, sandbox);

mkdirSync("data", { recursive: true });
writeFileSync("data/content.json", `${JSON.stringify(sandbox.content, null, 2)}\n`, "utf8");

console.log("Exported data/content.json");
