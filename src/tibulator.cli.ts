import { program } from 'commander';
import { runEmulation } from './cli/emulate';

export const runCLI = () => {
  program
    .name('tibulator')
    .version('0.1.0')
    .description('Emulate a fleet of Tibbo devices over MQTT');

  const emulateCommand = program
    .createCommand('emulate')
    .requiredOption(
      '-c <configPath>, --config=<configPath>',
      'Path to tibulator-json',
      './tibulator.json',
    )
    .action((options: { c?: string; config?: string }) => {
      console.log(options);
      runEmulation(options.c || options.config || './tibulator.json');
    });

  program.addCommand(emulateCommand);

  program.parse();
};
