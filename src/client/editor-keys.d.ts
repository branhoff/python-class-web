export interface EditorText {
  value: string;
  start: number;
  end: number;
}

export interface KeyPress {
  key: string;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  isComposing?: boolean;
}

export type KeyResult =
  | { action: 'pass'; escaped: boolean }
  | { action: 'run'; escaped: false }
  | { action: 'edit'; edit: EditorText; escaped: false };

export function indent(text: EditorText): EditorText;

export function outdent(text: EditorText): EditorText;

export function newline(text: EditorText): EditorText;

export function editorKey(event: KeyPress, text: EditorText, escaped: boolean): KeyResult;
