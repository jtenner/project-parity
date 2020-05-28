const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "test/files/d.json"],
  config: {
    optionA: {
      type: OptionType.JSON,
    },
  },
};
