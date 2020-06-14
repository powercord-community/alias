const { Plugin } = require("powercord/entities");
const { React } = require("powercord/webpack");
const { resolve } = require("path");
const Settings = require("./Settings");

module.exports = class Alias extends Plugin {
  startPlugin() {
    powercord.api.settings.registerSettings("alias", {
        category: this.entityID,
        label: "Alias",
        render: Settings
    });
    this.loadStylesheet(resolve(__dirname, "style.css"));
    powercord.api.commands.registerCommand({
        command: "alias",
        aliases: ["a"],
        description: "Send a message you previously set in the \"Alias\" settings menu.",
        usage: "{c} [ alias name ]",
        executor: function (args) {
          if (args.length == 0)
            return {
              send: false,
              result: {
                type: "rich",
                title: "Alias",
                description: "Please enter an alias name.\nYou have " + powercord.api.settings.store.getSetting("alias", "pairs", []).length.toString() + " alias" + (powercord.api.settings.store.getSetting("alias", "pairs", []).length == 1 ? "" : "es")
                  + (powercord.api.settings.store.getSetting("alias", "pairs", []).length > 0 ? (":" + this.listAliases()) : "."),
                footer: { text: `Usage: ${powercord.api.commands.prefix}alias <aliasName>` }
              }
            }
          else {
            let match = powercord.api.settings.store.getSetting("alias", "pairs", []).filter(this.unique).find(p => p[0] == args[0]);
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
        }.bind(this),
        autocomplete: function (args) {
          let output = powercord.api.settings.store.getSetting("alias", "pairs", [])
                           .filter(this.unique)
                           .filter(p => p[0].toLowerCase().includes((args[0] || "").toLowerCase()) && ((args.length > 0 && p[0].toLowerCase() !== args[0].toLowerCase()) || args.length == 0))
                           .map(function(currentValue, index, arr) {
                             return {
                               command : currentValue[0],
                               aliases : [],
                               description : currentValue[1],
                               func : function() {},
                               autocompleteFunc : function() {}
                             }
                           });
          return (output.length > 0) ? {
            commands:  output,
            header: "Aliases"
          } : null;
        }.bind(this)
    });
  }

  unique(val, index, self) {
    return self.filter(function(v, k, t) { return v[0] === val }).length <= 1;
  }

  listAliases() {
    let output = "\n```";
    let spaceChar = " ";

    let longestName = 0;
    for (let i = 0; i < (powercord.api.settings.store.getSetting("alias", "pairs", []).length < 10 ? powercord.api.settings.store.getSetting("alias", "pairs", []).length : 10); i++) {
      let firstPart = powercord.api.commands.prefix + "alias " + powercord.api.settings.store.getSetting("alias", "pairs", [])[i][0];
      longestName = firstPart.length > longestName ? firstPart.length : longestName;
    }

    for (let i = 0; i < (powercord.api.settings.store.getSetting("alias", "pairs", []).length < 10 ? powercord.api.settings.store.getSetting("alias", "pairs", []).length : 10); i++) {
      let firstPart = "\n" + powercord.api.commands.prefix + "alias " + powercord.api.settings.store.getSetting("alias", "pairs", [])[i][0];
      firstPart = firstPart + (spaceChar.repeat(longestName - (firstPart.length - 1))) + " : ";

      let secondPart = powercord.api.settings.store.getSetting("alias", "pairs", [])[i][1];
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
