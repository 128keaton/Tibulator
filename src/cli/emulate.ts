import * as blessed from 'blessed';
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from '../lib/parse/parser';
import { Tibbo } from '../lib/device/tibbo';
import { Device } from '../lib/device';
import { DeviceManager } from '../lib/device-manager';

export const runEmulation = (configPath: string) => {
  const screen = blessed.screen({
    smartCSR: true,
  });

  screen.title = 'Tibulator';

  const rawConfig = fs.readFileSync(path.resolve(configPath)).toString();

  if (!rawConfig || !rawConfig.length) return;

  const parser = new Parser(rawConfig);

  const titleBar = blessed.box({
    top: '0',
    left: 'center',
    right: 'center',
    align: 'center',
    width: '100%',
    height: '20%',
    tags: true,
    content: '{center}Tibulator: {red-fg}[disconnected]{/red-fg}{/center}',
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
      border: {
        fg: '#f0f0f0',
      },
    },
  });

  const tickBox = blessed.box({
    top: '20%',
    height: '25%',
    align: 'center',
    width: '50%',
    tags: true,
    content: '{center}{bold}Tick Status{/bold}{/center}',
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
      border: {
        fg: '#f0f0f0',
      },
    },
  });

  const scanBox = blessed.box({
    top: '20%',
    left: '50%',
    height: '25%',
    align: 'center',
    width: '50%',
    tags: true,
    content: '{center}{bold}Scan Status{/bold}{/center}',
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
      border: {
        fg: '#f0f0f0',
      },
    },
  });

  const errorBox = blessed.box({
    top: 'center',
    left: 'center',
    height: '50%',
    align: 'center',
    width: '50%',
    tags: true,
    hidden: true,
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
      bg: 'red',
      border: {
        fg: '#f0f0f0',
      },
    },
  });

  const configBox = blessed.box({
    top: '45%',
    left: '0',
    height: '55%',
    align: 'center',
    width: '30%',
    tags: true,
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
      border: {
        fg: '#f0f0f0',
      },
    },
  });

  const deviceList = blessed.list({
    top: '45%',
    left: '30%',
    height: '55%',
    align: 'center',
    width: '40%',
    keyable: true,
    keys: true,
    shrink: true,
    tags: true,
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
      border: {
        fg: '#f0f0f0',
      },
    },
  });

  const exampleBox = blessed.box({
    top: '45%',
    left: '70%',
    height: '55%',
    align: 'center',
    width: '30%',
    keyable: true,
    keys: true,
    shrink: true,
    tags: true,
    border: {
      type: 'line',
    },
    style: {
      fg: 'white',
      border: {
        fg: '#f0f0f0',
      },
    },
  });

  screen.append(titleBar);
  screen.append(tickBox);
  screen.append(scanBox);
  screen.append(configBox);
  screen.append(deviceList);
  screen.append(exampleBox);
  screen.append(errorBox);

  const devices = parser.generateDevices();
  const deviceManager = new DeviceManager(
    devices,
    parser.config.mqtt.options,
    parser.config.mqtt.options.url,
    parser.config.mqtt.rootTopic,
    parser.config.globalTick,
    parser.config.scanRate,
    parser.config.managementTopic,
  );

  devices.forEach((device) =>
    deviceList.addItem(`${device.mqttSerial}: ${device.type}`),
  );

  let selectedDevice = devices.find((dev) => dev.type === 'TIBBO');

  deviceList.on('select', (_, index) => {
    selectedDevice = devices[index];
    updateExample(selectedDevice);
  });

  const updateExample = (device: Device | undefined) => {
    if (!!device) {
      let mockDevice: { [key: string]: any } = {
        type: device.type,
        ipAddress: device.ipAddress,
      };

      if (device instanceof Tibbo) {
        mockDevice = {
          ...mockDevice,
          firmwareVersion: device.firmwareVersion,
          firmwareName: device.firmwareName,
        };

        device.sensors.forEach((sensor) => {
          mockDevice[sensor.name] = sensor.getValue();
        });

        device.inputs.forEach((input) => {
          mockDevice[input.name] = input.getValue();
        });
      }

      const object: { [key: string]: any } = {};
      object[device.serialNumber] = mockDevice;

      const stringContent = JSON.stringify(object, null, 2).replace(
        /^{/,
        `${parser.config.mqtt.rootTopic}/${device.topic}/${device.locationID}/${device.serialNumber}`,
      );

      exampleBox.setContent(stringContent);
    }
  };

  screen.key(['escape', 'q', 'C-c'], () => {
    return process.exit(0);
  });

  scanBox.on('click', () => {
    deviceManager.emitScan();
  });

  updateExample(selectedDevice);

  deviceManager.onTick = () => {
    tickBox.setLine(1, `{center}Last tick: ${Date.now()} {/center}`);
    updateExample(selectedDevice);
    screen.render();
  };

  deviceManager.onScan = () => {
    scanBox.setLine(1, `{center}Last scan: ${Date.now()} {/center}`);
    screen.render();
  };

  deviceManager.onError = (err) => {
    errorBox.hidden = false;
    errorBox.setContent(`{center}{red-fg}Error: ${err}{/red-fg}{/center}`);
    screen.render();
  };

  deviceManager.onConnect = (host: string) => {
    titleBar.setContent(
      `{center}Tibulator: {green-fg}[connected:${
        host.split('//')[1]
      }]{/green-fg}{/center}`,
    );
    screen.render();
  };

  errorBox.on('click', () => {
    errorBox.hidden = true;
    screen.render();
  });

  tickBox.setLine(1, 'Waiting...');
  scanBox.setLine(1, 'Waiting...');

  configBox.setLine(0, `tibboCount: ${parser.config.tibboCount}`);
  configBox.setLine(1, `cameraCount: ${parser.config.cameraCount || 0}`);
  configBox.setLine(2, `globalTick: ${parser.config.globalTick || 1000}`);
  configBox.setLine(3, `scanRate: ${parser.config.scanRate || 5000}`);
  configBox.setLine(4, `firmwareVersion: ${parser.config.firmwareVersion}`);
  configBox.setLine(5, `firmwareName: ${parser.config.firmwareName}`);

  deviceList.focus();
  screen.render();

  deviceManager.start();
};
