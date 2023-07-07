import { IClientOptions } from 'mqtt';
import { Device } from './device';
export declare class DeviceManager {
    private readonly devices;
    private readonly rootTopic;
    private readonly globalTick;
    private readonly scanRate;
    private scanClient;
    private mainClient;
    private retryCount;
    private ready;
    private stopped;
    private emissionCounts;
    constructor(devices: Device[], mqttConfig: IClientOptions, mqttURL: string, rootTopic: string, globalTick?: number, scanRate?: number);
    start(): void;
    private tick;
    private disconnectAll;
    private emitScan;
    private shouldEmit;
}
