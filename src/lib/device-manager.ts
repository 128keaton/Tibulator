import { Client, IClientOptions, connect } from 'mqtt';
import { Device } from './device';
import { Tibbo } from './device/tibbo';

export class DeviceManager {
  private scanClient: Client;
  private mainClient: Client;

  private retryCount = 0;
  private ready = false;
  private stopped = false;

  private emissionCounts: { [key: string]: { [key: string]: number } } = {};

  onScan = () => {
    return;
  };

  onTick = () => {
    return;
  };
  onError = (err: string) => {
    console.error(err);
  };
  onConnect = (host: string) => {
    console.log(`Connected to ${host}`);
    return;
  };

  constructor(
    private readonly devices: Device[],
    mqttConfig: IClientOptions,
    mqttURL: string,
    private readonly rootTopic: string,
    private readonly globalTick: number = 1000,
    private readonly scanRate: number = 5000,
    private readonly managementTopic = 'management',
    private readonly locationID = 1,
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

    this.mainClient.on('connect', () => {
      this.onConnect(mqttURL);
      this.ready = true;
    });

    const scanTopic = `${this.rootTopic}/${this.managementTopic}/${this.locationID}/scan`;

    this.scanClient.subscribe(scanTopic, (err, granted) => {
      if (!granted) this.onError(err.message);

      this.scanClient.on('message', (topic) => {
        if (topic !== scanTopic) return;

        this.devices.forEach((device) => device.emitDevice(this.rootTopic));
      });
    });
  }

  public start() {
    if (!this.ready && this.retryCount < 10) {
      setTimeout(() => this.start(), this.globalTick + 1000);
      if (this.retryCount >= 2) this.onError('MQTT not connected, retrying...');

      this.stopped = true;
      this.retryCount += 1;
      return;
    }

    this.stopped = false;
    this.retryCount = 0;
    this.tick();
    this.emitScan();
  }

  public emitScan() {
    this.onScan();
    this.mainClient.publish(
      `${this.rootTopic}/${this.managementTopic}/${this.locationID}/scan`,
      `${Date.now()}`,
    );
    if (!this.stopped) setTimeout(() => this.emitScan(), this.scanRate);
    else this.disconnectAll();
  }

  private tick() {
    this.onTick();
    this.devices.forEach((device) => {
      if (device.type === 'TIBBO') {
        const tibbo: Tibbo = device as Tibbo;

        tibbo.sensors.forEach((sensor) => {
          if (this.shouldEmit(device, sensor.name, sensor.emissionRate))
            tibbo.emitSensor(this.rootTopic, sensor);
        });

        tibbo.inputs.forEach((input) => {
          tibbo.emitInput(this.rootTopic, input);
        });
      }
    });

    if (!this.stopped) setTimeout(() => this.tick(), this.globalTick);
    else this.disconnectAll();
  }

  private disconnectAll() {
    this.devices.forEach((device) => device.disconnect());
  }

  private shouldEmit(
    device: Device,
    sensorName: string,
    emissionRate: number,
  ): boolean {
    if (this.emissionCounts.hasOwnProperty(device.serialNumber)) {
      if (this.emissionCounts[device.serialNumber].hasOwnProperty(sensorName)) {
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
