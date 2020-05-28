const { OptionType } = require("../../lib");

module.exports = {
  argv: ["--option-a", "test/files/d.json,test/files/e.json"],
  config: {
    optionA: {
      type: OptionType.JSONArray,
    },
  },
};
