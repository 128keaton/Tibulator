"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceManager = void 0;
const mqtt_1 = require("mqtt");
class DeviceManager {
    devices;
    rootTopic;
    globalTick;
    scanRate;
    scanClient;
    mainClient;
    retryCount = 0;
    ready = false;
    stopped = false;
    emissionCounts = {};
    constructor(devices, mqttConfig, mqttURL, rootTopic, globalTick = 1000, scanRate = 5000) {
        this.devices = devices;
        this.rootTopic = rootTopic;
        this.globalTick = globalTick;
        this.scanRate = scanRate;
        const scanClientConfig = {};
        const mainClientConfig = {};
        Object.assign(scanClientConfig, mqttConfig);
        Object.assign(mainClientConfig, mqttConfig);
        scanClientConfig.clientId =
            scanClientConfig.clientId + '-scanClient' || 'scanClient';
        mainClientConfig.clientId =
            mainClientConfig.clientId + '-mainClient' || 'mainClient';
        this.mainClient = (0, mqtt_1.connect)(mqttURL, mainClientConfig);
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
                this.devices.forEach((device) => device.emitDevice(this.rootTopic));
            });
        });
    }
    start() {
        if (!this.ready && this.retryCount < 10) {
            setTimeout(() => this.start(), this.globalTick + 1000);
            if (this.retryCount >= 2)
                console.log('MQTT not connected, retrying...');
            this.stopped = true;
            this.retryCount += 1;
            return;
        }
        console.log('Starting tick...');
        this.stopped = false;
        this.retryCount = 0;
        this.tick();
        this.emitScan();
    }
    tick() {
        console.log('Tick');
        this.devices.forEach((device) => {
            if (device.type === 'TIBBO') {
                const tibbo = device;
                tibbo.sensors.forEach((sensor) => {
                    if (this.shouldEmit(device, sensor.name, sensor.emissionRate))
                        tibbo.emitSensor(this.rootTopic, sensor);
                });
                tibbo.inputs.forEach((input) => {
                    tibbo.emitInput(this.rootTopic, input);
                });
            }
        });
        if (!this.stopped)
            setTimeout(() => this.tick(), this.globalTick);
        else
            this.disconnectAll();
    }
    disconnectAll() {
        this.devices.forEach((device) => device.disconnect());
    }
    emitScan() {
        console.log('Emitting scan...');
        this.mainClient.publish(`${this.rootTopic}/management/scan`, ' ');
        if (!this.stopped)
            setTimeout(() => this.emitScan(), this.scanRate);
        else
            this.disconnectAll();
    }
    shouldEmit(device, sensorName, emissionRate) {
        if (this.emissionCounts.hasOwnProperty(device.serialNumber)) {
            if (this.emissionCounts[device.serialNumber].hasOwnProperty(sensorName)) {
                const emissionCount = this.emissionCounts[device.serialNumber][sensorName];
                if (emissionCount + 1000 > emissionRate) {
                    this.emissionCounts[device.serialNumber][sensorName] = 0;
                    return true;
                }
                this.emissionCounts[device.serialNumber][sensorName] += 1000;
                return false;
            }
            this.emissionCounts[device.serialNumber][sensorName] = 1000;
            return true;
        }
        this.emissionCounts[device.serialNumber] = { [sensorName]: 1000 };
        return true;
    }
}
exports.DeviceManager = DeviceManager;
