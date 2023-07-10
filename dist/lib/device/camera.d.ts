import { Device } from './device';
import { Client } from 'mqtt';
export declare class Camera implements Device {
    readonly serialNumber: string;
    readonly ipAddress: string;
    readonly topic: string;
    private readonly mqttClient;
    readonly type = "CAMERA";
    constructor(serialNumber: string, ipAddress: string, topic: string, mqttClient: Client);
    get mqttSerial(): string;
    emitDevice(rootTopic: string): void;
    disconnect(): void;
}
