export interface Device {
  readonly type: 'CAMERA' | 'TIBBO';
  readonly serialNumber: string;
  readonly ipAddress: string;
  readonly topic: string;
  readonly locationID: number;
  get mqttSerial(): string;
  emitDevice(rootTopic: string): any;
  disconnect(): void;
}
