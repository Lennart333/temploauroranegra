const dimensionLabels = {
    movement: "movimento",
    boundaries: "limites",
    communication: "comunicação",
    shadow: "sombra",
    transformation: "transformação",
    autonomy: "autonomia",
    adaptability: "adaptação",
    consistency: "constância",
    selfWorth: "valor pessoal",
    desire: "desejo",
    magnetism: "magnetismo",
    attachment: "apego",
    emotionalIndependence: "independência emocional",
    imageConsciousness: "imagem"
};

function rankDimensions(dimensions, direction = "high") {
    return Object.entries(dimensions)
        .sort((a, b) => direction === "high" ? b[1] - a[1] || a[0].localeCompare(b[0]) : a[1] - b[1] || a[0].localeCompare(b[0]));
}

function labelList(items) {
    return items.map(([key]) => dimensionLabels[key] || key).join(", ");
}

export function generateCombination({ exu, pombagira, dimensions, activeShadow, area }) {
    const high = rankDimensions(dimensions, "high").slice(0, 3);
    const low = rankDimensions(dimensions, "low").slice(0, 2);
    const highText = labelList(high);
    const lowText = labelList(low);
    return {
        title: `${exu.name} + ${pombagira.name}: funções em diálogo`,
        summary: `Esta combinação não cria uma nova entidade. Ela interpreta como a função de ${exu.name}, ligada a ${exu.essence}, conversa com a expressão de ${pombagira.name}, ligada a ${pombagira.essence}. Na área escolhida, ${area}, suas respostas sugerem que ${highText} conduzem a leitura.`,
        potency: `A potência principal está em ${exu.activePower} enquanto ${pombagira.symbolicPhrase.toLowerCase()} Quando integrado, esse encontro transforma presença simbólica em comportamento observável.`,
        internalConflict: `O conflito interno aparece quando ${lowText} não sustenta a intensidade das dimensões mais altas. Você pode sentir clareza em uma parte do mapa e resistência prática em outra.`,
        risk: `O risco mais provável é ${activeShadow}. Em situações de tensão, isso pode fazer a força arquetípica virar defesa, orgulho, silêncio ou repetição.`,
        practicalGuidance: `A orientação prática é combinar ${exu.developmentNeed.toLowerCase()} com ${pombagira.developmentNeed.toLowerCase()}. Escolha uma atitude pequena, concreta e repetível por sete dias.`,
        highDimensions: high.map(([dimension, value]) => ({ dimension, label: dimensionLabels[dimension] || dimension, value })),
        lowDimensions: low.map(([dimension, value]) => ({ dimension, label: dimensionLabels[dimension] || dimension, value }))
    };
}
