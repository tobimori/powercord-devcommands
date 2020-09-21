// shamelessly borrowed from Bowser65
// https://github.com/powercord-org/powercord/blob/v2/src/Powercord/plugins/pc-commands/commands/index.js

require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });