export class Input {
    constructor(readonly name: string, private readonly probability: number | 'never' = 0.5) {
    }

    getValue() {
        if (this.probability === 'never') return false;

        return  (Math.random() < this.probability) as boolean;
    }
}

