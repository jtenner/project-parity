const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "a.*bc"],
  config: {
    optionA: {
      type: OptionType.RegExp,
    },
  },
};
