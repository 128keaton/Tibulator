export type InputType = 'RANDOM' | 'ARRAY';
export interface Input {
  readonly name: string;
  readonly type: InputType;
  readonly initialValue?: string,
  lastValue?: string;
  getValue(): string;
}
