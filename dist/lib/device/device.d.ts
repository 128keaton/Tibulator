export interface Device {
    readonly type: 'CAMERA' | 'TIBBO';
    readonly serialNumber: string;
    readonly ipAddress: string;
    get mqttSerial(): string;
    emitDevice(rootTopic: string): any;
    disconnect(): void;
}
