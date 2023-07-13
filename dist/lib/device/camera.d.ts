import { Device } from './device';
import { Client } from 'mqtt';
export declare class Camera implements Device {
    readonly serialNumber: string;
    readonly ipAddress: string;
    readonly topic: string;
    readonly locationID: number;
    private readonly mqttClient;
    readonly type = "CAMERA";
    constructor(serialNumber: string, ipAddress: string, topic: string, locationID: number, mqttClient: Client);
    get mqttSerial(): string;
    get deviceProperties(): string;
    emitDevice(rootTopic: string): void;
    disconnect(): void;
}
