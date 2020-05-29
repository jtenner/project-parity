const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "test/files/f.js,test/files/g.js"],
  config: {
    optionA: {
      type: OptionType.RequireArray,
    },
  },
};
