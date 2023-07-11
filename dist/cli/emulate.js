"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEmulation = void 0;
const blessed = __importStar(require("neo-blessed"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const parser_1 = require("../lib/parse/parser");
const device_manager_1 = require("../lib/device-manager");
const tui_1 = require("./tui");
const runEmulation = (configPath) => {
    const screen = blessed.screen({
        smartCSR: true,
    });
    screen.title = 'Tibulator';
    let formItems = [];
    const { titleBar, errorBox, configList, deviceList, previewBox, actionForm, submitButton, scanButton, } = (0, tui_1.getBaseUI)(screen);
    const rawConfig = fs.readFileSync(path.resolve(configPath)).toString();
    if (!rawConfig || !rawConfig.length)
        return;
    const parser = new parser_1.Parser(rawConfig);
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
    const deviceManager = new device_manager_1.DeviceManager(devices, parser.config.mqtt.options, parser.config.mqtt.options.url, parser.config.mqtt.rootTopic, parser.config.globalTick, parser.config.scanRate, parser.config.managementTopic);
    scanButton.on('press', () => deviceManager.emitScan());
    devices.forEach((device) => deviceList.addItem(`${device.mqttSerial}: ${device.type}`));
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
    deviceManager.onConnect = (host) => {
        titleBar.setContent(`{center}Tibulator: {green-fg}[connected:${host.split('//')[1]}]{/green-fg}{/center}`);
        screen.render();
    };
    errorBox.on('click', () => {
        errorBox.hidden = true;
        screen.render();
    });
    submitButton.on('press', () => {
        actionForm.submit();
    });
    deviceManager.onTick = () => {
        if (!!selectedDevice) {
            updatePreview(selectedDevice);
            screen.render();
        }
    };
    actionForm.on('submit', (data) => {
        if (!!selectedDevice && selectedDevice.type === 'TIBBO') {
            const tibbo = selectedDevice;
            Object.keys(data).forEach((key) => {
                const [inputName, currentValue] = key.split('_');
                const selected = data[key];
                if (selected) {
                    const input = tibbo.inputs.find((input) => input.name === inputName);
                    if (!!input)
                        tibbo.emitInput(parser.config.mqtt.rootTopic, input, currentValue);
                }
            });
        }
    });
    const initialEmit = (selectedDevice) => {
        if (selectedDevice.type === 'TIBBO') {
            const tibbo = selectedDevice;
            tibbo.inputs
                .filter((input) => !!input.initialValue)
                .forEach((input) => {
                tibbo.emitInput(parser.config.mqtt.rootTopic, input, input.initialValue);
            });
        }
    };
    const updatePreview = (device) => {
        let mockDevice = {
            type: device.type,
            ipAddress: device.ipAddress,
        };
        if (device.type === 'TIBBO') {
            const tibbo = device;
            mockDevice = {
                ...mockDevice,
                firmwareVersion: tibbo.firmwareVersion,
                firmwareName: tibbo.firmwareName,
            };
            tibbo.sensors.forEach((sensor) => {
                mockDevice[sensor.name] = sensor.lastValue;
            });
            tibbo.inputs.forEach((input) => {
                mockDevice[input.name] = input.lastValue || input.initialValue;
            });
        }
        const object = {};
        object[device.serialNumber] = mockDevice;
        const stringContent = JSON.stringify(object, null, 2).replace(/^{/, `${parser.config.mqtt.rootTopic}/${device.topic}/${device.locationID}/${device.serialNumber}`);
        previewBox.setContent(stringContent);
    };
    const updateForm = (selectedDevice) => {
        actionForm.children.forEach((child) => actionForm.remove(child));
        selectedDeviceTitle.setContent(`{center}{bold}${selectedDevice.serialNumber}:{/bold}{/center}`);
        const getInputName = (inputName, inputValueName) => {
            return `${inputName}_${inputValueName}`;
        };
        actionForm.append(selectedDeviceTitle);
        if (selectedDevice.type === 'TIBBO') {
            const tibbo = selectedDevice;
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
                    const arrayInput = input;
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
                }
                else if (input.type === 'RANDOM') {
                    const randomInput = input;
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
        }
        else {
            formItems.forEach((formItem) => {
                actionForm.remove(formItem);
            });
            formItems = [];
        }
        actionForm.append(submitButton);
    };
    if (!!selectedDevice) {
        updateForm(selectedDevice);
        updatePreview(selectedDevice);
        initialEmit(selectedDevice);
    }
    (0, tui_1.updateConfigList)(configList, parser.config);
    deviceList.focus();
    screen.render();
    deviceManager.start();
};
exports.runEmulation = runEmulation;
