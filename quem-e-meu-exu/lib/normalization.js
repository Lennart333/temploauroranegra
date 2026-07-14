export function reduceToOneNine(value) {
        let total = Math.abs(Number(value) || 0);
        while (total > 9) {
            total = String(total).split("").reduce((sum, digit) => sum + Number(digit), 0);
        }
        return total || 1;
    }
