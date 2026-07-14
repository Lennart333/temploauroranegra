import { selectContradictions } from "../data/contradictionInsights.js";

const areaGuidance = {
    "execução e disciplina": "reduzir frentes abertas, escolher uma entrega visível e transformar visão em rotina curta",
    "disciplina e execução": "reduzir frentes abertas, escolher uma entrega visível e transformar visão em rotina curta",
    "dinheiro e carreira": "converter presença em valor concreto, com preço, prazo e evidência de entrega",
    "relacionamentos": "trocar teste silencioso por pedido claro e observar reciprocidade em comportamento",
    "autoestima e imagem": "usar estética como linguagem, sem medir valor apenas por validação",
    "espiritualidade": "tratar símbolo como espelho de prática, com menos certeza absoluta e mais responsabilidade",
    "encerramento de ciclos": "nomear o que acabou, preservar aprendizado e fazer um gesto prático de liberação"
};

function lowDimensions(dimensions) {
    return Object.entries(dimensions).sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0])).slice(0, 3);
}

function highDimensions(dimensions) {
    return Object.entries(dimensions).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 3);
}

export function determineExpressionMode(dimensions) {
    if (dimensions.emotionalRegulation < 42 || dimensions.rumination > 76 || dimensions.controlNeed > 82) return { mode: "estagnada", explanation: "A força do arquétipo parece presa em defesa, repetição mental ou necessidade de controle. Não é condenação; é um sinal de onde a energia parou de circular." };
    if (dimensions.shadow > 70 || dimensions.rejectionSensitivity > 68 || dimensions.vulnerabilityTolerance < 45) return { mode: "defensiva", explanation: "A força aparece, mas tende a se proteger antes de se revelar por inteiro. Em tensão, a defesa pode falar mais alto que a escolha." };
    return { mode: "integrada", explanation: "A força aparece com mais direção e menor necessidade de provar, controlar ou se esconder." };
}

export function determineFunctioningProfile(dimensions) {
    const rules = [
        ["Visionário disperso", dimensions.meaningSeeking > 70 && dimensions.consistency < 50],
        ["Guardião defensivo", dimensions.boundaries > 75 && dimensions.vigilance > 70],
        ["Estrategista magnético", dimensions.communication > 70 && dimensions.magnetism > 70],
        ["Reconstrutor ferido", dimensions.transformation > 70 && dimensions.rejectionSensitivity > 60],
        ["Observador hipervigilante", dimensions.vigilance > 78 && dimensions.rumination > 65],
        ["Transformador radical", dimensions.transformation > 78 && dimensions.closure > 65],
        ["Diplomata indireto", dimensions.magnetism > 65 && dimensions.vulnerabilityTolerance < 50],
        ["Explorador inquieto", dimensions.noveltySeeking > 75 && dimensions.closure < 50],
        ["Executor contido", dimensions.consistency > 70 && dimensions.vulnerabilityTolerance < 50],
        ["Mediador dependente", dimensions.relationalReciprocity > 70 && dimensions.boundaries < 50],
        ["Autônomo inflacionado", dimensions.autonomy > 80 && dimensions.vulnerabilityTolerance < 45],
        ["Sedutor inseguro", dimensions.magnetism > 75 && dimensions.selfWorth < 50]
    ];
    const found = rules.find(([, condition]) => condition);
    return found ? found[0] : "Perfil em integração gradual";
}

export function determineNecessaryArchetype({ exuScores, pombagiraScores, exu, pombagira, dimensions }) {
    const lows = new Set(lowDimensions(dimensions).map(([key]) => key));
    const pool = [...exuScores, ...pombagiraScores].filter(item => item.id !== exu.id && item.id !== pombagira.id);
    return pool.map(item => ({ item, need: Object.keys(item.weights).filter(key => lows.has(key)).length, score: item.score }))
        .sort((a, b) => b.need - a.need || a.score - b.score || a.item.name.localeCompare(b.item.name))[0].item;
}

