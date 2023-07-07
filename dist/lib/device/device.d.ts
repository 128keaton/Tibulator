import { Input } from './input';
import { Sensor } from './sensor';
export declare class Device {
    readonly serialNumber: string;
    readonly ipAddress: string;
    readonly firmwareVersion: string;
    readonly firmwareName: string;
    inputs: Input[];
    sensors: Sensor[];
    constructor(serialNumber: string, ipAddress: string, firmwareVersion: string, firmwareName: string);
    get mqttSerial(): string;
}
