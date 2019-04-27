const { Plugin } = require("powercord/entities");
const { React } = require("powercord/webpack");
const { resolve } = require("path");
const Settings = require("./Settings");

module.exports = class Alias extends Plugin {
  async startPlugin () {
    this.registerSettings(
      "alias",
      "Alias",
      Settings
    );
    this.loadCSS(resolve(__dirname, "style.css"));
    this.registerCommand(
      "alias",
      ["a"],
      "Paste pre-set text for a given name.",
      "{c} [ alias name ]",
      (args) => ({
        send: true,
        result: this.settings.get("pairs", []).filter(this.unique).find(p => p[0] == args[0])[1] + (args.length > 0 ? (" " + args.splice(1, args.length - 1).join(" ")) : "")
      })
    );
  }

  unique(value, index, self, ignoreSelf) {
    return self.filter( function(v, k, t) { return v[0] === value } ).length <= (ignoreSelf ? 0 : 1);
  }
};
