const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "test/files/a.txt"],
  config: {
    optionA: {
      type: OptionType.TextFile,
    },
  },
};
