import { Sensor, SensorType } from './sensor';

export class HumiditySensor implements Sensor {
  readonly type: SensorType = 'HUMIDITY';

  lastValue?: string;

  constructor(
    readonly name: string = 'humidity',
    private rangeLow = 15,
    private rangeHigh = 82,
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
