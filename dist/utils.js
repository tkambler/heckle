import { InvalidArgumentError } from "commander";
export function parseName(value) {
    const lower = value.toLowerCase();
    if (!/^[a-z0-9_-]+$/.test(lower)) {
        throw new InvalidArgumentError("Name may only contain lowercase letters, numbers, underscores, and dashes.");
    }
    return lower;
}
//# sourceMappingURL=utils.js.map