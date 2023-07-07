"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemperatureSensor = void 0;
class TemperatureSensor {
    name;
    rangeLow;
    rangeHigh;
    emissionRate;
    type = 'TEMPERATURE';
    constructor(name = 'temperature', rangeLow = 23, rangeHigh = 36, emissionRate = 5000) {
        this.name = name;
        this.rangeLow = rangeLow;
        this.rangeHigh = rangeHigh;
        this.emissionRate = emissionRate;
    }
    getValue() {
        return `${Math.random() * (this.rangeHigh - this.rangeLow + 1) + this.rangeLow}`;
    }
}
exports.TemperatureSensor = TemperatureSensor;
