import { Client, IClientOptions, connect } from 'mqtt';
import { Device } from './device';

export class DeviceManager {
  private scanClient: Client;
  private mainClient: Client;

  private retryCount = 0;
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
    const mainClientConfig: IClientOptions = {};

    Object.assign(scanClientConfig, mqttConfig);
    Object.assign(mainClientConfig, mqttConfig);

    scanClientConfig.clientId =
      scanClientConfig.clientId + '-scanClient' || 'scanClient';

    mainClientConfig.clientId =
      mainClientConfig.clientId + '-mainClient' || 'mainClient';

    this.mainClient = connect(mqttURL, mainClientConfig);
    this.scanClient = connect(mqttURL, scanClientConfig);

    console.log({ scanRate, globalTick, rootTopic });

    this.mainClient.on('connect', () => {
      console.log('MQTT connected!');
      this.ready = true;
    });

    const scanTopic = `${this.rootTopic}/management/scan`;

    this.scanClient.subscribe(scanTopic, (err, granted) => {
      if (!granted) console.log(err);

      this.scanClient.on('message', (topic) => {
        if (topic !== scanTopic) return;

        this.devices.forEach((device) => device.emitDevice(this.rootTopic));
      });
    });
  }

  public start() {
    if (!this.ready && this.retryCount < 10) {
      setTimeout(() => this.start(), this.globalTick + 1000);
      if (this.retryCount >= 2) console.log('MQTT not connected, retrying...');

      this.stopped = true;
      this.retryCount += 1;
      return;
    }

    console.log('Starting tick...');
    this.stopped = false;
    this.retryCount = 0;
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
        if (this.shouldEmit(device, sensor.name, sensor.emissionRate))
          device.emitSensor(this.rootTopic, sensor);
      });

      device.inputs.forEach((input) => {
        device.emitInput(this.rootTopic, input);
      });
    });

    if (!this.stopped) setTimeout(() => this.tick(), this.globalTick);
    else this.disconnectAll();
  }

  private disconnectAll() {
    this.devices.forEach((device) => device.disconnect());
  }

  private emitScan() {
    console.log('Emitting scan...');
    this.mainClient.publish(`${this.rootTopic}/management/scan`, ' ');
    if (!this.stopped) setTimeout(() => this.emitScan(), this.scanRate);
    else this.disconnectAll();
  }

  private shouldEmit(
    device: Device,
    sensorName: string,
    emissionRate: number,
  ): boolean {
    if (this.emissionCounts.hasOwnProperty(device.serialNumber)) {
      if (this.emissionCounts.hasOwnProperty(sensorName)) {
        const emissionCount =
          this.emissionCounts[device.serialNumber][sensorName];

        if (emissionCount + 1000 > emissionRate) {
          this.emissionCounts[device.serialNumber][sensorName] = 0;
          return true;
        }
        this.emissionCounts[device.serialNumber][sensorName] += 1000;
        return false;
      }
      this.emissionCounts[device.serialNumber][sensorName] = 1000;
      return true;
    }

    this.emissionCounts[device.serialNumber] = { [sensorName]: 1000 };

    return true;
  }
}
