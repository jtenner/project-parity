const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "a.*bc,d(.*)ef"],
  config: {
    optionA: {
      type: OptionType.RegExpArray,
    },
  },
};
