export const neededFunctions = {
    consistency: "disciplina e execução contínua",
    boundaries: "limites claros e proteção do próprio território",
    selfWorth: "valor pessoal, merecimento e prosperidade",
    emotionalIndependence: "independência emocional e desapego",
    communication: "comunicação direta, honesta e persuasiva",
    transformation: "encerramento de ciclos e renascimento",
    autonomy: "autonomia com responsabilidade",
    attachment: "segurança afetiva sem dependência"
};

export function determineNeededFunction(calculatedDimensions) {
    const candidates = ["consistency", "boundaries", "selfWorth", "emotionalIndependence", "communication", "transformation", "autonomy"];
    const lowest = candidates
        .map(dimension => ({ dimension, value: calculatedDimensions[dimension] }))
        .sort((a, b) => a.value - b.value || a.dimension.localeCompare(b.dimension))[0];
    return neededFunctions[lowest.dimension];
}

export function generateSevenDayPlan(result) {
    return [
        `Dia 1: escreva qual limite precisa ser protegido para honrar ${result.exu.name}.`,
        `Dia 2: observe onde ${result.activeShadow} aparece no cotidiano sem acusar ninguém.`,
        `Dia 3: faça uma ação prática ligada a ${result.neededFunction}.`,
        "Dia 4: escolha uma conversa importante e pratique comunicação mais consciente.",
        "Dia 5: organize uma decisão material ligada ao seu valor pessoal.",
        "Dia 6: encerre uma pendência pequena que ainda rouba energia.",
        "Dia 7: registre o que mudou e escolha um compromisso simples para os próximos sete dias."
    ];
}
