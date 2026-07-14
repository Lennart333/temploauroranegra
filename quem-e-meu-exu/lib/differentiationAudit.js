import { exus } from "../data/exuArchetypes.js";
import { pombagiras } from "../data/pombagiraArchetypes.js";

function cosine(a, b) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    let dot = 0;
    let magA = 0;
    let magB = 0;
    keys.forEach(key => {
        const av = a[key] || 0;
        const bv = b[key] || 0;
        dot += av * bv;
        magA += av * av;
        magB += bv * bv;
    });
    return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

function pairs(items, kind) {
    const result = [];
    for (let i = 0; i < items.length; i += 1) {
        for (let j = i + 1; j < items.length; j += 1) {
            const similarity = Number(cosine(items[i].weights, items[j].weights).toFixed(3));
            if (similarity >= 0.72) result.push({ kind, a: items[i].name, b: items[j].name, similarity });
        }
    }
    return result.sort((a, b) => b.similarity - a.similarity || a.a.localeCompare(b.a));
}

export function calculateDifferentiationAudit() {
    return [...pairs(exus, "Exu"), ...pairs(pombagiras, "Pombagira")];
}
