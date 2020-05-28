const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "test/files/*.txt,test/files/*.json,test/files/*.txt"],
  config: {
    optionA: {
      type: OptionType.GlobArray,
      default: [],
    },
  },
};
