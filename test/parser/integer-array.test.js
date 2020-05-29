const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "10,9,8,7,6"],
  config: {
    optionA: {
      type: OptionType.IntegerArray,
      default: [],
    },
  },
};
