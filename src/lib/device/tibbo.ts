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

  public emitDevice(rootTopic: string) {
    const topic = `${rootTopic}/${this.topic}/${this.locationID}/${this.mqttSerial}/`;

    this.mqttClient.publish(topic + 'type', this.type);
    this.mqttClient.publish(topic + 'ipAddress', this.ipAddress);
    this.mqttClient.publish(topic + 'firmwareVersion', this.firmwareVersion);
    this.mqttClient.publish(topic + 'firmwareName', this.firmwareName);
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
