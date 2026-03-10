# Heckle

Heckle is a CLI tool that watches you use Claude Code and roasts you for it. It hooks into Claude Code's event system to monitor your prompts, then uses Claude to deliver sarcastic, cutting commentary about your work.

> You spent actual brain calories asking an AI to insult people about bad code, while sitting in a repo literally named "heckle" - which is either the most self-aware thing you've ever done or a complete accident.

> Congratulations, you created a file called `watch.ts` and filled it with absolutely nothing - which, coincidentally, is also what you contribute to the codebase. Claude opened your masterpiece and found the digital equivalent of a blank stare. Even the file is embarrassed to be associated with you.

**Note:** Must be run from inside a git repository.

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
