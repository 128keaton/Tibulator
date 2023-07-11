export type SensorType = 'TEMPERATURE' | 'HUMIDITY';
export interface Sensor {
    name: string;
    emissionRate: number;
    type: SensorType;
    lastValue?: string;
    getValue(): string;
}
