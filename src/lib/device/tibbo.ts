import { Input } from './input';
import { Sensor } from './sensor';
import { Client } from 'mqtt';
import { Device } from './device';

export class Tibbo implements Device {
  inputs: Input[] = [];
  sensors: Sensor[] = [];

  readonly type = 'TIBBO';

  constructor(
    readonly serialNumber: string,
    readonly ipAddress: string,
    readonly firmwareVersion: string,
    readonly firmwareName: string,
    readonly topic: string = 'device',
    readonly locationID: number = 1,
    private readonly mqttClient: Client,
  ) {}

  get mqttSerial(): string {
    return this.serialNumber.split('.').join(':');
  }

  get deviceProperties(): string {
    const properties = [
      this.type,
      this.ipAddress,
      this.firmwareVersion,
      this.firmwareName,
    ];

    return properties.join(',');
  }

  public emitDevice(rootTopic: string) {
    const topic = `${rootTopic}/${this.topic}/${this.locationID}/${this.mqttSerial}/_info`;

    this.mqttClient.publish(topic, this.deviceProperties);
  }

  public emitInput(rootTopic: string, input: Input, value?: string) {
    const topic = `${rootTopic}/${this.topic}/${this.locationID}/${this.mqttSerial}/${input.name}`;
    this.mqttClient.publish(topic, `${input.getValue(value)}`);
  }

  public emitSensor(rootTopic: string, sensor: Sensor) {
    const topic = `${rootTopic}/${this.topic}/${this.locationID}/${this.mqttSerial}/${sensor.name}`;

    this.mqttClient.publish(topic, sensor.getValue());
  }

  public disconnect() {
    return this.mqttClient.end(true);
  }
}
