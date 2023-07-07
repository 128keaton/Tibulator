"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
class Input {
    name;
    probability;
    constructor(name, probability = 0.5) {
        this.name = name;
        this.probability = probability;
    }
    getValue() {
        if (this.probability === 'never')
            return false;
        return (Math.random() < this.probability);
    }
}
exports.Input = Input;
