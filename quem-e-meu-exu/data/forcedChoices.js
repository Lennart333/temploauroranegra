function choice(id, text, a, b) {
    return { id, type: "forced", text, options: [{ value: "a", ...a }, { value: "b", ...b }] };
}

export const forcedChoices = [
    choice("f1", "Mesmo que as duas afirmações tenham algo de verdadeiro, qual descreve melhor você?", { text: "Prefiro manter diferentes possibilidades abertas até entender melhor o cenário.", weights: { noveltySeeking: 0.8, strategicPatience: 0.4 } }, { text: "Prefiro escolher uma direção e aprender com as consequências.", weights: { agency: 0.8, closure: 0.6 } }),
    choice("f2", "Quando há conflito, o que aparece primeiro?", { text: "Observo riscos e controlo sinais antes de falar.", weights: { vigilance: 0.8, controlNeed: 0.6 } }, { text: "Falo para movimentar a situação, mesmo sem garantias.", weights: { socialDominance: 0.7, agency: 0.5 } }),
    choice("f3", "O que pesa mais em uma escolha afetiva?", { text: "Reciprocidade clara e presença consistente.", weights: { relationalReciprocity: 0.9, emotionalRegulation: 0.5 } }, { text: "Desejo, atmosfera e intensidade do encontro.", weights: { aestheticIdentity: 0.7, noveltySeeking: 0.5 } }),
    choice("f4", "Quando sua imagem está em jogo, você tende a:", { text: "Assumir presença e sustentar posição.", weights: { statusDrive: 0.8, socialDominance: 0.7 } }, { text: "Refinar a forma antes de se expor.", weights: { aestheticIdentity: 0.9, strategicPatience: 0.5 } }),
    choice("f5", "Diante de vulnerabilidade, você prefere:", { text: "Mostrar só o suficiente para manter controle.", weights: { controlNeed: 0.8, vulnerabilityTolerance: 0.3 } }, { text: "Abrir uma parte real se houver segurança mínima.", weights: { vulnerabilityTolerance: 0.9, relationalReciprocity: 0.5 } }),
    choice("f6", "Depois de uma rejeição, costuma ser mais forte em você:", { text: "Repassar mentalmente a cena para encontrar sinais.", weights: { rejectionSensitivity: 0.9, rumination: 0.8 } }, { text: "Reorganizar sentido e seguir para uma escolha mais autoral.", weights: { meaningSeeking: 0.8, agency: 0.5 } })
];
