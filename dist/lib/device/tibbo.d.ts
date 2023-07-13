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
    readonly locationID: number;
    private readonly mqttClient;
    inputs: Input[];
    sensors: Sensor[];
    readonly type = "TIBBO";
    constructor(serialNumber: string, ipAddress: string, firmwareVersion: string, firmwareName: string, topic: string, locationID: number, mqttClient: Client);
    get mqttSerial(): string;
    get deviceProperties(): string;
    emitDevice(rootTopic: string): void;
    emitInput(rootTopic: string, input: Input, value?: string): void;
    emitSensor(rootTopic: string, sensor: Sensor): void;
    disconnect(): Client;
}
