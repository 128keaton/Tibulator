import { Input, InputType } from './input';
export declare class RandomInput implements Input {
    readonly name: string;
    private readonly probability;
    private readonly trueValue;
    private readonly falseValue;
    lastValue?: string;
    readonly type: InputType;
    readonly initialValue?: string;
    constructor(name: string, probability?: number | 'never', trueValue?: string, falseValue?: string, initialValue?: string);
    getValue(): string;
    getMappedValue(value?: boolean): string;
}
