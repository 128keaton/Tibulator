export type InputType = 'RANDOM' | 'ARRAY';
export interface Input {
  readonly name: string;
  readonly type: InputType;
  getValue(): any;
}
