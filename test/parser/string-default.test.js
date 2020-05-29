const { OptionType } = require("../../lib");

module.exports = {
  argv: [],
  config: {
    optionA: {
      type: OptionType.String,
      default: "Some Default Value",
    },
  },
};
