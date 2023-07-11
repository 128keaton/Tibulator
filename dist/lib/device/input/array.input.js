"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayInput = void 0;
class ArrayInput {
    name;
    values;
    lastValue;
    initialValue;
    type = 'ARRAY';
    constructor(name, values, initialValue) {
        this.name = name;
        this.values = values;
        this.initialValue = initialValue;
        this.lastValue = this.initialValue;
    }
    getValue(override) {
        if (override) {
            this.lastValue = override;
        }
        else {
            this.lastValue =
                this.values[Math.floor(Math.random() * this.values.length)];
        }
        return `${this.lastValue}`;
    }
}
exports.ArrayInput = ArrayInput;
