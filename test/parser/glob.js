const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "test/files/*.txt"],
  config: {
    optionA: {
      type: OptionType.Glob,
      default: [],
    },
  },
};
