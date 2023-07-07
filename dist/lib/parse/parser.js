"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const device_1 = require("../device");
class Parser {
    config;
    constructor(rawConfig) {
        if (!rawConfig.length)
            throw new Error('Invalid string');
        this.config = JSON.parse(rawConfig);
    }
    generateDevices() {
        const devices = [];
        const startingSerial = '0.36.119.87.110.';
        for (let deviceIndex = 0; deviceIndex < this.config.deviceCount; deviceIndex++) {
            const serialNumber = `${startingSerial}${String(deviceIndex).padStart(3, '0')}`;
            const ipAddress = Math.floor(Math.random() * 255) +
                1 +
                '.' +
                Math.floor(Math.random() * 255) +
                '.' +
                Math.floor(Math.random() * 255) +
                '.' +
                Math.floor(Math.random() * 255);
            const device = new device_1.Device(serialNumber, ipAddress, this.config.firmwareVersion, this.config.firmwareName);
            device.inputs = (this.config.inputs || []).map(this.generateInput);
            device.sensors = (this.config.sensors || []).map(this.generateSensor);
            devices.push(device);
        }
        return devices;
    }
    generateInput(config) {
        return new device_1.Input(config.name, config.probability);
    }
    generateSensor(config) {
        switch (config.type) {
            case 'HUMIDITY':
                return new device_1.HumiditySensor(config.name, config.rangeLow, config.rangeHigh, config.emissionRate);
            case 'TEMPERATURE':
                return new device_1.TemperatureSensor(config.name, config.rangeLow, config.rangeHigh, config.emissionRate);
        }
    }
}
exports.Parser = Parser;
