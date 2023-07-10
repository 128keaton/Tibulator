import { Config } from './config';
import { ArrayInput, Camera, Device, HumiditySensor, InputConfig, RandomInput, SensorConfig, TemperatureSensor } from '../device';
import { Tibbo } from '../device/tibbo';
export declare class Parser {
    readonly config: Config;
    private serialOffset;
    constructor(rawConfig: string);
    generateDevices(): Device[];
    generateRandomInput(config: InputConfig): RandomInput;
    generateArrayInput(config: InputConfig): ArrayInput;
    generateInput(config: InputConfig): ArrayInput | RandomInput;
    generateSensor(config: SensorConfig): HumiditySensor | TemperatureSensor;
    generateTibbo(serialNumber: string): Tibbo;
    generateCamera(): Camera;
    generateMAC(): string;
    generateIP(): string;
}
