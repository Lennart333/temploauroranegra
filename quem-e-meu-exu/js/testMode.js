import { questions } from "../data/questions.js";
import { situationalQuestions } from "../data/situationalQuestions.js";
import { forcedChoices } from "../data/forcedChoices.js";
import { priorityQuestions } from "../data/priorityQuestions.js";
import { repeatedPatterns } from "../data/repeatedPatterns.js";
import { openQuestion } from "../data/openQuestion.js";

export const presetNames = [
    "random",
    "exu-lucifer",
    "tranca-ruas",
    "exu-do-lodo",
    "exu-caveira",
    "exu-marabo",
    "maria-padilha",
    "maria-mulambo",
    "rosa-caveira",
    "balanced",
    "tiriri",
    "exu-das-almas",
    "sete-porteiras",
    "capa-preta",
    "maria-navalha",
    "sete-saias",
    "rosa-vermelha",
    "pombagira-menina"
];

export function isTestMode() {
    return new URLSearchParams(window.location.search).get("testMode") === "true";
}

const oldDimensions = new Set(["movement", "boundaries", "communication", "shadow", "transformation", "autonomy", "adaptability", "consistency", "selfWorth", "desire", "magnetism", "attachment", "emotionalIndependence", "imageConsciousness"]);
const optionGroups = [situationalQuestions, forcedChoices, priorityQuestions, repeatedPatterns];
const advancedOptionGroups = [forcedChoices, priorityQuestions, repeatedPatterns];

export function buildProfileAnswers(profileName) {
    const answers = {};
    neutral(answers);
    const profiles = {
        random: () => randomize(answers),
        "exu-lucifer": () => high(answers, ["autonomy", "selfWorth", "communication", "imageConsciousness"]),
        "tranca-ruas": () => high(answers, ["boundaries", "consistency", "autonomy"]),
        "exu-do-lodo": () => high(answers, ["shadow", "transformation", "adaptability"]),
        "exu-caveira": () => high(answers, ["transformation", "shadow", "emotionalIndependence", "boundaries"]),
        "exu-marabo": () => high(answers, ["communication", "magnetism", "selfWorth", "consistency"]),
        "maria-padilha": () => high(answers, ["magnetism", "desire", "selfWorth", "imageConsciousness"]),
        "maria-mulambo": () => high(answers, ["transformation", "shadow", "selfWorth"]),
        "rosa-caveira": () => high(answers, ["transformation", "shadow", "boundaries", "magnetism"]),
        balanced: () => neutral(answers),
        tiriri: () => high(answers, ["agency", "socialDominance", "communication"]),
        "exu-das-almas": () => high(answers, ["meaningSeeking", "closure", "rumination"]),
        "sete-porteiras": () => high(answers, ["vigilance", "controlNeed", "strategicPatience"]),
        "capa-preta": () => high(answers, ["strategicPatience", "statusDrive", "controlNeed", "socialDominance"]),
        "maria-navalha": () => high(answers, ["socialDominance", "communication", "relationalReciprocity"]),
        "sete-saias": () => high(answers, ["aestheticIdentity", "adaptability", "imageConsciousness"]),
        "rosa-vermelha": () => high(answers, ["relationalReciprocity", "desire", "rejectionSensitivity"]),
        "pombagira-menina": () => high(answers, ["noveltySeeking", "rejectionSensitivity", "agency"])
    };
    (profiles[profileName] || profiles.random)();
    answers[openQuestion.id] = "";
    return answers;
}

function neutral(answers) {
    questions.forEach(question => { answers[question.id] = 3; });
    situationalQuestions.forEach((question, index) => { answers[question.id] = index < 8 ? index % question.options.length : "__neutral"; });
    advancedOptionGroups.forEach(group => group.forEach(question => { answers[question.id] = "__neutral"; }));
}

function randomize(answers) {
    questions.forEach((question, index) => { answers[question.id] = index < 32 ? ((index * 7) % 5) + 1 : 3; });
    situationalQuestions.forEach((question, index) => { answers[question.id] = index < 8 ? (index * 3) % 4 : "__neutral"; });
    advancedOptionGroups.forEach(group => group.forEach(question => { answers[question.id] = "__neutral"; }));
}

function high(answers, targets) {
    const usesAdvancedTargets = targets.some(target => !oldDimensions.has(target));
    questions.forEach(question => {
        const hasTarget = question.weights.some(weight => targets.includes(weight.dimension) && !weight.reverse);
        answers[question.id] = hasTarget ? 5 : 3;
    });
    optionGroups.forEach(group => group.forEach(question => {
        if (!usesAdvancedTargets && (question.type !== "situational" || Number(question.id.slice(1)) > 8)) { answers[question.id] = "__neutral"; return; }
        let best = question.options[0];
        let bestIndex = 0;
        let bestScore = -1;
        question.options.forEach((option, index) => {
            const score = targets.reduce((sum, dimension) => sum + (option.weights[dimension] || 0), 0);
            if (score > bestScore) {
                best = option;
                bestIndex = index;
                bestScore = score;
            }
        });
        answers[question.id] = question.type === "forced" ? best.value : bestIndex;
    }));
}
