const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "test/files/c.txt"],
  config: {
    optionA: {
      type: OptionType.File,
    },
  },
};
