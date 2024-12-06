# vscode-clippers

Quickly create snippets from your selection.

https://github.com/user-attachments/assets/9d67e7c6-f4a8-45c9-b4f2-37381f59611b

Snippets are useful and powerful, but I don't like using gigantic snippet packs, which are hard to remember and don't match my preferences / project style. VS Code's snippets syntax is great, but creating a new snippet in raw JSON is painful.

Enter vscode-clippers, the goal of which is to make _creating_ snippets as fast and easy as possible.

> [!WARNING]
> vscode-scissors is in **beta status**. If you already have workspace / global snippet file(s), I strongly recommend backing them up before using the plugin to avoid potential data loss.

## Usage

Select some text, then run `Clippers: Create Global Snippet` or `Clippers: Create Workspace Snippet` from the command palette. (You can, of course, bind each command if you really, really like snippets.)

vscode-clippers will open a new editor window containing your selected text. This is a normal VS Code editor window, so you can use your favorite keyboard shortcuts / plugins to edit the snippet, including full syntax highlighting and formatting. In your new snippet, you can use [VS Code's snippet syntax](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax), including variables (which are autocompleted!).

When you're done, save the file, and you'll be prompted to enter a prefix for the snippet. Enter a prefix, and you're done! The snippet is now available globally or for your workspace for the language the snippet was originally extracted from.

## FAQ

### How do I edit snippets?

vscode-scissors focuses on _creating_ snippets, so it does not provide a mechanism to edit them after creation. Use VS Code's native `Snippets: Configure Snippets` command to open the appropriate file and edit it manually. (I find that I rarely need to do so, and editing JSON is fine for small edits.)

### Can I set a name or description?

vscode-scissors wants you to create snippets as fast as possible, so this is not currently supported. If you need to set these properties, you can use `Snippets: Configure Snippets` to edit the snippet file directly.

### Can I customize the location of the snippets file?

To reduce the odds of conflicts with existing snippets, custom locations aren't currently supported, but if you have a strong use case, please open an issue.

## Credits

- [nvim-scissors](https://github.com/chrisgrieser/nvim-scissors), an excellent Neovim plugin that is the direct inspiration for this one

## Release Notes

### 1.0.0

Initial release.
