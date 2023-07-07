import { Client, IClientOptions, connect } from 'mqtt';
import { Device, Input, Sensor } from './device';

export class DeviceManager {
  private mainClient: Client;
  private scanClient: Client;

  private ready = false;
  private stopped = false;

  private emissionCounts: { [key: string]: { [key: string]: number } } = {};

  constructor(
    private readonly devices: Device[],
    mqttConfig: IClientOptions,
    mqttURL: string,
    private readonly rootTopic: string,
    private readonly globalTick: number = 1000,
    private readonly scanRate: number = 5000,
  ) {
    const scanClientConfig: IClientOptions = {};
    Object.assign(scanClientConfig, mqttConfig);
    scanClientConfig.clientId =
      scanClientConfig.clientId + 'scanClient' || 'scanClient';

    this.mainClient = connect(mqttURL, mqttConfig);
    this.scanClient = connect(mqttURL, scanClientConfig);

    console.log({ scanRate, globalTick, rootTopic });

    this.mainClient.on('connect', () => {
      console.log('MQTT connected!');
      this.ready = true;
    });

    const scanTopic = `${this.rootTopic}/management/scan`;

    this.scanClient.subscribe(scanTopic, (err, granted) => {
      if (!granted) console.log(err);
      if (granted) console.log('granted');
    });

    this.scanClient.on('message', (topic) => {
      if (topic !== scanTopic) return;

      this.devices.forEach((device) => this.emitDevice(device));
    });
  }

  public start() {
    if (!this.ready) {
      setTimeout(() => this.start(), this.globalTick);
      console.log('MQTT not connected, retrying...');
      this.stopped = true;
      return;
    }

    console.log('Starting tick...');
    this.stopped = false;
    this.tick();
    this.emitScan();
  }

  public stop() {
    console.log('Stopping tick...');
    this.stopped = true;
  }

  private tick() {
    console.log('Tick');
    this.devices.forEach((device) => {
      device.sensors.forEach((sensor) => {
        if (this.shouldEmit(device, sensor)) this.emitSensor(device, sensor);
      });

      device.inputs.forEach((input) => {
        this.emitInput(device, input);
      });
    });

    if (!this.stopped) setTimeout(() => this.tick(), this.globalTick);
  }

  private emitScan() {
    console.log('Emitting scan...');
    this.mainClient.publish(`${this.rootTopic}/management/scan`, ' ');
    if (!this.stopped) setTimeout(() => this.emitScan(), this.scanRate);
  }

  private emitDevice(device: Device) {
    const topic = `${this.rootTopic}/device/${device.mqttSerial}/`;

    this.mainClient.publish(topic + 'ip-address', device.ipAddress);
    this.mainClient.publish(topic + 'firmware-version', device.firmwareVersion);
    this.mainClient.publish(topic + 'firmware-version', device.firmwareName);
  }

  private emitSensor(device: Device, sensor: Sensor) {
    const topic = `${this.rootTopic}/device/${device.mqttSerial}/${sensor.name}`;

    this.mainClient.publish(topic, sensor.getValue());
  }

  private emitInput(device: Device, input: Input) {
    const topic = `${this.rootTopic}/device/${device.mqttSerial}/${input.name}`;
    this.mainClient.publish(topic, input.getValue() ? 'true' : 'false');
  }

  private shouldEmit(device: Device, sensor: Sensor): boolean {
    if (this.emissionCounts.hasOwnProperty(device.serialNumber)) {
      if (this.emissionCounts.hasOwnProperty(sensor.name)) {
        const emissionCount =
          this.emissionCounts[device.serialNumber][sensor.name];

        if (emissionCount + 1000 > sensor.emissionRate) {
          this.emissionCounts[device.serialNumber][sensor.name] = 0;
          return true;
        }
        this.emissionCounts[device.serialNumber][sensor.name] += 1000;
        return false;
      }
      this.emissionCounts[device.serialNumber][sensor.name] = 1000;
      return true;
    }

    this.emissionCounts[device.serialNumber] = { [sensor.name]: 1000 };

    return true;
  }
}
