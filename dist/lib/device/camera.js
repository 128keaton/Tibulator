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
    get deviceProperties() {
        const properties = [this.type, this.ipAddress];
        return properties.join(',');
    }
    emitDevice(rootTopic) {
        const topic = `${rootTopic}/${this.topic}/${this.locationID}/${this.mqttSerial}/_info`;
        this.mqttClient.publish(topic, this.deviceProperties);
    }
    disconnect() {
        this.mqttClient.end(true);
    }
}
exports.Camera = Camera;
