import { reduceToOneNine } from "./normalization.js";

export function calculateCrossroadsCycle(birthDate) {
        if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return null;
        return reduceToOneNine(birthDate.replace(/\D/g, "").split("").reduce((sum, digit) => sum + Number(digit), 0));
    }
