const stripIndent = (str: string) => {
  const match = str.match(/^[ \t]*(?=\S)/gm);
  if (!match) {
    return str;
  }

  const indent = Math.min(...match.map((x) => x.length));
  if (indent === 0) {
    return str;
  }

  const regex = new RegExp(`^[ \\t]{${indent}}`, "gm");
  return str.replace(regex, "");
};

export default stripIndent;
