import { Input, InputType } from './input';

export class ArrayInput implements Input {
  lastValue?: string;

  readonly initialValue?: string;
  readonly type: InputType = 'ARRAY';

  constructor(
    readonly name: string,
    public readonly values: any[],
    initialValue?: string,
  ) {
    this.initialValue = initialValue;
    this.lastValue = this.initialValue;
  }

  getValue(override?: string): string {
    if (override) {
      this.lastValue = override;
    } else {
      this.lastValue =
        this.values[Math.floor(Math.random() * this.values.length)];
    }


    return `${this.lastValue}`;
  }
}
