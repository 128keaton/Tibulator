import { IClientOptions } from 'mqtt';
import { InputConfig, SensorConfig } from '../device';

export interface Config {
  tibboCount: number;
  cameraCount?: number;
  sensors?: SensorConfig[];
  inputs?: InputConfig[];
  firmwareVersion: string;
  firmwareName: string;
  globalTick?: number;
  scanRate?: number;
  mqtt: {
    rootTopic: string;
    options: IClientOptions & { url: string };
  };
}
