import { EditorBlock } from "../../types/journal";

let clientIdCounter = 1000;
export function makeClientId() {
  return `block-${++clientIdCounter}-${Math.random().toString(36).slice(2)}`;
}

export function blocksToEditorBlocks(
  blocks: { type: string; content: unknown; id?: number }[]
): EditorBlock[] {
  return blocks.map((b) => ({
    clientId: makeClientId(),
    type: b.type as "photo" | "text",
    content: b.content as EditorBlock["content"],
  }));
}
