"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomInput = void 0;
class RandomInput {
    name;
    probability;
    trueValue;
    falseValue;
    lastValue;
    type = 'RANDOM';
    initialValue;
    constructor(name, probability = 0.5, trueValue = 'true', falseValue = 'false', initialValue) {
        this.name = name;
        this.probability = probability;
        this.trueValue = trueValue;
        this.falseValue = falseValue;
        this.initialValue = initialValue || 'false';
        this.lastValue = this.initialValue;
    }
    getValue(override) {
        if (override) {
            this.lastValue = override;
        }
        else {
            if (this.probability === 'never') {
                this.lastValue = this.getMappedValue(false);
                return this.lastValue;
            }
            const value = (Math.random() < this.probability);
            this.lastValue = this.getMappedValue(value);
        }
        return this.lastValue;
    }
    getMappedValue(value) {
        if (value === undefined)
            return this.falseValue;
        return value ? `${this.trueValue}` : `${this.falseValue}`;
    }
}
exports.RandomInput = RandomInput;
