"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemperatureSensor = void 0;
class TemperatureSensor {
    name;
    rangeLow;
    rangeHigh;
    emissionRate;
    type = 'TEMPERATURE';
    lastValue;
    constructor(name = 'temperature', rangeLow = 23, rangeHigh = 36, emissionRate = 5000) {
        this.name = name;
        this.rangeLow = rangeLow;
        this.rangeHigh = rangeHigh;
        this.emissionRate = emissionRate;
    }
    getValue() {
        this.lastValue = `${(Math.random() * (this.rangeHigh - this.rangeLow + 1) +
            this.rangeLow).toFixed(1)}`;
        return this.lastValue;
    }
}
exports.TemperatureSensor = TemperatureSensor;
