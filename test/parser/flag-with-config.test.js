const { OptionType } = require("../../lib");

module.exports = {
  argv: [],
  config: {
    config: {
      type: OptionType.Require,
    },
    optionA: {
      type: OptionType.Flag,
    },
  },
};
