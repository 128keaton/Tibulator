"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HumiditySensor = void 0;
class HumiditySensor {
    name;
    rangeLow;
    rangeHigh;
    emissionRate;
    type = 'HUMIDITY';
    lastValue;
    constructor(name = 'humidity', rangeLow = 15, rangeHigh = 82, emissionRate = 5000) {
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
exports.HumiditySensor = HumiditySensor;
