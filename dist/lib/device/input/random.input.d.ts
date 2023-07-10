import { Input, InputType } from './input';
export declare class RandomInput implements Input {
    readonly name: string;
    private readonly probability;
    private readonly trueValue;
    private readonly falseValue;
    readonly type: InputType;
    constructor(name: string, probability?: number | 'never', trueValue?: boolean, falseValue?: boolean);
    getValue(): any;
}
