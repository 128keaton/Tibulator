import { Config } from './config';
import { Device, HumiditySensor, Input, InputConfig, SensorConfig, TemperatureSensor } from '../device';

export class Parser {
  readonly config: Config;

  constructor(rawConfig: string) {
    if (!rawConfig.length) throw new Error('Invalid string');

    this.config = JSON.parse(rawConfig);
  }

  generateDevices() {
    const devices: Device[] = [];

    const startingSerial = '0.36.119.87.110.';

    for (
      let deviceIndex = 0;
      deviceIndex < this.config.deviceCount;
      deviceIndex++
    ) {
      const serialNumber = `${startingSerial}${String(deviceIndex).padStart(
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

      const device = new Device(
        serialNumber,
        ipAddress,
        this.config.firmwareVersion,
        this.config.firmwareName,
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
