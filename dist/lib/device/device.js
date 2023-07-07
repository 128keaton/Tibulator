"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
class Device {
    serialNumber;
    ipAddress;
    firmwareVersion;
    firmwareName;
    inputs = [];
    sensors = [];
    constructor(serialNumber, ipAddress, firmwareVersion, firmwareName) {
        this.serialNumber = serialNumber;
        this.ipAddress = ipAddress;
        this.firmwareVersion = firmwareVersion;
        this.firmwareName = firmwareName;
    }
    get mqttSerial() {
        return this.serialNumber.replaceAll('.', '-');
    }
}
exports.Device = Device;
