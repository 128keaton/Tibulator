export interface InputConfig {
    name: string;
    probability?: number | 'never';
    trueValue?: never;
    falseValue?: never;
    values?: any[];
    initialValue?: string;
}
