#! /usr/bin/env node
import { runCLI } from './tibulator.cli';

export * from './lib/device/index';
export * from './lib/device-manager';

if (require.main == module) {
  runCLI();
}
