export interface SensorConfig {
  name?: string;
  type: 'TEMPERATURE' | 'HUMIDITY';
  rangeLow: number;
  rangeHigh: number;
  emissionRate: number;
}
