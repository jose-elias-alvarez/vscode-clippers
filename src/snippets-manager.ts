import * as vscode from "vscode";
import HandledError from "./utils/handled-error";

export default class ClippersSnippetManager {
  private context: vscode.ExtensionContext;
  private globalDir: vscode.Uri;
  private workspaceDir: vscode.Uri;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.globalDir = vscode.Uri.joinPath(
      this.context.globalStorageUri,
      "../../snippets"
    );
    this.workspaceDir = vscode.Uri.joinPath(
      vscode.workspace.workspaceFolders?.[0].uri ||
        vscode.Uri.file(process.cwd()),
      ".vscode"
    );
  }

  private async getSnippetsUri(global = true) {
    return vscode.Uri.joinPath(
      global ? this.globalDir : this.workspaceDir,
      `${global ? "global" : "workspace"}.code-snippets`
    );
  }

  private async getSnippetJson(uri: vscode.Uri) {
    let raw: string;
    try {
      raw = (await vscode.workspace.fs.readFile(uri)).toString();
    } catch (_) {
      return {};
    }
    try {
      return JSON.parse(raw);
    } catch (_) {
      throw new Error(`Failed to parse snippets file at ${uri.toString()}`);
    }
  }

  async writeSnippet(
    documentUri: vscode.Uri,
    documentContent: string,
    global = true
  ) {
    const prefix = await vscode.window.showInputBox({
      prompt: "Snippet prefix",
    });
    if (!prefix) {
      throw new HandledError("Can't write snippet without prefix");
    }

    const snippetsUri = await this.getSnippetsUri(global);
    const json = await this.getSnippetJson(snippetsUri);

    if (json[prefix]) {
      const shouldOverwrite = await vscode.window.showWarningMessage(
        `Snippet ${prefix} already exists. Overwrite?`,
        "Yes",
        "No"
      );
      if (shouldOverwrite !== "Yes") {
        throw new HandledError(`Not overwriting snippet with prefix ${prefix}`);
      }
    }

    const newJson = {
      ...json,
      [prefix]: {
        prefix,
        body: documentContent.trim().split("\n"),
        scope: (await vscode.workspace.openTextDocument(documentUri))
          .languageId,
      },
    };

    await vscode.workspace.fs.createDirectory(
      vscode.Uri.joinPath(documentUri, "..")
    );
    await vscode.workspace.fs.writeFile(
      snippetsUri,
      new TextEncoder().encode(JSON.stringify(newJson, null, 4))
    );
  }
}
