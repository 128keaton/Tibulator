"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
class Camera {
    serialNumber;
    ipAddress;
    topic;
    mqttClient;
    type = 'CAMERA';
    constructor(serialNumber, ipAddress, topic = 'device', mqttClient) {
        this.serialNumber = serialNumber;
        this.ipAddress = ipAddress;
        this.topic = topic;
        this.mqttClient = mqttClient;
    }
    get mqttSerial() {
        return this.serialNumber;
    }
    emitDevice(rootTopic) {
        const topic = `${rootTopic}/${this.topic}/${this.mqttSerial}/`;
        this.mqttClient.publish(topic + 'type', this.type);
        this.mqttClient.publish(topic + 'ip-address', this.ipAddress);
    }
    disconnect() {
        this.mqttClient.end(true);
    }
}
exports.Camera = Camera;
