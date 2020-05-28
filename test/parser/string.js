const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "the option"],
  config: {
    optionA: {
      type: OptionType.String,
    },
  },
};
