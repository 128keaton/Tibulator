import { Input } from './input';
import { Sensor } from './sensor';
import { Client } from 'mqtt';

export class Device {
  inputs: Input[] = [];
  sensors: Sensor[] = [];

  constructor(
    readonly serialNumber: string,
    readonly ipAddress: string,
    readonly firmwareVersion: string,
    readonly firmwareName: string,
    private readonly mqttClient: Client,
  ) {}

  get mqttSerial(): string {
    return this.serialNumber.replaceAll('.', '-');
  }

  public emitDevice(rootTopic: string) {
    const topic = `${rootTopic}/device/${this.mqttSerial}/`;

    this.mqttClient.publish(topic + 'ip-address', this.ipAddress);
    this.mqttClient.publish(topic + 'firmware-version', this.firmwareVersion);
    this.mqttClient.publish(topic + 'firmware-version', this.firmwareName);
  }

  public emitInput(rootTopic: string, input: Input) {
    const topic = `${rootTopic}/device/${this.mqttSerial}/${input.name}`;
    this.mqttClient.publish(topic, input.getValue() ? 'true' : 'false');
  }

  public emitSensor(rootTopic: string, sensor: Sensor) {
    const topic = `${rootTopic}/device/${this.mqttSerial}/${sensor.name}`;

    this.mqttClient.publish(topic, sensor.getValue());
  }

  public disconnect() {
    return this.mqttClient.end(true);
  }
}
