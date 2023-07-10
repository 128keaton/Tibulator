import { Device } from './device';
import { Client } from 'mqtt';

export class Camera implements Device {
  readonly type = 'CAMERA';

  constructor(
    readonly serialNumber: string,
    readonly ipAddress: string,
    readonly topic: string = 'device',
    private readonly mqttClient: Client,
  ) {}

  get mqttSerial(): string {
    return this.serialNumber;
  }

  public emitDevice(rootTopic: string) {
    const topic = `${rootTopic}/${this.topic}/${this.mqttSerial}/`;

    this.mqttClient.publish(topic + 'type', this.type);
    this.mqttClient.publish(topic + 'ip-address', this.ipAddress);
  }

  disconnect() {
    this.mqttClient.end(true);
  }
}
