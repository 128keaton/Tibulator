import { IClientOptions } from 'mqtt';
import { InputConfig, SensorConfig } from '../device';
export interface Config {
    tibboCount: number;
    tibboTopic?: string;
    cameraCount?: number;
    cameraTopic?: string;
    locationID?: number;
    managementTopic?: string;
    sensors?: SensorConfig[];
    inputs?: InputConfig[];
    firmwareVersion: string;
    firmwareName: string;
    globalTick?: number;
    scanRate?: number;
    mqtt: {
        rootTopic: string;
        options: IClientOptions & {
            url: string;
        };
    };
}
