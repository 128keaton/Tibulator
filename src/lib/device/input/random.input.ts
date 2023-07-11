import { Input, InputType } from './input';

export class RandomInput implements Input {
  lastValue?: string;

  readonly type: InputType = 'RANDOM';
  readonly initialValue?: string;

  constructor(
    readonly name: string,
    private readonly probability: number | 'never' = 0.5,
    private readonly trueValue = 'true',
    private readonly falseValue = 'false',
    initialValue?: string,
  ) {
    this.initialValue = initialValue || 'false';
    this.lastValue = this.initialValue;
  }

  getValue(override?: string): string {
    if (override) {
      this.lastValue = override;
    } else {
      if (this.probability === 'never') {
        this.lastValue = this.getMappedValue(false);
        return this.lastValue;
      }

      const value = (Math.random() < this.probability) as boolean;

      this.lastValue = this.getMappedValue(value);
    }

    return this.lastValue;
  }

  getMappedValue(value?: boolean) {
    if (value === undefined) return this.falseValue;

    return value ? `${this.trueValue}` : `${this.falseValue}`;
  }
}
