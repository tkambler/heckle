import { writeFileSync } from "fs";
import { execSync } from "child_process";

import { HOOK_EVENTS } from "#constants";
import { ensureHeckleDir, ensureClaudeSettings, getHookCommand } from "#utils";

export function runInit(options: { name: string }) {
  const { name } = options;

  try {
    execSync("git rev-parse --git-dir", { cwd: process.cwd(), stdio: "ignore" });
  } catch {
    console.error("Error: heckle init must be run inside a git repository.");
    process.exit(1);
  }

  ensureHeckleDir();
  const { settingsPath, settings } = ensureClaudeSettings();

  settings.hooks ??= {};

  for (const event of HOOK_EVENTS) {
    const heckleCommand = getHookCommand(name, event);
    const existing = settings.hooks[event] ?? [];
    const filtered = existing.filter(
      (entry) => !entry.hooks.some((h) => h.command === heckleCommand)
    );
    settings.hooks[event] = [
      ...filtered,
      { hooks: [{ type: "command", command: heckleCommand }] },
    ];
  }

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
  console.log(`Wrote hooks to ${settingsPath}`);
}
