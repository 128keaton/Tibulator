"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tibbo = void 0;
class Tibbo {
    serialNumber;
    ipAddress;
    firmwareVersion;
    firmwareName;
    topic;
    locationID;
    mqttClient;
    inputs = [];
    sensors = [];
    type = 'TIBBO';
    constructor(serialNumber, ipAddress, firmwareVersion, firmwareName, topic = 'device', locationID = 1, mqttClient) {
        this.serialNumber = serialNumber;
        this.ipAddress = ipAddress;
        this.firmwareVersion = firmwareVersion;
        this.firmwareName = firmwareName;
        this.topic = topic;
        this.locationID = locationID;
        this.mqttClient = mqttClient;
    }
    get mqttSerial() {
        return this.serialNumber.split('.').join(':');
    }
    emitDevice(rootTopic) {
        const topic = `${rootTopic}/${this.topic}/${this.locationID}/${this.mqttSerial}/`;
        this.mqttClient.publish(topic + 'type', this.type);
        this.mqttClient.publish(topic + 'ip-address', this.ipAddress);
        this.mqttClient.publish(topic + 'firmware-version', this.firmwareVersion);
        this.mqttClient.publish(topic + 'firmware-name', this.firmwareName);
    }
    emitInput(rootTopic, input) {
        const topic = `${rootTopic}/${this.topic}/${this.locationID}/${this.mqttSerial}/${input.name}`;
        this.mqttClient.publish(topic, `${input.getValue()}`);
    }
    emitSensor(rootTopic, sensor) {
        const topic = `${rootTopic}/${this.topic}/${this.locationID}/${this.mqttSerial}/${sensor.name}`;
        this.mqttClient.publish(topic, sensor.getValue());
    }
    disconnect() {
        return this.mqttClient.end(true);
    }
}
exports.Tibbo = Tibbo;
