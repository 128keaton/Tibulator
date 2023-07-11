import { Config } from './config';
import {
  ArrayInput,
  Camera,
  Device,
  HumiditySensor,
  InputConfig,
  RandomInput,
  SensorConfig,
  TemperatureSensor,
} from '../device';
import { connect, IClientOptions } from 'mqtt';
import { Tibbo } from '../device/tibbo';

export class Parser {
  readonly config: Config;

  private serialOffset = 110;

  constructor(rawConfig: string) {
    if (!rawConfig.length) throw new Error('Invalid string');

    this.config = JSON.parse(rawConfig);
  }

  generateDevices() {
    if (this.config.tibboCount > 2999)
      throw new Error("Don't even think about it (too many Tibbo devices)");

    const devices: Device[] = [];

    const startingSerial = `0.36.119.87.${this.serialOffset}`;

    for (
      let tibboIndex = 0;
      tibboIndex < this.config.tibboCount;
      tibboIndex++
    ) {
      if (tibboIndex > 999 && this.serialOffset === 110)
        this.serialOffset = 111;
      else if (tibboIndex > 1999 && this.serialOffset === 111)
        this.serialOffset = 112;

      const serialNumber = `${startingSerial}.${String(tibboIndex).padStart(
        3,
        '0',
      )}`;

      devices.push(this.generateTibbo(serialNumber));
    }

    for (
      let cameraIndex = 0;
      cameraIndex < (this.config.cameraCount || 0);
      cameraIndex++
    ) {
      devices.push(this.generateCamera());
    }

    return devices;
  }

  generateRandomInput(config: InputConfig) {
    return new RandomInput(
      config.name,
      config.probability,
      config.trueValue,
      config.falseValue,
      config.initialValue || config.trueValue || config.falseValue,
    );
  }

  generateArrayInput(config: InputConfig) {
    return new ArrayInput(
      config.name,
      config.values || [],
      config.initialValue || (config.values || [])[0],
    );
  }

  generateInput(config: InputConfig) {
    if (config.values) {
      return this.generateArrayInput(config);
    }
    return this.generateRandomInput(config);
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

  generateTibbo(serialNumber: string) {
    const tibboConfig: IClientOptions = {};
    Object.assign(tibboConfig, this.config.mqtt.options);
    tibboConfig.clientId = serialNumber;

    const client = connect(this.config.mqtt.options.url, tibboConfig);

    const tibbo = new Tibbo(
      serialNumber,
      this.generateIP(),
      this.config.firmwareVersion,
      this.config.firmwareName,
      this.config.tibboTopic,
      this.config.locationID,
      client,
    );

    tibbo.inputs = (this.config.inputs || []).map((input) => {
      return this.generateInput(input);
    });

    tibbo.sensors = (this.config.sensors || []).map(this.generateSensor);

    return tibbo;
  }

  generateCamera() {
    const ipAddress = this.generateIP();
    const serialNumber = this.generateMAC();

    const cameraConfig: IClientOptions = {};
    Object.assign(cameraConfig, this.config.mqtt.options);
    cameraConfig.clientId = serialNumber;

    const client = connect(this.config.mqtt.options.url, cameraConfig);

    return new Camera(
      serialNumber,
      ipAddress,
      this.config.cameraTopic,
      this.config.locationID,
      client,
    );
  }

  generateMAC() {
    return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, function () {
      return '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16));
    });
  }

  generateIP() {
    return (
      Math.floor(Math.random() * 255) +
      1 +
      '.' +
      Math.floor(Math.random() * 255) +
      '.' +
      Math.floor(Math.random() * 255) +
      '.' +
      Math.floor(Math.random() * 255)
    );
  }
}
