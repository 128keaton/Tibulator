import { IClientOptions } from 'mqtt';
import { Device } from './device';
export declare class DeviceManager {
    private readonly devices;
    private readonly rootTopic;
    private readonly globalTick;
    private readonly scanRate;
    private mainClient;
    private scanClient;
    private ready;
    private stopped;
    private emissionCounts;
    constructor(devices: Device[], mqttConfig: IClientOptions, mqttURL: string, rootTopic: string, globalTick?: number, scanRate?: number);
    start(): void;
    stop(): void;
    private tick;
    private emitScan;
    private emitDevice;
    private emitSensor;
    private emitInput;
    private shouldEmit;
}
