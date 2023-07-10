"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCLI = void 0;
const commander_1 = require("commander");
const emulate_1 = require("./cli/emulate");
const runCLI = () => {
    commander_1.program
        .name('tibulator')
        .version('0.1.0')
        .description('Emulate a fleet of Tibbo devices over MQTT');
    const emulateCommand = commander_1.program
        .createCommand('emulate')
        .requiredOption('-c <configPath>, --config=<configPath>', 'Path to tibulator-json', './tibulator.json')
        .action((options) => {
        console.log(options);
        (0, emulate_1.runEmulation)(options.c || options.config || './tibulator.json');
    });
    commander_1.program.addCommand(emulateCommand);
    commander_1.program.parse();
};
exports.runCLI = runCLI;
