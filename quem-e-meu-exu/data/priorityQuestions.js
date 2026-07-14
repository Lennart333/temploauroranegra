function pq(id, text, options) {
    return { id, type: "priority", text, options };
}
function opt(text, weights) { return { text, weights }; }
export const priorityQuestions = [
    pq("p1", "Neste momento, o que parece mais urgente desenvolver?", [opt("Autoria e iniciativa.", { agency: 1, autonomy: 0.4 }), opt("Regulação emocional.", { emotionalRegulation: 1, vulnerabilityTolerance: 0.4 }), opt("Fechamento de ciclos.", { closure: 1, transformation: 0.4 }), opt("Paciência estratégica.", { strategicPatience: 1, consistency: 0.4 })]),
    pq("p2", "Qual custo você mais paga quando está sob tensão?", [opt("Controlar demais.", { controlNeed: 1, vigilance: 0.4 }), opt("Reagir à rejeição.", { rejectionSensitivity: 1, attachment: 0.4 }), opt("Ruminar conflitos.", { rumination: 1, shadow: 0.4 }), opt("Buscar novidade antes de concluir.", { noveltySeeking: 1, closure: 0.2 })]),
    pq("p3", "O que mais fortalece sua presença?", [opt("Reconhecimento por entrega real.", { statusDrive: 0.8, agency: 0.5 }), opt("Estética alinhada à identidade.", { aestheticIdentity: 1, imageConsciousness: 0.4 }), opt("Reciprocidade madura.", { relationalReciprocity: 1, emotionalRegulation: 0.4 }), opt("Sentido profundo.", { meaningSeeking: 1, transformation: 0.4 })]),
    pq("p4", "Qual forma de poder você desconfia mais em si?", [opt("Domínio social.", { socialDominance: 1, statusDrive: 0.4 }), opt("Controle silencioso.", { controlNeed: 1, vigilance: 0.4 }), opt("Encanto estético.", { aestheticIdentity: 0.8, magnetism: 0.4 }), opt("Distância emocional.", { vulnerabilityTolerance: 0.2, emotionalIndependence: 0.5 })])
];
