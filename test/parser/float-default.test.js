const { OptionType } = require("../../lib");

module.exports = {
  argv: [],
  config: {
    optionA: {
      type: OptionType.Float,
      default: 42,
    },
  },
};
