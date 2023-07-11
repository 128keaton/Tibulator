"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
class Camera {
    serialNumber;
    ipAddress;
    topic;
    locationID;
    mqttClient;
    type = 'CAMERA';
    constructor(serialNumber, ipAddress, topic = 'device', locationID = 1, mqttClient) {
        this.serialNumber = serialNumber;
        this.ipAddress = ipAddress;
        this.topic = topic;
        this.locationID = locationID;
        this.mqttClient = mqttClient;
    }
    get mqttSerial() {
        return this.serialNumber;
    }
    emitDevice(rootTopic) {
        const topic = `${rootTopic}/${this.topic}/${this.locationID}/${this.mqttSerial}/`;
        this.mqttClient.publish(topic + 'type', this.type);
        this.mqttClient.publish(topic + 'ipAddress', this.ipAddress);
    }
    disconnect() {
        this.mqttClient.end(true);
    }
}
exports.Camera = Camera;
