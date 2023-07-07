import { Config } from './config';
import { Camera, Device, HumiditySensor, Input, InputConfig, SensorConfig, TemperatureSensor } from '../device';
import { Tibbo } from '../device/tibbo';
export declare class Parser {
    readonly config: Config;
    private serialOffset;
    constructor(rawConfig: string);
    generateDevices(): Device[];
    generateInput(config: InputConfig): Input;
    generateSensor(config: SensorConfig): HumiditySensor | TemperatureSensor;
    generateTibbo(serialNumber: string): Tibbo;
    generateCamera(): Camera;
    generateMAC(): string;
    generateIP(): string;
}
