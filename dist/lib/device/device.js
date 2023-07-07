"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
class Device {
    serialNumber;
    ipAddress;
    firmwareVersion;
    firmwareName;
    mqttClient;
    inputs = [];
    sensors = [];
    constructor(serialNumber, ipAddress, firmwareVersion, firmwareName, mqttClient) {
        this.serialNumber = serialNumber;
        this.ipAddress = ipAddress;
        this.firmwareVersion = firmwareVersion;
        this.firmwareName = firmwareName;
        this.mqttClient = mqttClient;
    }
    get mqttSerial() {
        return this.serialNumber.replaceAll('.', '-');
    }
    emitDevice(rootTopic) {
        const topic = `${rootTopic}/device/${this.mqttSerial}/`;
        this.mqttClient.publish(topic + 'ip-address', this.ipAddress);
        this.mqttClient.publish(topic + 'firmware-version', this.firmwareVersion);
        this.mqttClient.publish(topic + 'firmware-version', this.firmwareName);
    }
    emitInput(rootTopic, input) {
        const topic = `${rootTopic}/device/${this.mqttSerial}/${input.name}`;
        this.mqttClient.publish(topic, `${input.getValue()}`);
    }
    emitSensor(rootTopic, sensor) {
        const topic = `${rootTopic}/device/${this.mqttSerial}/${sensor.name}`;
        this.mqttClient.publish(topic, sensor.getValue());
    }
    disconnect() {
        return this.mqttClient.end(true);
    }
}
exports.Device = Device;
