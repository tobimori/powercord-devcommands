const { Plugin } = require('powercord/entities')
const commands = require('./commands')

module.exports = class DevCommands extends Plugin {
  startPlugin() {
    Object.values(commands).forEach(command => powercord.api.commands.registerCommand(command));
  }

  pluginWillUnload() {
    Object.values(commands).forEach(command => powercord.api.commands.unregisterCommand(command.command));
  }
};