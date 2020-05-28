const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "test/files/a.txt,test/files/b.txt"],
  config: {
    optionA: {
      type: OptionType.TextFileArray,
    },
  },
};
