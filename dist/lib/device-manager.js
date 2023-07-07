"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceManager = void 0;
const mqtt_1 = require("mqtt");
class DeviceManager {
    devices;
    rootTopic;
    globalTick;
    scanRate;
    mainClient;
    scanClient;
    ready = false;
    stopped = false;
    emissionCounts = {};
    constructor(devices, mqttConfig, mqttURL, rootTopic, globalTick = 1000, scanRate = 5000) {
        this.devices = devices;
        this.rootTopic = rootTopic;
        this.globalTick = globalTick;
        this.scanRate = scanRate;
        const scanClientConfig = {};
        Object.assign(scanClientConfig, mqttConfig);
        scanClientConfig.clientId =
            scanClientConfig.clientId + 'scanClient' || 'scanClient';
        this.mainClient = (0, mqtt_1.connect)(mqttURL, mqttConfig);
        this.scanClient = (0, mqtt_1.connect)(mqttURL, scanClientConfig);
        console.log({ scanRate, globalTick, rootTopic });
        this.mainClient.on('connect', () => {
            console.log('MQTT connected!');
            this.ready = true;
        });
        const scanTopic = `${this.rootTopic}/management/scan`;
        this.scanClient.subscribe(scanTopic, (err, granted) => {
            if (!granted)
                console.log(err);
            this.scanClient.on('message', (topic) => {
                if (topic !== scanTopic)
                    return;
                this.devices.forEach((device) => this.emitDevice(device));
            });
        });
    }
    start() {
        if (!this.ready) {
            setTimeout(() => this.start(), this.globalTick);
            console.log('MQTT not connected, retrying...');
            this.stopped = true;
            return;
        }
        console.log('Starting tick...');
        this.stopped = false;
        this.tick();
        this.emitScan();
    }
    stop() {
        console.log('Stopping tick...');
        this.stopped = true;
    }
    tick() {
        console.log('Tick');
        this.devices.forEach((device) => {
            device.sensors.forEach((sensor) => {
                if (this.shouldEmit(device, sensor))
                    this.emitSensor(device, sensor);
            });
            device.inputs.forEach((input) => {
                this.emitInput(device, input);
            });
        });
        if (!this.stopped)
            setTimeout(() => this.tick(), this.globalTick);
    }
    emitScan() {
        console.log('Emitting scan...');
        this.mainClient.publish(`${this.rootTopic}/management/scan`, ' ');
        if (!this.stopped)
            setTimeout(() => this.emitScan(), this.scanRate);
    }
    emitDevice(device) {
        const topic = `${this.rootTopic}/device/${device.mqttSerial}/`;
        this.mainClient.publish(topic + 'ip-address', device.ipAddress);
        this.mainClient.publish(topic + 'firmware-version', device.firmwareVersion);
        this.mainClient.publish(topic + 'firmware-version', device.firmwareName);
    }
    emitSensor(device, sensor) {
        const topic = `${this.rootTopic}/device/${device.mqttSerial}/${sensor.name}`;
        this.mainClient.publish(topic, sensor.getValue());
    }
    emitInput(device, input) {
        const topic = `${this.rootTopic}/device/${device.mqttSerial}/${input.name}`;
        this.mainClient.publish(topic, input.getValue() ? 'true' : 'false');
    }
    shouldEmit(device, sensor) {
        if (this.emissionCounts.hasOwnProperty(device.serialNumber)) {
            if (this.emissionCounts.hasOwnProperty(sensor.name)) {
                const emissionCount = this.emissionCounts[device.serialNumber][sensor.name];
                if (emissionCount + 1000 > sensor.emissionRate) {
                    this.emissionCounts[device.serialNumber][sensor.name] = 0;
                    return true;
                }
                this.emissionCounts[device.serialNumber][sensor.name] += 1000;
                return false;
            }
            this.emissionCounts[device.serialNumber][sensor.name] = 1000;
            return true;
        }
        this.emissionCounts[device.serialNumber] = { [sensor.name]: 1000 };
        return true;
    }
}
exports.DeviceManager = DeviceManager;
