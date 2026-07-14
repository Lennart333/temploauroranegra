import { exus } from "./exuArchetypes.js";
import { pombagiras } from "./pombagiraArchetypes.js";

const toExuText = item => ({
    reading: item.openingReading,
    potency: item.strengths,
    shadow: item.shadowExpression,
    relationships: item.relationshipPattern,
    work: item.workPattern,
    practicalAdvice: item.practicalAdvice,
    symbolicPhrase: item.symbolicPhrase
});

const toPombagiraText = item => ({
    reading: item.openingReading,
    potency: item.strengths,
    shadow: item.shadowExpression,
    relationships: item.relationshipPattern,
    work: item.imagePattern,
    practicalAdvice: item.practicalAdvice,
    symbolicPhrase: item.symbolicPhrase
});

export const resultTexts = {
    exu: Object.fromEntries(exus.map(item => [item.id, toExuText(item)])),
    pombagira: Object.fromEntries(pombagiras.map(item => [item.id, toPombagiraText(item)]))
};
