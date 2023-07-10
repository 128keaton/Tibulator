import { Input, InputType } from './input';

export class ArrayInput implements Input {
  readonly type: InputType = 'ARRAY';
  constructor(readonly name: string, private readonly values: any[]) {}
  getValue(): any {
    return this.values[Math.floor(Math.random() * this.values.length)];
  }
}
