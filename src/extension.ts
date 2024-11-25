import * as vscode from "vscode";
import clippersCompletionItems from "./completion-items";
import ClippersFileSystemProvider from "./fs-provider";
import ClippersSnippetManager from "./snippets-manager";
import stripIndent from "./utils/strip-indent";

const EXTENSION_ID = "vscode-clippers";

export function activate(context: vscode.ExtensionContext) {
  const fsProvider = new ClippersFileSystemProvider();
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider(
      ClippersFileSystemProvider.scheme,
      fsProvider,
      { isCaseSensitive: true }
    )
  );
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) =>
      fsProvider.onDidCloseDocument(document)
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { scheme: ClippersFileSystemProvider.scheme },
      { provideCompletionItems: () => clippersCompletionItems },
      "$"
    )
  );

  const manager = new ClippersSnippetManager(context);
  for (const { global, name } of [
    { global: true, name: `${EXTENSION_ID}.createGlobalSnippet` },
    { global: false, name: `${EXTENSION_ID}.createWorkspaceSnippet` },
  ]) {
    context.subscriptions.push(
      vscode.commands.registerTextEditorCommand(name, async (editor) => {
        const content = stripIndent(editor.document.getText(editor.selection));
        if (!content) {
          vscode.window.showErrorMessage(
            "Clippers: No text selected! Select some text to create a snippet."
          );
          return;
        }
        const uri = fsProvider.registerCallback(
          content,
          async (uri, finalContent) =>
            await manager.writeSnippet(uri, finalContent, global)
        );
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.languages.setTextDocumentLanguage(
          doc,
          editor.document.languageId
        );
        await vscode.window.showTextDocument(doc);
      })
    );
  }
}
