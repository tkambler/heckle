import { existsSync, writeFileSync } from "fs";
import { join } from "path";

import { ClaudeSettings, HOOK_EVENTS } from "#constants";
import { getHookCommand, readJsonFile } from "#utils";

export function runUninit(options: { name: string }) {
  const { name } = options;

  const settingsPath = join(process.cwd(), ".claude", "settings.json");

  if (!existsSync(settingsPath)) {
    console.log("No .claude/settings.json found, nothing to do.");
    return;
  }

  let settings: ClaudeSettings;
  try {
    settings = readJsonFile<ClaudeSettings>(settingsPath);
  } catch {
    console.error(`Error: could not parse ${settingsPath}`);
    process.exit(1);
  }

  if (!settings.hooks) {
    console.log("No hooks found, nothing to do.");
    return;
  }

  for (const event of HOOK_EVENTS) {
    const heckleCommand = getHookCommand(name, event);
    const existing = settings.hooks[event];
    if (!existing) continue;
    const filtered = existing.filter(
      (entry) => !entry.hooks.some((h) => h.command === heckleCommand)
    );
    if (filtered.length === 0) {
      delete settings.hooks[event];
    } else {
      settings.hooks[event] = filtered;
    }
  }

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
  console.log(`Removed heckle hooks from ${settingsPath}`);
}
