import { dimensions } from "../data/dimensions.js";
import { questions } from "../data/questions.js";
import { situationalQuestions } from "../data/situationalQuestions.js";
import { forcedChoices } from "../data/forcedChoices.js";
import { priorityQuestions } from "../data/priorityQuestions.js";
import { repeatedPatterns } from "../data/repeatedPatterns.js";
import { exus } from "../data/exuArchetypes.js";
import { pombagiras } from "../data/pombagiraArchetypes.js";

function optionQuestionContributions(question, selectedIndexOrValue) {
    if (selectedIndexOrValue === undefined || selectedIndexOrValue === null) return null;
    const selected = question.options.find(option => String(option.value ?? question.options.indexOf(option)) === String(selectedIndexOrValue)) || question.options[Number(selectedIndexOrValue)];
    if (!selected) return null;
    const items = Object.entries(selected.weights).map(([dimension, value]) => ({
        dimension,
        weight: 1,
        reverse: false,
        normalized: Number(value.toFixed(4)),
        contribution: Number(value.toFixed(4)),
        max: 1
    }));
    return { id: question.id, type: question.type, text: question.text, answer: selectedIndexOrValue, selected: selected.text, items };
}

export function getQuestionContributions(answers) {
    const contributions = [];
    questions.forEach(question => {
        const raw = answers[question.id];
        if (raw === undefined || raw === null) return;
        const value = Number(raw);
        const items = question.weights.map(({ dimension, weight, reverse }) => {
            const normalized = ((reverse ? 6 - value : value) - 1) / 4;
            return { dimension, weight, reverse, normalized: Number(normalized.toFixed(4)), contribution: Number((normalized * weight).toFixed(4)), max: weight };
        });
        contributions.push({ id: question.id, type: question.type, text: question.text, answer: value, items });
    });
    [...situationalQuestions, ...forcedChoices, ...priorityQuestions, ...repeatedPatterns].forEach(question => {
        const contribution = optionQuestionContributions(question, answers[question.id]);
        if (contribution) contributions.push(contribution);
    });
    return contributions;
}

export function calculateDimensions(answers) {
    const scores = Object.fromEntries(dimensions.map(dimension => [dimension, { value: 0, max: 0 }]));
    getQuestionContributions(answers).forEach(question => {
        question.items.forEach(({ dimension, contribution, max }) => {
            if (!scores[dimension]) scores[dimension] = { value: 0, max: 0 };
            scores[dimension].value += contribution;
            scores[dimension].max += max;
        });
    });
    return Object.fromEntries(dimensions.map(dimension => {
        const item = scores[dimension];
        const normalized = item.max ? Math.round((item.value / item.max) * 100) : 50;
        return [dimension, Math.max(0, Math.min(100, normalized))];
    }));
}

export function scoreArchetypes(archetypes, calculatedDimensions) {
    return archetypes.map((archetype, index) => {
        const totalWeight = Object.values(archetype.weights).reduce((sum, weight) => sum + weight, 0);
        const weightedScore = Object.entries(archetype.weights).reduce((sum, [dimension, weight]) => sum + ((calculatedDimensions[dimension] || 0) / 100) * weight, 0);
        const score = totalWeight ? (weightedScore / totalWeight) * 100 : 0;
        return { ...archetype, score: Number(score.toFixed(2)), totalWeight: Number(totalWeight.toFixed(4)), order: index };
    }).sort((a, b) => b.score - a.score || a.order - b.order);
}

export function calculateExuScores(calculatedDimensions) {
    return scoreArchetypes(exus, calculatedDimensions);
}

export function calculatePombagiraScores(calculatedDimensions) {
    return scoreArchetypes(pombagiras, calculatedDimensions);
}
