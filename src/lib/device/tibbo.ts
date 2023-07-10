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
    private readonly mqttClient: Client,
  ) {}

  get mqttSerial(): string {
    return this.serialNumber.split('.').join(':');
  }

  public emitDevice(rootTopic: string) {
    const topic = `${rootTopic}/${this.topic}/${this.mqttSerial}/`;

    this.mqttClient.publish(topic + 'type', this.type);
    this.mqttClient.publish(topic + 'ip-address', this.ipAddress);
    this.mqttClient.publish(topic + 'firmware-version', this.firmwareVersion);
    this.mqttClient.publish(topic + 'firmware-name', this.firmwareName);
  }

  public emitInput(rootTopic: string, input: Input) {
    const topic = `${rootTopic}/${this.topic}/${this.mqttSerial}/${input.name}`;
    this.mqttClient.publish(topic, `${input.getValue()}`);
  }

  public emitSensor(rootTopic: string, sensor: Sensor) {
    const topic = `${rootTopic}/${this.topic}/${this.mqttSerial}/${sensor.name}`;

    this.mqttClient.publish(topic, sensor.getValue());
  }

  public disconnect() {
    return this.mqttClient.end(true);
  }
}
