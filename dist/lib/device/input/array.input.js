"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayInput = void 0;
class ArrayInput {
    name;
    values;
    type = 'ARRAY';
    constructor(name, values) {
        this.name = name;
        this.values = values;
    }
    getValue() {
        return this.values[Math.floor(Math.random() * this.values.length)];
    }
}
exports.ArrayInput = ArrayInput;
