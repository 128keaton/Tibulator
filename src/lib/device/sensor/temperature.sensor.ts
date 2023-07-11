import { Sensor, SensorType } from './sensor';

export class TemperatureSensor implements Sensor {
  readonly type: SensorType = 'TEMPERATURE';

  lastValue?: string;

  constructor(
    readonly name: string = 'temperature',
    private rangeLow = 23,
    private rangeHigh = 36,
    readonly emissionRate = 5000,
  ) {}

  getValue(): string {
    this.lastValue = `${(
      Math.random() * (this.rangeHigh - this.rangeLow + 1) +
      this.rangeLow
    ).toFixed(1)}`;

    return this.lastValue;
  }
}
