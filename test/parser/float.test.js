const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "3.14"],
  config: {
    optionA: {
      type: OptionType.Float,
      default: 42,
    },
  },
};
