import { Sensor, SensorType } from './sensor';
export declare class HumiditySensor implements Sensor {
    readonly name: string;
    private rangeLow;
    private rangeHigh;
    readonly emissionRate: number;
    readonly type: SensorType;
    lastValue?: string;
    constructor(name?: string, rangeLow?: number, rangeHigh?: number, emissionRate?: number);
    getValue(): string;
}
