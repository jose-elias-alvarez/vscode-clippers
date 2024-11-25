import vscode from "vscode";

// https://code.visualstudio.com/docs/editor/userdefinedsnippets
const clippersCompletionItems: vscode.CompletionItem[] = [
  { label: "TM_FILENAME", detail: "The filename of the current document" },
  { label: "TM_FILENAME_BASE", detail: "The filename without its extensions" },
  { label: "TM_DIRECTORY", detail: "The directory of the current document" },
  {
    label: "TM_FILEPATH",
    detail: "The full file path of the current document",
  },
  {
    label: "RELATIVE_FILEPATH",
    detail:
      "The relative (to the opened workspace) file path of the current document",
  },
  { label: "WORKSPACE_NAME", detail: "Name of the opened workspace" },
  { label: "WORKSPACE_FOLDER", detail: "Path of the opened workspace" },
  { label: "TM_LINE_INDEX", detail: "The zero-based line number" },
  { label: "TM_LINE_NUMBER", detail: "The one-based line number" },
  { label: "TM_SELECTED_TEXT", detail: "The currently selected text" },
  { label: "TM_CURRENT_LINE", detail: "The contents of the current line" },
  { label: "TM_CURRENT_WORD", detail: "The contents of the word under cursor" },
  { label: "BLOCK_COMMENT_START", detail: "Example: /* in CSS/JavaScript" },
  { label: "BLOCK_COMMENT_END", detail: "Example: */ in CSS/JavaScript" },
  { label: "LINE_COMMENT", detail: "Example: // in JavaScript" },
  { label: "CURRENT_YEAR", detail: "The current year" },
  { label: "CURRENT_YEAR_SHORT", detail: "The current year's last two digits" },
  { label: "CURRENT_MONTH", detail: "The month as two digits (01-12)" },
  { label: "CURRENT_MONTH_NAME", detail: "The full name of the month" },
  { label: "CURRENT_MONTH_NAME_SHORT", detail: "The short name of the month" },
  {
    label: "CURRENT_DATE",
    detail: "The day of the month as two digits (01-31)",
  },
  { label: "CURRENT_DAY_NAME", detail: "The name of day" },
  { label: "CURRENT_DAY_NAME_SHORT", detail: "The short name of the day" },
  { label: "CURRENT_HOUR", detail: "The current hour in 24-hour clock format" },
  { label: "CURRENT_MINUTE", detail: "The current minute as two digits" },
  { label: "CURRENT_SECOND", detail: "The current second as two digits" },
  {
    label: "CURRENT_SECONDS_UNIX",
    detail: "The number of seconds since the Unix epoch",
  },
  { label: "RANDOM", detail: "6 random decimal digits" },
  { label: "RANDOM_HEX", detail: "6 random hexadecimal digits" },
  { label: "UUID", detail: "A Version 4 UUID" },
];

export default clippersCompletionItems;
