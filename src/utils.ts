import { existsSync, mkdirSync, readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { InvalidArgumentError } from "commander";

import { ClaudeSettings } from "#constants";

export function getHeckleDir(): string {
  return join(homedir(), ".heckle");
}

export function ensureHeckleDir(): string {
  const dir = getHeckleDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created ${dir}`);
  }
  return dir;
}

export function ensureClaudeSettings(): { settingsPath: string; settings: ClaudeSettings } {
  const claudeDir = join(process.cwd(), ".claude");
  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true });
    console.log(`Created ${claudeDir}`);
  }
  const settingsPath = join(claudeDir, "settings.json");
  let settings: ClaudeSettings = {};
  if (existsSync(settingsPath)) {
    try {
      settings = readJsonFile<ClaudeSettings>(settingsPath);
    } catch {
      console.warn(`Warning: could not parse existing ${settingsPath}, overwriting.`);
    }
  }
  return { settingsPath, settings };
}

export function getHookCommand(name: string, event: string): string {
  const outputFile = join(getHeckleDir(), `${name}-${event}.ndjson`);
  return `(cat; printf '\\n') >> ${outputFile}`;
}

export function readJsonFile<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

export function parseName(value: string): string {
  const lower = value.toLowerCase();
  if (!/^[a-z0-9_-]+$/.test(lower)) {
    throw new InvalidArgumentError(
      "Name may only contain lowercase letters, numbers, underscores, and dashes."
    );
  }
  return lower;
}
