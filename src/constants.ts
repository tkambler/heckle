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
