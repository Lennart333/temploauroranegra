function sq(id, text, options) {
    return { id, type: "situational", text, options };
}

function opt(text, weights) {
    return { text, weights };
}

export const situationalQuestions = [
    sq("s1", "Alguém ultrapassa seu limite em público. Você tende a:", [
        opt("Cortar a situação de forma firme e imediata.", { boundaries: 1, autonomy: 0.7, communication: 0.5 }),
        opt("Observar, recuar e agir depois com estratégia.", { shadow: 0.8, emotionalIndependence: 0.7, communication: 0.4 }),
        opt("Tentar suavizar para não criar conflito.", { attachment: 0.8, boundaries: 0.2, communication: 0.5 }),
        opt("Transformar a tensão em fala magnética ou provocação.", { magnetism: 0.8, desire: 0.5, communication: 0.8 })
    ]),
    sq("s2", "Um projeto importante trava. Sua primeira reação é:", [
        opt("Criar um plano e voltar à execução.", { consistency: 1, boundaries: 0.4, selfWorth: 0.4 }),
        opt("Mudar a rota e experimentar outro caminho.", { adaptability: 1, movement: 0.8 }),
        opt("Investigar o bloqueio oculto antes de agir.", { shadow: 0.9, transformation: 0.6 }),
        opt("Buscar apoio, parceria ou validação.", { attachment: 0.7, communication: 0.6 })
    ]),
    sq("s3", "Em relacionamentos, o padrão mais conhecido é:", [
        opt("Desejar intensidade e liberdade ao mesmo tempo.", { desire: 1, autonomy: 0.7, attachment: 0.5 }),
        opt("Precisar de segurança, presença e confirmação.", { attachment: 1, emotionalIndependence: 0.2, selfWorth: 0.4 }),
        opt("Manter distância para não perder controle.", { emotionalIndependence: 1, shadow: 0.6 }),
        opt("Viver magnetismo, sedução e jogo simbólico.", { magnetism: 1, imageConsciousness: 0.6, desire: 0.7 })
    ]),
    sq("s4", "Quando pensa em dinheiro, você sente mais:", [
        opt("Desejo de comando, respeito e expansão.", { selfWorth: 1, magnetism: 0.5, autonomy: 0.5 }),
        opt("Medo de instabilidade e necessidade de método.", { consistency: 0.9, boundaries: 0.5, selfWorth: 0.5 }),
        opt("Culpa ou dificuldade de cobrar seu valor.", { selfWorth: 0.2, attachment: 0.7, shadow: 0.5 }),
        opt("Vontade de ganhar com movimento, vendas ou liberdade.", { movement: 0.8, adaptability: 0.7, communication: 0.6 })
    ]),
    sq("s5", "Um ciclo precisa acabar. Você:", [
        opt("Encerra e não olha para trás.", { transformation: 0.9, emotionalIndependence: 0.8, boundaries: 0.7 }),
        opt("Sofre, mas tenta salvar o vínculo.", { attachment: 1, transformation: 0.3 }),
        opt("Transforma a perda em rito, estudo ou renascimento.", { transformation: 1, shadow: 0.7 }),
        opt("Foge para uma nova experiência.", { movement: 0.8, adaptability: 0.8, consistency: 0.2 })
    ]),
    sq("s6", "Sua comunicação em momentos decisivos costuma ser:", [
        opt("Direta e cortante.", { communication: 0.9, boundaries: 0.7, autonomy: 0.5 }),
        opt("Sedutora, estética ou teatral.", { communication: 0.8, magnetism: 0.8, imageConsciousness: 0.5 }),
        opt("Profunda, simbólica e calculada.", { communication: 0.7, shadow: 0.7, transformation: 0.5 }),
        opt("Cuidadosa para não ferir ou perder.", { communication: 0.6, attachment: 0.8, boundaries: 0.2 })
    ]),
    sq("s7", "Diante da própria sombra, você tende a:", [
        opt("Enfrentar e transformar.", { shadow: 0.8, transformation: 1, movement: 0.4 }),
        opt("Controlar para não demonstrar fragilidade.", { shadow: 0.9, emotionalIndependence: 0.8 }),
        opt("Evitar até que a vida force.", { shadow: 0.6, transformation: 0.2, consistency: 0.2 }),
        opt("Expressar em arte, palavra, sensualidade ou imagem.", { shadow: 0.6, communication: 0.7, magnetism: 0.8 })
    ]),
    sq("s8", "O poder que você mais precisa desenvolver agora é:", [
        opt("Disciplina constante.", { consistency: 1, boundaries: 0.5 }),
        opt("Valor pessoal e prosperidade.", { selfWorth: 1, imageConsciousness: 0.5 }),
        opt("Liberdade com responsabilidade.", { autonomy: 0.8, consistency: 0.6, adaptability: 0.5 }),
        opt("Desapego emocional e fechamento de ciclos.", { emotionalIndependence: 0.8, transformation: 0.8, attachment: 0.2 })
    ]),
    sq("s9", "Quando recebe uma crítica ambígua, você costuma:", [
        opt("Pedir evidências e separar fato de interpretação.", { emotionalRegulation: 0.8, strategicPatience: 0.7, vigilance: 0.4 }),
        opt("Sentir a crítica como rejeição antes de avaliá-la.", { rejectionSensitivity: 1, rumination: 0.7 }),
        opt("Responder com domínio para recuperar posição.", { socialDominance: 0.9, statusDrive: 0.7, controlNeed: 0.5 }),
        opt("Recuar e observar padrões antes de falar.", { vigilance: 0.9, strategicPatience: 0.8 })
    ]),
    sq("s10", "Diante de uma oportunidade nova e arriscada, você prefere:", [
        opt("Testar rápido em escala pequena.", { agency: 0.9, noveltySeeking: 0.7, emotionalRegulation: 0.5 }),
        opt("Esperar sinais mais claros antes de entrar.", { vigilance: 0.8, strategicPatience: 0.8 }),
        opt("Entrar se houver visibilidade e reconhecimento.", { statusDrive: 0.9, socialDominance: 0.6 }),
        opt("Entrar se ela tiver sentido profundo para sua fase.", { meaningSeeking: 1, closure: 0.4 })
    ]),
    sq("s11", "Quando uma relação perde equilíbrio, sua tendência é:", [
        opt("Cobrar reciprocidade de forma direta.", { relationalReciprocity: 1, communication: 0.5, boundaries: 0.4 }),
        opt("Tentar controlar sinais para não ser surpreendido.", { controlNeed: 0.8, rejectionSensitivity: 0.7, vigilance: 0.5 }),
        opt("Criar distância estética ou emocional.", { aestheticIdentity: 0.7, vulnerabilityTolerance: 0.6, emotionalIndependence: 0.5 }),
        opt("Repetir mentalmente a cena até entender o que falhou.", { rumination: 1, rejectionSensitivity: 0.5 })
    ]),
    sq("s12", "Quando precisa encerrar um projeto, você:", [
        opt("Fecha, documenta e libera energia para o próximo ciclo.", { closure: 1, agency: 0.6, consistency: 0.3 }),
        opt("Muda para algo novo antes de concluir tudo.", { noveltySeeking: 1, closure: 0.2 }),
        opt("Segura a decisão porque teme perder status ou investimento.", { statusDrive: 0.7, controlNeed: 0.6, closure: 0.2 }),
        opt("Procura sentido na experiência antes de encerrar.", { meaningSeeking: 0.9, strategicPatience: 0.5 })
    ])
];
