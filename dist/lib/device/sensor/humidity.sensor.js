"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HumiditySensor = void 0;
class HumiditySensor {
    name;
    rangeLow;
    rangeHigh;
    emissionRate;
    type = 'HUMIDITY';
    constructor(name = 'humidity', rangeLow = 15, rangeHigh = 82, emissionRate = 5000) {
        this.name = name;
        this.rangeLow = rangeLow;
        this.rangeHigh = rangeHigh;
        this.emissionRate = emissionRate;
    }
    getValue() {
        return `${(Math.random() * (this.rangeHigh - this.rangeLow + 1) +
            this.rangeLow).toFixed(1)}`;
    }
}
exports.HumiditySensor = HumiditySensor;
