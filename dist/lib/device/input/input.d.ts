export declare class Input {
    readonly name: string;
    private readonly probability;
    private readonly trueValue;
    private readonly falseValue;
    constructor(name: string, probability?: number | 'never', trueValue?: boolean, falseValue?: boolean);
    getValue(): any;
}
