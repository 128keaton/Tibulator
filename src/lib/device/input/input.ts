export class Input {
  constructor(
    readonly name: string,
    private readonly probability: number | 'never' = 0.5,
    private readonly trueValue = true,
    private readonly falseValue = false,
  ) {}

  getValue(): any {
    if (this.probability === 'never') return this.falseValue;

    const value = (Math.random() < this.probability) as boolean;

    return value ? this.trueValue : this.falseValue;
  }
}
