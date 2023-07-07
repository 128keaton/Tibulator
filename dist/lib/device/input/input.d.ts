export declare class Input {
    readonly name: string;
    private readonly probability;
    constructor(name: string, probability?: number | 'never');
    getValue(): boolean;
}
