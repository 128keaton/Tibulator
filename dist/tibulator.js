"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_manager_1 = require("./lib/device-manager");
const commander_1 = require("commander");
const parser_1 = require("./lib/parse/parser");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
__exportStar(require("./lib/device/index"), exports);
__exportStar(require("./lib/device-manager"), exports);
if (require.main == module) {
    commander_1.program
        .name('tibulator')
        .version('0.0.1')
        .description('Emulate a fleet of Tibbos')
        .argument('<config>', 'Path to the tibulator.json file')
        .action((configPath) => {
        const rawConfig = fs.readFileSync(path.resolve(configPath)).toString();
        if (!rawConfig || !rawConfig.length)
            return;
        const parser = new parser_1.Parser(rawConfig);
        const devices = parser.generateDevices();
        const deviceManager = new device_manager_1.DeviceManager(devices, parser.config.mqtt.options, parser.config.mqtt.options.url, parser.config.mqtt.rootTopic, parser.config.globalTick, parser.config.scanRate);
        deviceManager.start();
    });
    commander_1.program.parse();
}
