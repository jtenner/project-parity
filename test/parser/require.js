const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "test/files/f.js"],
  config: {
    optionA: {
      type: OptionType.Require,
    },
  },
};
