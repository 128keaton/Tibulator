import { Config } from './config';
import {
  Device,
  HumiditySensor,
  Input,
  InputConfig,
  SensorConfig,
  TemperatureSensor,
} from '../device';
import { connect, IClientOptions } from 'mqtt';

export class Parser {
  readonly config: Config;

  private serialOffset = 110;

  constructor(rawConfig: string) {
    if (!rawConfig.length) throw new Error('Invalid string');

    this.config = JSON.parse(rawConfig);
  }

  generateDevices() {
    if (this.config.deviceCount > 2999)
      throw new Error("Don't even think about it (too many devices)");

    const devices: Device[] = [];

    const startingSerial = `0.36.119.87.${this.serialOffset}`;

    for (
      let deviceIndex = 0;
      deviceIndex < this.config.deviceCount;
      deviceIndex++
    ) {
      if (deviceIndex > 999 && this.serialOffset === 110)
        this.serialOffset = 111;
      else if (deviceIndex > 1999 && this.serialOffset === 111)
        this.serialOffset = 112;

      const serialNumber = `${startingSerial}.${String(deviceIndex).padStart(
        3,
        '0',
      )}`;
      const ipAddress =
        Math.floor(Math.random() * 255) +
        1 +
        '.' +
        Math.floor(Math.random() * 255) +
        '.' +
        Math.floor(Math.random() * 255) +
        '.' +
        Math.floor(Math.random() * 255);

      const deviceConfig: IClientOptions = {};
      Object.assign(deviceConfig, this.config.mqtt.options);
      deviceConfig.clientId = serialNumber;

      const client = connect(this.config.mqtt.options.url, deviceConfig);

      const device = new Device(
        serialNumber,
        ipAddress,
        this.config.firmwareVersion,
        this.config.firmwareName,
        client,
      );

      device.inputs = (this.config.inputs || []).map(this.generateInput);
      device.sensors = (this.config.sensors || []).map(this.generateSensor);

      devices.push(device);
    }

    return devices;
  }

  generateInput(config: InputConfig) {
    return new Input(config.name, config.probability);
  }

  generateSensor(config: SensorConfig) {
    switch (config.type) {
      case 'HUMIDITY':
        return new HumiditySensor(
          config.name,
          config.rangeLow,
          config.rangeHigh,
          config.emissionRate,
        );
      case 'TEMPERATURE':
        return new TemperatureSensor(
          config.name,
          config.rangeLow,
          config.rangeHigh,
          config.emissionRate,
        );
    }
  }
}
