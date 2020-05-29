const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "10"],
  config: {
    optionA: {
      type: OptionType.Integer,
      default: [],
    },
  },
};