export function determineShadowArchetype({ exuScores, pombagiraScores, dimensions }) {
    const risky = new Set(["shadow", "controlNeed", "rumination", "rejectionSensitivity", "vigilance"]);
    return [...exuScores, ...pombagiraScores]
        .map(item => ({ item, risk: Object.entries(item.weights).reduce((sum, [key, weight]) => sum + (risky.has(key) ? (dimensions[key] || 0) * weight : 0), 0) }))
        .sort((a, b) => b.risk - a.risk || a.item.name.localeCompare(b.item.name))[0].item;
}

export function generateOraclePhrase(result) {
    const area = areaGuidance[result.area] || areaGuidance["espiritualidade"];
    return `Você já carrega a força de ${result.exu.name} e a expressão de ${result.pombagira.name}; sua próxima encruzilhada é transformar ${result.activeShadow} em ${result.neededFunction}, especialmente onde a vida pede ${area}.`;
}

export function generatePlan14(result) {
    const area = areaGuidance[result.area] || areaGuidance["espiritualidade"];
    return Array.from({ length: 14 }, (_, index) => {
        const day = index + 1;
        return {
            day,
            title: day <= 7 ? `Dia ${day}: mapear o padrão` : `Dia ${day}: praticar a função`,
            action: day <= 7 ? `Observe uma manifestação de ${result.activeShadow} e registre gatilho, reação e custo.` : `Aplique ${result.neededFunction} na área escolhida: ${area}.`,
            duration: day <= 7 ? "10 a 15 minutos" : "15 a 25 minutos",
            evidence: day <= 7 ? "Um registro escrito com situação, reação e alternativa." : "Uma ação concreta concluída e anotada.",
            reflection: day <= 7 ? "O que minha defesa tentou proteger?" : "Que evidência mostra que eu agi diferente do padrão antigo?"
        };
    });
}

export function buildAdvancedReading(result) {
    const mode = determineExpressionMode(result.dimensions);
    const contradictions = selectContradictions(result.dimensions);
    const highs = highDimensions(result.dimensions).map(([dimension, value]) => ({ dimension, value }));
    const lows = lowDimensions(result.dimensions).map(([dimension, value]) => ({ dimension, value }));
    return {
        exuComplementary: result.exuScores.find(item => item.id !== result.exu.id),
        pombagiraComplementary: result.pombagiraScores.find(item => item.id !== result.pombagira.id),
        shadowArchetype: determineShadowArchetype(result),
        necessaryArchetype: determineNecessaryArchetype(result),
        expressionMode: mode,
        functioningProfile: determineFunctioningProfile(result.dimensions),
        contradictions,
        dominantPower: highs[0],
        desireBondPattern: result.dimensions.relationalReciprocity > 65 ? "busca de reciprocidade explícita" : "vínculo filtrado por desejo, proteção ou distância",
        defenseMechanism: result.dimensions.controlNeed > result.dimensions.rumination ? "controle preventivo" : "repetição mental e leitura de sinais",
        centralConflict: contradictions[0]?.title || "integração entre potência e constância",
        underusedTalent: lows[0],
        currentCrossroads: `A encruzilhada atual pede ${result.neededFunction} na área ${result.area}.`,
        selfSabotageRisk: contradictions[0]?.risk || result.activeShadow,
        workReading: `Em projetos, a orientação é ${areaGuidance[result.area] || areaGuidance["execução e disciplina"]}.`,
        relationshipReading: "Nas relações, o eixo pede reciprocidade observável e menos interpretação silenciosa.",
        selfWorthReading: "Na autoestima e imagem, o valor cresce quando presença, estética e entrega contam a mesma história.",
        practicalOrientation: areaGuidance[result.area] || areaGuidance["espiritualidade"],
        oraclePhrase: generateOraclePhrase(result),
        plan14: generatePlan14(result),
        paragraphSources: ["texto fixo do arquétipo", "insight dimensional", "contradição", "área da vida", "sombra", "função necessária"]
    };
}
