export type SensorType = 'TEMPERATURE' | 'HUMIDITY';
export interface Sensor {
    name: string;
    emissionRate: number;
    type: SensorType;
    getValue(): string;
}
