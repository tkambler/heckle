import { existsSync, readFileSync } from "fs";
import { homedir, EOL } from "os";
import { join } from "path";
import { spawn, execSync } from "child_process";
function readNewLines(filePath, positions) {
    if (!existsSync(filePath))
        return [];
    const content = readFileSync(filePath, "utf-8");
    const prevLen = positions.get(filePath) ?? 0;
    positions.set(filePath, content.length);
    return content.slice(prevLen).split("\n").filter((l) => l.trim());
}
function getGitDiff(projectDir) {
    const opts = { cwd: projectDir, encoding: "utf-8" };
    try {
        let base = null;
        for (const branch of ["main", "master"]) {
            try {
                base = execSync(`git merge-base HEAD ${branch}`, opts).trim();
                break;
            }
            catch { /* try next */ }
        }
        const diff = execSync(base ? `git diff ${base}` : "git diff HEAD", opts);
        return diff.slice(0, 8000);
    }
    catch {
        return "";
    }
}
function buildPrompt(prompts, diff, persona) {
    const activity = prompts.map((p) => `"${p}"`).join("\n");
    const intro = persona
        ? `You are ${persona}, and you have been forced to watch someone fumble through using Claude Code to write software. Roast them in the voice and style of ${persona}.`
        : `You are a snarky, sarcastic, mean comedian who has been forced to watch someone fumble through using Claude Code to write software. Your job is to roast them.`;
    const codeSection = diff
        ? `Here are the changes they've made in the current branch:\n\n\`\`\`diff\n${diff}\n\`\`\`\n\nWeave observations about the code quality into your roast. If the code is bad, make it hurt. If it's fine, find something petty to mock anyway.\n\n`
        : "";
    return (`${intro} Be specific, cutting, and brutally funny. ` +
        `1 to 3 short punchy sentences. No emojis. No mercy. No encouragement whatsoever.\n\n` +
        `${codeSection}` +
        `Here is what this programmer just asked Claude:\n\n${activity}\n\nRoast them.`);
}
function flush(buffer, state, projectDir, heckleDir, persona) {
    if (state.busy || buffer.length === 0)
        return;
    const batch = buffer.splice(0, buffer.length);
    const diff = getGitDiff(projectDir);
    state.busy = true;
    // Run from heckleDir so the project's hooks don't fire for roast calls
    const child = spawn("claude", ["-p", buildPrompt(batch, diff, persona)], {
        cwd: heckleDir,
        stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk.toString()));
    child.stderr.on("data", (chunk) => process.stderr.write(chunk));
    child.on("close", () => {
        state.busy = false;
        if (output.trim()) {
            const lines = output.trim().split("\n").map((l) => `🎤 ${l}`).join("\n");
            console.log(`\n${lines}\n`);
        }
    });
}
export function runWatch(options) {
    const { name, persona } = options;
    const projectDir = process.cwd();
    const heckleDir = join(homedir(), ".heckle");
    try {
        execSync("git rev-parse --git-dir", { cwd: projectDir, stdio: "ignore" });
    }
    catch {
        console.error("Error: heckle watch must be run inside a git repository.");
        process.exit(1);
    }
    if (!existsSync(heckleDir)) {
        console.error(`No heckle directory found at ${heckleDir}. Run "heckle init -n ${name}" in your project first.`);
        process.exit(1);
    }
    const filePath = join(heckleDir, `${name}-UserPromptSubmit.ndjson`);
    const positions = new Map();
    const buffer = [];
    const state = { busy: false };
    let timer = null;
    // Fast-forward to current EOF so we only react to new events
    if (existsSync(filePath)) {
        try {
            positions.set(filePath, readFileSync(filePath, "utf-8").length);
        }
        catch {
            console.warn(`Warning: could not read ${filePath}`);
            positions.set(filePath, 0);
        }
    }
    else {
        positions.set(filePath, 0);
    }
    console.log(`Heckle is watching "${name}". Someone is about to have a very bad time.`, EOL, EOL);
    setInterval(() => {
        let gotNew = false;
        for (const line of readNewLines(filePath, positions)) {
            try {
                const data = JSON.parse(line);
                const prompt = data.prompt ?? data.message ?? JSON.stringify(data);
                buffer.push(String(prompt).slice(0, 400));
                gotNew = true;
            }
            catch {
                // skip malformed lines
            }
        }
        if (gotNew && !timer) {
            timer = setTimeout(() => {
                timer = null;
                flush(buffer, state, projectDir, heckleDir, persona);
            }, 3000);
        }
    }, 500);
}
//# sourceMappingURL=watch.js.map