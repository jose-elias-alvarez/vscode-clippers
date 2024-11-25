module.exports = {
  require: ["ts-node/register"],
  extension: ["ts"],
  spec: "./src/**/*.test.ts",
  ignore: "./src/extension.test.ts",
};
