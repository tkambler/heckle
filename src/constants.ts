export type ClaudeSettings = {
  hooks?: Record<string, Array<{ matcher?: string; hooks: Array<{ type: string; command: string }> }>>;
};

export const HOOK_EVENTS = [
  "PreToolUse",
  "PostToolUse",
  "Notification",
  "Stop",
  "SubagentStop",
  "PreCompact",
  "UserPromptSubmit",
] as const;

export type HookEvent = (typeof HOOK_EVENTS)[number];
