# Heckle

<img src="./heckle.png" align="right" width="256"/>

Heckle is a CLI tool that watches you use Claude Code and roasts you for it. It hooks into Claude Code's event system to monitor your prompts, then uses Claude to deliver sarcastic, cutting commentary about your work.

> 🎤 You spent actual brain calories asking an AI to insult people about bad code, while sitting in a repo literally named "heckle" - which is either the most self-aware thing you've ever done or a complete accident.

> 🎤 Congratulations, you created a file called `watch.ts` and filled it with absolutely nothing - which, coincidentally, is also what you contribute to the codebase. Claude opened your masterpiece and found the digital equivalent of a blank stare. Even the file is embarrassed to be associated with you.

> 🎤 You just spent ten minutes switching from ESM to CommonJS because you couldn't figure out module resolution, and now you're asking Claude if a type you wrote is duplicated — in your own file, that you wrote, that you could search in two keystrokes. Congratulations, you've officially outsourced reading comprehension.

> 🎤 "Let's do it" — the battle cry of someone with absolutely no idea what they want but enormous confidence that Claude will figure it out. Also, you committed your `dist/` folder to git like an animal, and it took you until version 1.0.3 to notice that `@types/node` belongs in devDependencies.

> 🎤 You're building a tool whose entire purpose is to mock people for leaning on Claude, and you just asked Claude to write `JSON.parse(readFileSync(path, "utf-8"))` for you. That's not a function, that's a line. One line. You removed it from `init.ts` to "share" it and still couldn't write the replacement yourself. The tool is working as intended — on you.

> 🎤 You're building a tool to shame people for over-relying on Claude, and you just asked Claude to extract a duplicated function for you — the single most basic refactoring move that exists, taught in week one of every bootcamp on Earth. Congrats on finally noticing the duplication, by the way; most developers catch that before shipping a `dist/` folder to GitHub like a war crime.

**Note:** Must be run from inside a git repository.

## Quick Start

```sh
npm install -g @tkambler/heckle
cd ~/repos/my-git-project
heckle init --name my-git-project
claude

# In a separate terminal
heckle watch --name my-git-project

# You can also specify a "persona", e.g.:
heckle watch --name my-git-project --persona "George Carlin"
```

## How it works

1. `heckle init` installs hooks into your project's `.claude/settings.json` that log Claude Code events to `~/.heckle/`.
2. `heckle watch` monitors those logs, buffers your recent prompts, and periodically fires off a roast via `claude -p`.

## Installation

```sh
npm install -g @tkambler/heckle
```

## Usage

### Initialize a project

Run this once per project to install the Claude Code hooks:

```sh
heckle init -n <name>
```

- `-n, --name <name>` — A unique name for this project (lowercase letters, numbers, `_`, `-`). Used to namespace the log files in `~/.heckle/`.

### Remove hooks from a project

To uninstall the Claude Code hooks from a project:

```sh
heckle uninit -n <name>
```

- `-n, --name <name>` — Must match the name used during `init`.

This removes all heckle-related entries from `.claude/settings.json` but leaves the log files in `~/.heckle/` intact.

### Watch and roast

In a separate terminal, start the watcher:

```sh
heckle watch -n <name>
```

- `-n, --name <name>` — Must match the name used during `init`.
- `-p, --persona <persona>` — Optional. A persona for the roasts (e.g. `"Anthony Jeselnik"`, `"a disappointed parent"`).

Heckle watches for new prompts, waits for a brief pause in activity, then delivers a roast based on what you've been asking Claude to do and the changes in your current branch.

## Example

```sh
# In your project directory
heckle init -n my-project

# In a separate terminal
heckle watch -n my-project --persona "Gordon Ramsay"
```
