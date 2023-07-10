"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const device_1 = require("../device");
const mqtt_1 = require("mqtt");
const tibbo_1 = require("../device/tibbo");
class Parser {
    config;
    serialOffset = 110;
    constructor(rawConfig) {
        if (!rawConfig.length)
            throw new Error('Invalid string');
        this.config = JSON.parse(rawConfig);
    }
    generateDevices() {
        if (this.config.tibboCount > 2999)
            throw new Error("Don't even think about it (too many Tibbo devices)");
        const devices = [];
        const startingSerial = `0.36.119.87.${this.serialOffset}`;
        for (let tibboIndex = 0; tibboIndex < this.config.tibboCount; tibboIndex++) {
            if (tibboIndex > 999 && this.serialOffset === 110)
                this.serialOffset = 111;
            else if (tibboIndex > 1999 && this.serialOffset === 111)
                this.serialOffset = 112;
            const serialNumber = `${startingSerial}.${String(tibboIndex).padStart(3, '0')}`;
            devices.push(this.generateTibbo(serialNumber));
        }
        for (let cameraIndex = 0; cameraIndex < (this.config.cameraCount || 0); cameraIndex++) {
            devices.push(this.generateCamera());
        }
        return devices;
    }
    generateInput(config) {
        return new device_1.Input(config.name, config.probability, config.trueValue, config.falseValue);
    }
    generateSensor(config) {
        switch (config.type) {
            case 'HUMIDITY':
                return new device_1.HumiditySensor(config.name, config.rangeLow, config.rangeHigh, config.emissionRate);
            case 'TEMPERATURE':
                return new device_1.TemperatureSensor(config.name, config.rangeLow, config.rangeHigh, config.emissionRate);
        }
    }
    generateTibbo(serialNumber) {
        const tibboConfig = {};
        Object.assign(tibboConfig, this.config.mqtt.options);
        tibboConfig.clientId = serialNumber;
        const client = (0, mqtt_1.connect)(this.config.mqtt.options.url, tibboConfig);
        const tibbo = new tibbo_1.Tibbo(serialNumber, this.generateIP(), this.config.firmwareVersion, this.config.firmwareName, this.config.tibboTopic, client);
        tibbo.inputs = (this.config.inputs || []).map(this.generateInput);
        tibbo.sensors = (this.config.sensors || []).map(this.generateSensor);
        return tibbo;
    }
    generateCamera() {
        const ipAddress = this.generateIP();
        const serialNumber = this.generateMAC();
        const cameraConfig = {};
        Object.assign(cameraConfig, this.config.mqtt.options);
        cameraConfig.clientId = serialNumber;
        const client = (0, mqtt_1.connect)(this.config.mqtt.options.url, cameraConfig);
        return new device_1.Camera(serialNumber, ipAddress, this.config.cameraTopic, client);
    }
    generateMAC() {
        return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, function () {
            return '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16));
        });
    }
    generateIP() {
        return (Math.floor(Math.random() * 255) +
            1 +
            '.' +
            Math.floor(Math.random() * 255) +
            '.' +
            Math.floor(Math.random() * 255) +
            '.' +
            Math.floor(Math.random() * 255));
    }
}
exports.Parser = Parser;
