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
      function (args) {
        if (args.length == 0)
          return {
            send: false,
            result: {
              type: "rich",
              title: "Alias",
              description: "Please enter an alias name.\nYou have " + this.settings.get("pairs", []).length.toString() + " alias" + (this.settings.get("pairs", []).length == 1 ? "" : "es")
                + (this.settings.get("pairs", []).length > 0 ? (":" + this.listAliases()) : "."),
              footer: { text: `Usage: ${powercord.api.commands.prefix}alias <aliasName>` }
            }
          }
        else {
          let match = this.settings.get("pairs", []).filter(this.unique).find(p => p[0] == args[0]);
          if (match != null)
            return {
              send: true,
              result: match[1] + (args.length > 0 ? (" " + args.splice(1, args.length - 1).join(" ")) : "")
            }
          else
            return {
              send: false,
              result: {
                type: "rich",
                title: "Alias",
                description: "The alias `" + args[0].toString() + "` was not found.",
                footer: { text: `Usage: ${powercord.api.commands.prefix}alias <aliasName>` }
              }
            }
        }
      }.bind(this)
    );
  }

  unique(value, index, self) {
    return self.filter(function(v, k, t) { return v[0] === value }).length <= 1;
  }

  listAliases() {
    let output = "\n```";
    let spaceChar = " ";

    let longestName = 0;
    for (let i = 0; i < (this.settings.get("pairs", []).length < 10 ? this.settings.get("pairs", []).length : 10); i++) {
      let firstPart = powercord.api.commands.prefix + "alias " + this.settings.get("pairs", [])[i][0];
      longestName = firstPart.length > longestName ? firstPart.length : longestName;
    }

    for (let i = 0; i < (this.settings.get("pairs", []).length < 10 ? this.settings.get("pairs", []).length : 10); i++) {
      let firstPart = "\n" + powercord.api.commands.prefix + "alias " + this.settings.get("pairs", [])[i][0];
      firstPart = firstPart + (spaceChar.repeat(longestName - (firstPart.length - 1))) + " : ";

      let secondPart = this.settings.get("pairs", [])[i][1];
      if (firstPart.length + secondPart.length > 55) {
        secondPart = secondPart.substring(0, 55 - firstPart.length);
        secondPart += "...";
      }
      secondPart = secondPart.replace(/\n/g, "\n" + spaceChar.repeat(firstPart.length - 1));

      output += firstPart + secondPart;
      if ((output.split("\n").length + 1) >= 13) {
        output += "\n(...)";
        break;
      }
    }
    output += "\n```";
    return output
  }
};
