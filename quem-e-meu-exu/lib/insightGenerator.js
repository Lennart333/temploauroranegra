import { dimensionInsights, maxDimensionInsights } from "../data/dimensionInsights.js";

export function selectDimensionInsights(dimensions, limit = maxDimensionInsights) {
    return dimensionInsights
        .filter(insight => insight.condition(dimensions))
        .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))
        .slice(0, limit)
        .map(({ condition, ...insight }) => insight);
}
