import * as crypto from "crypto";
import * as vscode from "vscode";
import HandledError from "./utils/handled-error";

type OnWriteCallback = (uri: vscode.Uri, finalContent: string) => Promise<void>;

export default class ClippersFileSystemProvider
  implements vscode.FileSystemProvider
{
  public static scheme = "clippers";
  public static authority = "snippet";
  private uriMap = new Map<
    string,
    { content: string; callback: OnWriteCallback }
  >();

  private makeHash(content: string): string {
    return crypto
      .createHash("md5")
      .update(content)
      .digest("hex")
      .substring(0, 12);
  }

  private scheduleTabClose(uri: vscode.Uri) {
    const didSaveDisposable = vscode.workspace.onDidSaveTextDocument(
      (document) =>
        document.uri.toString() === uri.toString() &&
        vscode.window.tabGroups
          .close(
            vscode.window.tabGroups.all
              .map((g) => g.tabs)
              .flat()
              .filter(
                (tab) =>
                  tab.input instanceof vscode.TabInputText &&
                  tab.input.uri.toString() === uri.toString()
              )
          )
          .then(() => didSaveDisposable.dispose())
    );
  }

  public onDidCloseDocument(document: vscode.TextDocument) {
    if (!document.isClosed) {
      return;
    }
    this.uriMap.delete(document.uri.toString());
  }

  public registerCallback(
    content: string,
    callback: OnWriteCallback
  ): vscode.Uri {
    const uri = vscode.Uri.from({
      scheme: ClippersFileSystemProvider.scheme,
      authority: ClippersFileSystemProvider.authority,
      path: `/${this.makeHash(content)}`,
    });
    this.uriMap.set(uri.toString(), { content, callback });
    return uri;
  }

  public readFile(uri: vscode.Uri): Uint8Array {
    const content = this.uriMap.get(uri.toString())?.content;
    if (!content) {
      throw vscode.FileSystemError.FileNotFound(uri);
    }
    return new TextEncoder().encode(content);
  }

  public async writeFile(uri: vscode.Uri, finalContent: Uint8Array) {
    const callback = this.uriMap.get(uri.toString())?.callback;
    if (!callback) {
      return;
    }
    try {
      await callback(uri, finalContent.toString());
      this.scheduleTabClose(uri);
    } catch (error) {
      if (error instanceof HandledError) {
        console.error(
          `Error in write callback for ${uri.toString()}: ${error}`
        );
      } else {
        vscode.window.showErrorMessage(`Clippers error: ${error}`);
      }
    }
  }

  // dummy properties / methods
  private emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
  public onDidChangeFile = this.emitter.event;
  public watch() {
    return { dispose: () => {} };
  }
  public stat(): vscode.FileStat {
    return { type: vscode.FileType.File, ctime: 0, mtime: 0, size: 0 };
  }
  public readDirectory() {
    return [];
  }
  public createDirectory() {}
  public delete() {}
  public rename() {}
  public copy() {}
}
