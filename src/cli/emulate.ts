import * as blessed from 'neo-blessed';
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from '../lib/parse/parser';
import { Tibbo } from '../lib/device/tibbo';
import { ArrayInput, Device, RandomInput } from '../lib/device';
import { DeviceManager } from '../lib/device-manager';
import { getBaseUI, updateConfigList } from './tui';

export const runEmulation = (configPath: string) => {
  const screen = blessed.screen({
    smartCSR: true,
  });

  screen.title = 'Tibulator';

  let formItems: Array<
    blessed.Widgets.InputElement | blessed.Widgets.TextElement
  > = [];

  const {
    titleBar,
    errorBox,
    configList,
    deviceList,
    previewBox,
    actionForm,
    scanButton,
  } = getBaseUI(screen);

  const rawConfig = fs.readFileSync(path.resolve(configPath)).toString();

  if (!rawConfig || !rawConfig.length) return;

  const parser = new Parser(rawConfig);

  screen.append(titleBar);
  screen.append(configList);
  screen.append(deviceList);
  screen.append(actionForm);
  screen.append(errorBox);

  const devices = parser.generateDevices();

  let selectedDevice = devices.find((dev) => dev.type === 'TIBBO');

  const selectedDeviceTitle = blessed.text({
    tags: true,
    top: -2,
    width: '35%',
    align: 'center',
    left: 'center',
    right: 'center',
  });

  const deviceManager = new DeviceManager(
    devices,
    parser.config.mqtt.options,
    parser.config.mqtt.options.url,
    parser.config.mqtt.rootTopic,
    parser.config.globalTick,
    parser.config.scanRate,
    parser.config.managementTopic,
  );

  scanButton.on('press', () => {
    scanButton.setContent(`Last scan: ${Date.now()}`);
    deviceManager.emitScan();
  });

  devices.forEach((device) =>
    deviceList.addItem(`${device.mqttSerial}: ${device.type}`),
  );

  deviceList.on('select', (_, index) => {
    selectedDevice = devices[index];
    updateForm(selectedDevice);
    updatePreview(selectedDevice);
    screen.render();
  });

  screen.key(['escape', 'q', 'C-c'], () => {
    return process.exit(0);
  });

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

  deviceManager.onTick = () => {
    devices
      .filter((device) => device !== selectedDevice && device.type === 'TIBBO')
      .forEach((device) => {
        const tibbo: Tibbo = device as Tibbo;

        tibbo.inputs.forEach((input) =>
          tibbo.emitInput(parser.config.mqtt.rootTopic, input, input.lastValue),
        );
      });
    if (!!selectedDevice) {
      actionForm.submit();
    }
  };

  actionForm.on('submit', (data: { [key: string]: boolean }) => {
    if (!!selectedDevice && selectedDevice.type === 'TIBBO') {
      const tibbo = selectedDevice as Tibbo;

      Object.keys(data).forEach((key) => {
        const [inputName, currentValue] = key.split('_');
        const selected = data[key];

        if (selected) {
          const input = tibbo.inputs.find((input) => input.name === inputName);

          if (!!input)
            tibbo.emitInput(parser.config.mqtt.rootTopic, input, currentValue);
        }
      });

      updatePreview(selectedDevice);
      screen.render();
    }
  });

  const initialEmit = (selectedDevice: Device) => {
    if (selectedDevice.type === 'TIBBO') {
      const tibbo: Tibbo = selectedDevice as Tibbo;
      tibbo.inputs
        .filter((input) => !!input.initialValue)
        .forEach((input) => {
          tibbo.emitInput(
            parser.config.mqtt.rootTopic,
            input,
            input.initialValue,
          );
        });
    }
  };

  const updatePreview = (device: Device) => {
    let mockDevice: { [key: string]: any } = {
      type: device.type,
      ipAddress: device.ipAddress,
    };

    if (device.type === 'TIBBO') {
      const tibbo: Tibbo = device as Tibbo;

      mockDevice = {
        _info: device.deviceProperties,
      };

      tibbo.sensors.forEach((sensor) => {
        mockDevice[sensor.name] = sensor.lastValue;
      });

      tibbo.inputs.forEach((input) => {
        mockDevice[input.name] = input.lastValue || input.initialValue;
      });
    }

    const object: { [key: string]: any } = {};
    object[device.serialNumber] = mockDevice;

    const stringContent = JSON.stringify(object, null, 2).replace(
      /^{/,
      `${parser.config.mqtt.rootTopic}/${device.topic}/${device.locationID}/${device.serialNumber}`,
    );

    previewBox.setContent(stringContent);
  };

  const updateForm = (selectedDevice: Device) => {
    actionForm.children.forEach((child) => actionForm.remove(child));
    selectedDeviceTitle.setContent(
      `{center}{bold}${selectedDevice.serialNumber}:{/bold}{/center}`,
    );

    const getInputName = (inputName: string, inputValueName: string) => {
      return `${inputName}_${inputValueName}`;
    };

    actionForm.append(selectedDeviceTitle);

    if (selectedDevice.type === 'TIBBO') {
      const tibbo: Tibbo = selectedDevice as Tibbo;

      let totalIndex = 0;

      tibbo.inputs.forEach((input) => {
        const title = blessed.text({
          content: input.name,
          shrink: true,
          top: totalIndex,
          left: 2,
        });

        totalIndex++;
        formItems.push(title);
        actionForm.append(title);

        const radioGroup = blessed.radioset({
          top: totalIndex,
          left: 2,
        });

        formItems.push(radioGroup);
        actionForm.append(radioGroup);

        if (input.type === 'ARRAY') {
          const arrayInput: ArrayInput = input as ArrayInput;
          arrayInput.values.forEach((value, valueIndex) => {
            const checkbox = blessed.radiobutton({
              text: value,
              name: getInputName(arrayInput.name, value),
              checked: input.lastValue === value,
              clickable: true,
              mouse: true,
              top: valueIndex,
              shrink: true,
              style: {
                fg: 'blue',
              },
            });

            radioGroup.append(checkbox);
            totalIndex++;
          });
        } else if (input.type === 'RANDOM') {
          const randomInput: RandomInput = input as RandomInput;

          [true, false].forEach((value, valueIndex) => {
            const mappedValue = randomInput.getMappedValue(value);

            const checkbox = blessed.radiobutton({
              text: `${mappedValue}`,
              name: getInputName(randomInput.name, mappedValue),
              checked: `${randomInput.lastValue}` === `${mappedValue}`,
              clickable: true,
              mouse: true,
              top: valueIndex,
              shrink: true,
              style: {
                fg: 'blue',
              },
            });

            radioGroup.append(checkbox);
            totalIndex++;
          });
        }

        totalIndex++;
      });
    } else {
      formItems.forEach((formItem) => {
        actionForm.remove(formItem);
      });

      formItems = [];
    }
  };

  if (!!selectedDevice) {
    updateForm(selectedDevice);
    updatePreview(selectedDevice);
    initialEmit(selectedDevice);
  }

  updateConfigList(configList, parser.config);
  deviceList.focus();

  screen.render();

  deviceManager.start();
};
