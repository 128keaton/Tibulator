import { Input } from './input';
import { Sensor } from './sensor';

export class Device {
  inputs: Input[] = [];
  sensors: Sensor[] = [];

  constructor(
    readonly serialNumber: string,
    readonly ipAddress: string,
    readonly firmwareVersion: string,
    readonly firmwareName: string,
  ) {}

  get mqttSerial(): string {
    return this.serialNumber.replaceAll('.', '-');
  }
}
