const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a"],
  config: {
    optionA: {
      type: OptionType.String,
      default: "some default value",
    },
  },
};
