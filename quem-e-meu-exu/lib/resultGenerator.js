import { requiredAssessmentQuestions } from "../data/assessmentItems.js";
import { calculateCrossroadsCycle } from "./crossroadsCycle.js";
import { calculateDimensions, calculateExuScores, calculatePombagiraScores, getQuestionContributions } from "./scoring.js";
import { detectActiveShadows, getShadowDiagnostics } from "../data/shadowRules.js";
import { determineNeededFunction } from "../data/developmentPlans.js";
import { generateCombination } from "./combinationGenerator.js";
import { selectDimensionInsights } from "./insightGenerator.js";
import { buildAdvancedReading } from "./advancedReading.js";

export function generateResult(profile, answers) {
    if (!profile || !profile.firstName || !profile.birthDate || !profile.area || !profile.accepted) {
        throw new Error("Dados iniciais incompletos.");
    }
    const missing = requiredAssessmentQuestions.map(question => question.id).filter(id => answers[id] === undefined || answers[id] === null);
    if (missing.length) {
        throw new Error("Dados incompletos não permitem finalizar.");
    }

    const calculatedDimensions = calculateDimensions(answers);
    const exuScores = calculateExuScores(calculatedDimensions);
    const pombagiraScores = calculatePombagiraScores(calculatedDimensions);
    const exu = exuScores[0];
    const pombagira = pombagiraScores[0];
    const complementaryPool = [...exuScores.slice(1, 4), ...pombagiraScores.slice(1, 4)]
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    const activeShadow = detectActiveShadows(calculatedDimensions);
    const result = {
        firstName: profile.firstName,
        area: profile.area,
        cycle: calculateCrossroadsCycle(profile.birthDate),
        dimensions: calculatedDimensions,
        exu,
        pombagira,
        complementary: complementaryPool[0],
        activeShadow,
        neededFunction: determineNeededFunction(calculatedDimensions),
        exuScores,
        pombagiraScores,
        questionContributions: getQuestionContributions(answers),
        shadowDiagnostics: getShadowDiagnostics(calculatedDimensions),
        selectionReason: {
            exu: `${exu.name} foi selecionado por ter a maior média ponderada normalizada entre os Exus (${exu.score}/100).`,
            pombagira: `${pombagira.name} foi selecionada por ter a maior média ponderada normalizada entre as Pombagiras (${pombagira.score}/100).`,
            complementary: `${complementaryPool[0].name} foi escolhido como complementar por ser o maior resultado restante entre os candidatos secundários.`
        },
        methodologicalNotice: "Esta experiência oferece uma interpretação simbólica e psicológica inspirada em arquétipos de Exu e Pombagira. Ela não confirma entidades espirituais, mediunidade ou filiação religiosa."
    };
    result.combination = generateCombination(result);
    result.dimensionInsights = selectDimensionInsights(calculatedDimensions);
    result.advanced = buildAdvancedReading(result);
    result.plan14 = result.advanced.plan14;
    result.plan = result.plan14.map(item => `Dia ${item.day}: ${item.action}`);
    return result;
}
