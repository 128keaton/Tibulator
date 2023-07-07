import { DeviceManager } from './lib/device-manager';
import { program } from 'commander';
import { Parser } from './lib/parse/parser';
import * as fs from 'fs';
import * as path from 'path';

export * from './lib/device/index';
export * from './lib/device-manager';

if (require.main == module) {
  program
    .name('tibulator')
    .version('0.0.1')
    .description('Emulate a fleet of Tibbos')
    .argument('<config>', 'Path to the tibulator.json file')
    .action((configPath: string) => {
      const rawConfig = fs.readFileSync(path.resolve(configPath)).toString();

      if (!rawConfig || !rawConfig.length) return;

      const parser = new Parser(rawConfig);

      const devices = parser.generateDevices();
      const deviceManager = new DeviceManager(
        devices,
        parser.config.mqtt.options,
        parser.config.mqtt.options.url,
        parser.config.mqtt.rootTopic,
        parser.config.globalTick,
        parser.config.scanRate,
      );

      deviceManager.start();
    });

  program.parse();
}
