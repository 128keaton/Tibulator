import { Input, InputType } from './input';
export declare class ArrayInput implements Input {
    readonly name: string;
    readonly values: any[];
    lastValue?: string;
    readonly initialValue?: string;
    readonly type: InputType;
    constructor(name: string, values: any[], initialValue?: string);
    getValue(): string;
}
