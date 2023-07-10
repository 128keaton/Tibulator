import { Input, InputType } from './input';
export declare class ArrayInput implements Input {
    readonly name: string;
    private readonly values;
    readonly type: InputType;
    constructor(name: string, values: any[]);
    getValue(): any;
}
