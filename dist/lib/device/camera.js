"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
class Camera {
    serialNumber;
    ipAddress;
    mqttClient;
    type = 'CAMERA';
    constructor(serialNumber, ipAddress, mqttClient) {
        this.serialNumber = serialNumber;
        this.ipAddress = ipAddress;
        this.mqttClient = mqttClient;
    }
    get mqttSerial() {
        return this.serialNumber;
    }
    emitDevice(rootTopic) {
        const topic = `${rootTopic}/device/${this.mqttSerial}/`;
        this.mqttClient.publish(topic + 'type', this.type);
        this.mqttClient.publish(topic + 'ip-address', this.ipAddress);
    }
    disconnect() {
        this.mqttClient.end(true);
    }
}
exports.Camera = Camera;
