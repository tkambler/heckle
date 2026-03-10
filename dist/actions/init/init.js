import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { execSync } from "child_process";
import { HOOK_EVENTS } from "../../constants.js";
export function runInit(options) {
    const { name } = options;
    try {
        execSync("git rev-parse --git-dir", { cwd: process.cwd(), stdio: "ignore" });
    }
    catch {
        console.error("Error: heckle init must be run inside a git repository.");
        process.exit(1);
    }
    const heckleDir = join(homedir(), ".heckle");
    if (!existsSync(heckleDir)) {
        mkdirSync(heckleDir, { recursive: true });
        console.log(`Created ${heckleDir}`);
    }
    const claudeDir = join(process.cwd(), ".claude");
    if (!existsSync(claudeDir)) {
        mkdirSync(claudeDir, { recursive: true });
        console.log(`Created ${claudeDir}`);
    }
    const settingsPath = join(claudeDir, "settings.json");
    let settings = {};
    if (existsSync(settingsPath)) {
        try {
            settings = JSON.parse(readFileSync(settingsPath, "utf-8"));
        }
        catch {
            console.warn(`Warning: could not parse existing ${settingsPath}, overwriting.`);
        }
    }
    settings.hooks ??= {};
    for (const event of HOOK_EVENTS) {
        const outputFile = join(heckleDir, `${name}-${event}.ndjson`);
        const heckleCommand = `(cat; printf '\\n') >> ${outputFile}`;
        const existing = settings.hooks[event] ?? [];
        const filtered = existing.filter((entry) => !entry.hooks.some((h) => h.command === heckleCommand));
        settings.hooks[event] = [
            ...filtered,
            { hooks: [{ type: "command", command: heckleCommand }] },
        ];
    }
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
    console.log(`Wrote hooks to ${settingsPath}`);
}
//# sourceMappingURL=init.js.map