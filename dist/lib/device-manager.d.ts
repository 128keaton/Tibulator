import { IClientOptions } from 'mqtt';
import { Device } from './device';
export declare class DeviceManager {
    private readonly devices;
    private readonly rootTopic;
    private readonly globalTick;
    private readonly scanRate;
    private readonly managementTopic;
    private readonly locationID;
    private scanClient;
    private mainClient;
    private retryCount;
    private ready;
    private stopped;
    private emissionCounts;
    onScan: () => void;
    onTick: () => void;
    onError: (err: string) => void;
    onConnect: (host: string) => void;
    constructor(devices: Device[], mqttConfig: IClientOptions, mqttURL: string, rootTopic: string, globalTick?: number, scanRate?: number, managementTopic?: string, locationID?: number);
    start(): void;
    emitScan(): void;
    emitInput(inputName: string, value?: string): void;
    private tick;
    private disconnectAll;
    private shouldEmit;
}
