export const shadowRules = [
    {
        id: "unnamed-shadow-self-sabotage",
        name: "autossabotagem por sombra não nomeada",
        priority: 1,
        reason: "combina sombra alta, queda de consistência e desejo pressionando escolhas.",
        recommendation: "nomeie o desejo antes de agir e transforme impulso em uma ação pequena e verificável.",
        evaluate: d => d.shadow * 0.55 + (100 - d.consistency) * 0.25 + d.desire * 0.2
    },
    {
        id: "attachment-fear-loss",
        name: "apego afetivo e medo de perda",
        priority: 2,
        reason: "combina apego, baixa independência emocional e limites enfraquecidos.",
        recommendation: "diferencie vínculo de dependência e pratique uma escolha afetiva sem cobrança imediata.",
        evaluate: d => d.attachment * 0.55 + (100 - d.emotionalIndependence) * 0.3 + (100 - d.boundaries) * 0.15
    },
    {
        id: "fragile-boundaries",
        name: "limites frágeis",
        priority: 3,
        reason: "combina baixa fronteira, apego e dificuldade de comunicação direta.",
        recommendation: "declare um limite em frase simples, sem justificar demais nem provocar guerra.",
        evaluate: d => (100 - d.boundaries) * 0.55 + d.attachment * 0.25 + (100 - d.communication) * 0.2
    },
    {
        id: "practical-inconstancy",
        name: "inconstância prática",
        priority: 4,
        reason: "combina baixa constância com excesso de movimento e adaptação.",
        recommendation: "escolha uma rotina mínima e cumpra antes de abrir uma nova rota.",
        evaluate: d => (100 - d.consistency) * 0.5 + d.movement * 0.25 + d.adaptability * 0.25
    },
    {
        id: "oscillating-self-worth",
        name: "valor pessoal oscilante",
        priority: 5,
        reason: "combina valor pessoal baixo, preocupação com imagem e validação afetiva.",
        recommendation: "precifique, peça ou sustente valor antes de procurar aprovação externa.",
        evaluate: d => (100 - d.selfWorth) * 0.5 + d.imageConsciousness * 0.25 + d.attachment * 0.25
    },
    {
        id: "closure-avoidance",
        name: "fuga de encerramentos",
        priority: 6,
        reason: "combina resistência a encerramentos, apego e sombra ativa.",
        recommendation: "encerre uma pendência pequena para treinar o sistema interno a tolerar finais.",
        evaluate: d => (100 - d.transformation) * 0.5 + d.attachment * 0.3 + d.shadow * 0.2
    }
];

export function getShadowDiagnostics(calculatedDimensions) {
    return shadowRules
        .map(rule => ({
            id: rule.id,
            name: rule.name,
            priority: rule.priority,
            reason: rule.reason,
            recommendation: rule.recommendation,
            value: Number(Math.max(0, Math.min(100, rule.evaluate(calculatedDimensions))).toFixed(2))
        }))
        .sort((a, b) => b.value - a.value || a.priority - b.priority || a.name.localeCompare(b.name));
}

export function detectActiveShadows(calculatedDimensions) {
    return getShadowDiagnostics(calculatedDimensions)[0].name;
}
