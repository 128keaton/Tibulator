import { Device } from './device';
import { Client } from 'mqtt';

export class Camera implements Device {
  readonly type = 'CAMERA';

  constructor(
    readonly serialNumber: string,
    readonly ipAddress: string,
    readonly topic: string = 'device',
    readonly locationID: number = 1,
    private readonly mqttClient: Client,
  ) {}

  get mqttSerial(): string {
    return this.serialNumber;
  }
  get deviceProperties(): string {
    const properties = [this.type, this.ipAddress];

    return properties.join(',');
  }

  public emitDevice(rootTopic: string) {
    const topic = `${rootTopic}/${this.topic}/${this.locationID}/${this.mqttSerial}/_info`;

    this.mqttClient.publish(topic, this.deviceProperties);
  }

  disconnect() {
    this.mqttClient.end(true);
  }
}
