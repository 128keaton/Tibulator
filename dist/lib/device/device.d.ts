import { Input } from './input';
import { Sensor } from './sensor';
import { Client } from 'mqtt';
export declare class Device {
    readonly serialNumber: string;
    readonly ipAddress: string;
    readonly firmwareVersion: string;
    readonly firmwareName: string;
    private readonly mqttClient;
    inputs: Input[];
    sensors: Sensor[];
    constructor(serialNumber: string, ipAddress: string, firmwareVersion: string, firmwareName: string, mqttClient: Client);
    get mqttSerial(): string;
    emitDevice(rootTopic: string): void;
    emitInput(rootTopic: string, input: Input): void;
    emitSensor(rootTopic: string, sensor: Sensor): void;
    disconnect(): Client;
}
