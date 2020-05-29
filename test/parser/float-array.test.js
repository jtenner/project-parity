const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "1.0,2.0,3.0,4.0"],
  config: {
    optionA: {
      type: OptionType.FloatArray,
      default: [],
    },
  },
};
