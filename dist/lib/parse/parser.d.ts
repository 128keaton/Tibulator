import { Config } from './config';
import { Device, HumiditySensor, Input, InputConfig, SensorConfig, TemperatureSensor } from '../device';
export declare class Parser {
    readonly config: Config;
    constructor(rawConfig: string);
    generateDevices(): Device[];
    generateInput(config: InputConfig): Input;
    generateSensor(config: SensorConfig): HumiditySensor | TemperatureSensor;
}
