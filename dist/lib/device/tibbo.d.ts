import { Input } from './input';
import { Sensor } from './sensor';
import { Client } from 'mqtt';
import { Device } from './device';
export declare class Tibbo implements Device {
    readonly serialNumber: string;
    readonly ipAddress: string;
    readonly firmwareVersion: string;
    readonly firmwareName: string;
    readonly topic: string;
    private readonly mqttClient;
    inputs: Input[];
    sensors: Sensor[];
    readonly type = "TIBBO";
    constructor(serialNumber: string, ipAddress: string, firmwareVersion: string, firmwareName: string, topic: string, mqttClient: Client);
    get mqttSerial(): string;
    emitDevice(rootTopic: string): void;
    emitInput(rootTopic: string, input: Input): void;
    emitSensor(rootTopic: string, sensor: Sensor): void;
    disconnect(): Client;
}
