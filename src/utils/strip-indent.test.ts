import assert from "assert";
import stripIndent from "./strip-indent";

describe("stripIndent", () => {
  it("should remove common leading indentation from all lines", () => {
    const input = `
    Hello
      World
        Test`;

    const expected = `
Hello
  World
    Test`;

    assert.strictEqual(stripIndent(input), expected);
  });

  it("should handle tabs correctly", () => {
    const input = `
\t\tHello
\t\t\tWorld
\t\tTest`;

    const expected = `
Hello
\tWorld
Test`;

    assert.strictEqual(stripIndent(input), expected);
  });

  it("should return original string if no indentation", () => {
    const input = "Hello\nWorld\nTest";
    assert.strictEqual(stripIndent(input), input);
  });

  it("should handle mixed indentation by removing common minimum", () => {
    const input = `
    Hello
      World
    Test`;

    const expected = `
Hello
  World
Test`;

    assert.strictEqual(stripIndent(input), expected);
  });

  it("should handle empty string", () => {
    assert.strictEqual(stripIndent(""), "");
  });

  it("should handle single line strings", () => {
    const input = "    Hello World";
    const expected = "Hello World";
    assert.strictEqual(stripIndent(input), expected);
  });

  it("should preserve relative indentation", () => {
    const input = `
      function() {
          const x = 1;
          if (x) {
              return true;
          }
      }`;

    const expected = `
function() {
    const x = 1;
    if (x) {
        return true;
    }
}`;

    assert.strictEqual(stripIndent(input), expected);
  });

  it("should handle strings with no common indentation", () => {
    const input = `
First
  Second
    Third
No indent`;

    assert.strictEqual(stripIndent(input), input);
  });
});
