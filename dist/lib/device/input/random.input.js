"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomInput = void 0;
class RandomInput {
    name;
    probability;
    trueValue;
    falseValue;
    type = 'RANDOM';
    constructor(name, probability = 0.5, trueValue = true, falseValue = false) {
        this.name = name;
        this.probability = probability;
        this.trueValue = trueValue;
        this.falseValue = falseValue;
    }
    getValue() {
        if (this.probability === 'never')
            return this.falseValue;
        const value = (Math.random() < this.probability);
        return value ? this.trueValue : this.falseValue;
    }
}
exports.RandomInput = RandomInput;
