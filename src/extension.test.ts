// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import assert from "assert";
import * as vscode from "vscode";
import ClippersFSProvider from "./fs-provider";

suite("vscode-clippers", () => {
  const globalSnippetsPath = vscode.Uri.joinPath(
    vscode.Uri.file(process.cwd()),
    ".vscode-test",
    "user-data",
    "User",
    "snippets",
    "global.code-snippets"
  );
  const mockPrefix = "mockPrefix";
  const mockContent = "test content\nwith multiple\nlines of text";
  const mockSelection = "test content\nwith ";
  const mockLanguageId = "plaintext";

  const showInputBox = vscode.window.showInputBox;
  const showWarningMessage = vscode.window.showWarningMessage;
  const showErrorMessage = vscode.window.showErrorMessage;
  let lastWarningMessage = "";
  let lastErrorMessage = "";
  setup(async () => {
    try {
      await vscode.workspace.fs.delete(globalSnippetsPath);
    } catch (_) {}
    try {
    } catch (_) {}

    vscode.window.showInputBox = async () => mockPrefix;
    vscode.window.showWarningMessage = async (message: string) => {
      lastWarningMessage = message;
    };
    vscode.window.showErrorMessage = async (message: string) => {
      lastErrorMessage = message;
    };
  });
  teardown(() => {
    vscode.window.showInputBox = showInputBox;
    vscode.window.showWarningMessage = showWarningMessage;
    vscode.window.showErrorMessage = showErrorMessage;
    lastWarningMessage = "";
    lastErrorMessage = "";
  });

  const waitForClippers = () =>
    new Promise<void>((resolve) =>
      vscode.commands
        .executeCommand("vscode-clippers.createGlobalSnippet")
        .then(() => {
          const disposable = vscode.window.onDidChangeActiveTextEditor((e) => {
            if (e?.document.uri.scheme === ClippersFSProvider.scheme) {
              disposable.dispose();
              resolve();
            }
          });
        })
    );

  const getSnippetsJson = async () => {
    try {
      await vscode.commands.executeCommand("workbench.action.files.save");
      return await JSON.parse(
        (await vscode.workspace.fs.readFile(globalSnippetsPath)).toString()
      );
    } catch (_) {}
  };

  test("gets extension", () => {
    const extension = vscode.extensions.getExtension("jea.vscode-clippers");
    assert.ok(extension);
  });

  test("creates window containing selection", async () => {
    const editor = await vscode.window.showTextDocument(
      await vscode.workspace.openTextDocument({
        content: mockContent,
        language: mockLanguageId,
      })
    );
    editor.selection = new vscode.Selection(
      new vscode.Position(0, 0),
      new vscode.Position(1, mockSelection.split("\n")[1].length)
    );
    assert.strictEqual(
      editor.document.getText(editor.selection),
      mockSelection
    );

    await waitForClippers();
    assert.strictEqual(
      vscode.window.activeTextEditor?.document.getText(),
      mockSelection
    );
  });

  test("saves window content to global snippet", async () => {
    const editor = await vscode.window.showTextDocument(
      await vscode.workspace.openTextDocument({
        content: mockContent,
        language: mockLanguageId,
      })
    );
    editor.selection = new vscode.Selection(
      new vscode.Position(0, 0),
      new vscode.Position(1, mockSelection.split("\n")[1].length)
    );

    await waitForClippers();
    const json = await getSnippetsJson();
    assert.deepStrictEqual(json[mockPrefix], {
      prefix: mockPrefix,
      body: mockSelection.trim().split("\n"),
      scope: mockLanguageId,
    });
  });

  test("strips indentation", async () => {
    const newContent =
      "    some new text\n      and its on multiple lines\n     and indented";
    const editor = await vscode.window.showTextDocument(
      await vscode.workspace.openTextDocument({
        content: newContent,
        language: mockLanguageId,
      })
    );
    editor.selection = new vscode.Selection(
      new vscode.Position(0, 0),
      new vscode.Position(2, newContent.split("\n")[2].length)
    );
    assert.strictEqual(editor.document.getText(editor.selection), newContent);

    await waitForClippers();
    assert.strictEqual(
      vscode.window.activeTextEditor?.document.getText(),
      "some new text\n  and its on multiple lines\n and indented"
    );
  });

  test("saves updated content to snippet", async () => {
    const editor = await vscode.window.showTextDocument(
      await vscode.workspace.openTextDocument({
        content: mockContent,
        language: mockLanguageId,
      })
    );
    editor.selection = new vscode.Selection(
      new vscode.Position(0, 0),
      new vscode.Position(1, mockSelection.split("\n")[1].length)
    );

    await waitForClippers();

    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor);
    const edit = new vscode.WorkspaceEdit();
    const newContent =
      "    some new text\n      and its on multiple lines\n     and indented";
    edit.replace(
      activeEditor.document.uri,
      new vscode.Range(
        new vscode.Position(0, 0),
        activeEditor.document.lineAt(
          activeEditor.document.lineCount - 1
        ).range.end
      ),
      newContent
    );
    await vscode.workspace.applyEdit(edit);

    const json = await getSnippetsJson();
    assert.deepStrictEqual(json[mockPrefix], {
      prefix: mockPrefix,
      body: newContent.trim().split("\n"),
      scope: mockLanguageId,
    });
  });

  test("warns on duplicate snippet", async () => {
    await vscode.workspace.fs.writeFile(
      globalSnippetsPath,
      new TextEncoder().encode(
        JSON.stringify({
          [mockPrefix]: {
            prefix: mockPrefix,
            body: mockContent.trim().split("\n"),
            scope: mockLanguageId,
          },
        })
      )
    );

    const editor = await vscode.window.showTextDocument(
      await vscode.workspace.openTextDocument({
        content: mockContent,
        language: mockLanguageId,
      })
    );
    editor.selection = new vscode.Selection(
      new vscode.Position(0, 0),
      new vscode.Position(1, mockSelection.split("\n")[1].length)
    );

    await waitForClippers();
    await getSnippetsJson();
    assert.match(
      lastWarningMessage,
      new RegExp(`Snippet ${mockPrefix} already exists`)
    );
  });

  test("errors on bad json", async () => {
    await vscode.workspace.fs.writeFile(
      globalSnippetsPath,
      new TextEncoder().encode("ajsdjadja")
    );

    const editor = await vscode.window.showTextDocument(
      await vscode.workspace.openTextDocument({
        content: mockContent,
        language: mockLanguageId,
      })
    );
    editor.selection = new vscode.Selection(
      new vscode.Position(0, 0),
      new vscode.Position(1, mockSelection.split("\n")[1].length)
    );

    await waitForClippers();
    await getSnippetsJson();

    assert.match(lastErrorMessage, new RegExp(`Failed to parse snippets file`));
  });
});
