import { Sensor, SensorType } from './sensor';

export class TemperatureSensor implements Sensor {
  readonly type: SensorType = 'TEMPERATURE';

  constructor(
    readonly name: string = 'temperature',
    private rangeLow = 23,
    private rangeHigh = 36,
    readonly emissionRate = 5000,
  ) {}

  getValue(): string {
    return `${
      Math.random() * (this.rangeHigh - this.rangeLow + 1) + this.rangeLow
    }`;
  }
}
