import { areas, likertScale } from "../data/dimensions.js";
import { displayAssessmentQuestions } from "../data/assessmentItems.js";
import { resultTexts } from "../data/resultTexts.js";
import { calculateExuScores, calculatePombagiraScores } from "../lib/scoring.js";
import { generateResult } from "../lib/resultGenerator.js";
import { generateCombination } from "../lib/combinationGenerator.js";
import { selectDimensionInsights } from "../lib/insightGenerator.js";
import { detectActiveShadows, getShadowDiagnostics } from "../data/shadowRules.js";
import { determineNeededFunction, generateSevenDayPlan } from "../data/developmentPlans.js";
import { buildProfileAnswers } from "./testMode.js";
import { clearState as clearStoredState, createEmptyState, loadState as loadStoredState, saveState as persistStoredState } from "./storage.js";
import { buildFeedbackRecord, clearFeedbackRecords, exportFeedbackJson, loadFeedbackRecords, saveFeedbackRecord } from "./feedback.js";
import { shareResult } from "./share.js";`nimport { calculateDifferentiationAudit } from "../lib/differentiationAudit.js";

const allQuestions = displayAssessmentQuestions;
const state = loadStoredState() || createEmptyState();
const testMode = new URLSearchParams(window.location.search).get("testMode") === "true";

const els = {
    landing: document.querySelector("#landing"),
    initialFormPanel: document.querySelector("#initialFormPanel"),
    questionPanel: document.querySelector("#questionPanel"),
    processingPanel: document.querySelector("#processingPanel"),
    resultPanel: document.querySelector("#resultPanel"),
    startButton: document.querySelector("#startButton"),
    resumeButton: document.querySelector("#resumeButton"),
    eraseButton: document.querySelector("#eraseButton"),
    initialForm: document.querySelector("#initialForm"),
    area: document.querySelector("#area"),
    formError: document.querySelector("#formError"),
    backToLanding: document.querySelector("#backToLanding"),
    progressText: document.querySelector("#progressText"),
    progressBar: document.querySelector("#progressBar"),
    questionTitle: document.querySelector("#questionTitle"),
    questionHelp: document.querySelector("#questionHelp"),
    answers: document.querySelector("#answers"),
    questionError: document.querySelector("#questionError"),
    previousQuestion: document.querySelector("#previousQuestion"),
    nextQuestion: document.querySelector("#nextQuestion"),
    devPanel: document.querySelector("#devPanel"),
    jumpResult: document.querySelector("#jumpResult"),
    exportJson: document.querySelector("#exportJson"),
    debugScores: document.querySelector("#debugScores"),
    diagnosticPanel: document.querySelector("#diagnosticPanel")
};

areas.forEach(area => {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area;
    els.area.appendChild(option);
});

if (testMode) {
    els.devPanel.classList.remove("hidden");
    addExtremeButtons();
}

els.startButton.addEventListener("click", () => setStage("form"));
els.resumeButton.addEventListener("click", render);
els.eraseButton.addEventListener("click", eraseData);
els.backToLanding.addEventListener("click", () => setStage("landing"));
els.initialForm.addEventListener("submit", submitInitialForm);
els.previousQuestion.addEventListener("click", previousQuestion);
els.nextQuestion.addEventListener("click", nextQuestion);
els.devPanel.addEventListener("click", handleDevClick);
els.jumpResult.addEventListener("click", finishTest);
els.exportJson.addEventListener("click", exportJson);

render();

function submitInitialForm(event) {
    event.preventDefault();
    const formData = new FormData(els.initialForm);
    const profile = {
        firstName: String(formData.get("firstName") || "").trim(),
        birthDate: String(formData.get("birthDate") || ""),
        area: String(formData.get("area") || ""),
        accepted: Boolean(formData.get("accepted"))
    };
    if (!profile.firstName || !profile.birthDate || !profile.area || !profile.accepted) {
        els.formError.textContent = "Preencha todos os campos e aceite o aviso para continuar.";
        return;
    }
    state.profile = profile;
    state.currentIndex = 0;
    state.stage = "questions";
    saveState();
    render();
}

function render() {
    hideAll();
    els.resumeButton.classList.toggle("hidden", !loadStoredState());
    if (state.stage === "landing") els.landing.classList.remove("hidden");
    if (state.stage === "form") renderForm();
    if (state.stage === "questions") renderQuestion();
    if (state.stage === "processing") renderProcessing();
    if (state.stage === "result") renderResult();
}

function hideAll() {
    [els.landing, els.initialFormPanel, els.questionPanel, els.processingPanel, els.resultPanel].forEach(element => element.classList.add("hidden"));
}

function renderForm() {
    els.initialFormPanel.classList.remove("hidden");
    if (state.profile) {
        els.initialForm.firstName.value = state.profile.firstName || "";
        els.initialForm.birthDate.value = state.profile.birthDate || "";
        els.initialForm.area.value = state.profile.area || areas[0];
        els.initialForm.accepted.checked = Boolean(state.profile.accepted);
    }
    els.formError.textContent = "";
}

function renderQuestion() {
    els.questionPanel.classList.remove("hidden");
    const question = allQuestions[state.currentIndex];
    const progress = Math.round(((state.currentIndex + 1) / allQuestions.length) * 100);
    els.progressText.textContent = `Pergunta ${state.currentIndex + 1} de ${allQuestions.length}`;
    els.progressBar.style.width = `${progress}%`;
    els.questionTitle.textContent = question.text;
    els.questionHelp.textContent = question.type === "likert" ? "Escolha uma opção de 1 a 5." : "Escolha a alternativa que mais se aproxima do seu padrão.";
    els.questionError.textContent = "";
    els.previousQuestion.disabled = state.currentIndex === 0;
    els.nextQuestion.textContent = state.currentIndex === allQuestions.length - 1 ? "Ver resultado" : "Continuar";
    renderAnswers(question);
}

function renderAnswers(question) {
    const saved = state.answers[question.id];
    if (question.type === "open") {
        els.answers.innerHTML = `<label class="field"><textarea name="answer" rows="4">${saved || ""}</textarea></label>`;
        els.answers.querySelector("textarea").addEventListener("input", event => {
            state.answers[question.id] = event.target.value;
            saveState();
        });
        return;
    }
    const options = question.type === "likert"
        ? likertScale.map((label, index) => ({ label: `${index + 1}. ${label}`, value: index + 1 }))
        : question.options.map((option, index) => ({ label: option.text, value: option.value ?? index }));
    els.answers.innerHTML = options.map(option => `
        <label class="answer">
            <input type="radio" name="answer" value="${option.value}" ${String(saved) === String(option.value) ? "checked" : ""}>
            <span>${option.label}</span>
        </label>
    `).join("");
    els.answers.querySelectorAll("input").forEach(input => {
        input.addEventListener("change", () => {
            state.answers[question.id] = question.type === "likert" ? Number(input.value) : input.value.match(/^\d+$/) ? Number(input.value) : input.value;
            saveState();
        });
    });
}

function previousQuestion() {
    if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        saveState();
        renderQuestion();
    }
}

function nextQuestion() {
    const question = allQuestions[state.currentIndex];
    if (!question.optional && state.answers[question.id] === undefined) {
        els.questionError.textContent = "Escolha uma resposta antes de continuar.";
        return;
    }
    if (state.currentIndex === allQuestions.length - 1) {
        finishTest();
        return;
    }
    state.currentIndex += 1;
    saveState();
    renderQuestion();
}

function renderProcessing() {
    els.processingPanel.classList.remove("hidden");
    window.setTimeout(() => {
        try {
            state.result = generateResult(state.profile, state.answers);
            state.stage = "result";
            saveState();
            render();
        } catch (error) {
            state.stage = "questions";
            saveState();
            render();
            els.questionError.textContent = error.message;
        }
    }, 350);
}

function finishTest() {
    state.stage = "processing";
    saveState();
    render();
}

function renderResult() {
    const result = state.result || generateResult(state.profile, state.answers);
    state.result = result;
    saveState();
    const exuText = resultTexts.exu[result.exu.id];
    const pombagiraText = resultTexts.pombagira[result.pombagira.id];
    els.resultPanel.classList.remove("hidden");
    els.resultPanel.innerHTML = `
        <h2>${result.firstName}, suas respostas sugerem este mapa simbólico</h2>
        <p class="notice">${result.methodologicalNotice}</p>

        <div class="result-grid">
            ${summaryCard("Exu predominante", result.exu.name, result.exu.subtitle)}
            ${summaryCard("Pombagira predominante", result.pombagira.name, result.pombagira.subtitle)}
        </div>

        <section class="reading-block">
            <h2>${result.combination.title}</h2>
            <p>${result.combination.summary}</p>
            <p><strong>Potência da combinação:</strong> ${result.combination.potency}</p>
            <p><strong>Conflito interno:</strong> ${result.combination.internalConflict}</p>
            <p><strong>Risco:</strong> ${result.combination.risk}</p>
            <p><strong>Orientação prática:</strong> ${result.combination.practicalGuidance}</p>
        </section>

        <section class="reading-block">
            <h2>Funcionamento atual</h2>
            <p><strong>Perfil transversal:</strong> ${result.advanced.functioningProfile}</p>
            <p><strong>Modo de expresso:</strong> ${result.advanced.expressionMode.mode}. ${result.advanced.expressionMode.explanation}</p>
            <p><strong>Exu complementar:</strong> ${result.advanced.exuComplementary.name}</p>
            <p><strong>Pombagira complementar:</strong> ${result.advanced.pombagiraComplementary.name}</p>
            <p><strong>Arqutipo de sombra:</strong> ${result.advanced.shadowArchetype.name}</p>
            <p><strong>Arqutipo necessrio:</strong> ${result.advanced.necessaryArchetype.name}</p>
        </section>

        <section class="reading-block">
            <h2>Contradies centrais</h2>
            ${contradictionList(result.advanced.contradictions)}
        </section>

        <section class="reading-block">
            <h2>Camadas avanadas</h2>
            <p><strong>Forma dominante de poder:</strong> ${result.advanced.dominantPower.dimension}</p>
            <p><strong>Padro de desejo e vnculo:</strong> ${result.advanced.desireBondPattern}</p>
            <p><strong>Mecanismo de defesa predominante:</strong> ${result.advanced.defenseMechanism}</p>
            <p><strong>Conflito central:</strong> ${result.advanced.centralConflict}</p>
            <p><strong>Talento pouco utilizado:</strong> ${result.advanced.underusedTalent.dimension}</p>
            <p><strong>Encruzilhada atual:</strong> ${result.advanced.currentCrossroads}</p>
            <p><strong>Risco de autossabotagem:</strong> ${result.advanced.selfSabotageRisk}</p>
            <p>${result.advanced.workReading}</p>
            <p>${result.advanced.relationshipReading}</p>
            <p>${result.advanced.selfWorthReading}</p>
            <p><strong>Frase-orculo:</strong> ${result.advanced.oraclePhrase}</p>
        </section>

        <section class="reading-block full-report hidden" id="fullReport">
            <h2>Relatrio completo de demonstrao</h2>
            <p><strong>Origem dos pargrafos:</strong> ${result.advanced.paragraphSources.join(", ")}</p>
            <ol>${result.plan14.map(item => `<li><strong>${item.title}</strong>: ${item.action} <em>${item.duration}</em>. Evidncia: ${item.evidence} Pergunta: ${item.reflection}</li>`).join("")}</ol>
        </section>

        <div class="button-row"><button type="button" id="toggleFullReport">Visualizar demonstrao completa</button></div>

        <section class="reading-block">
            <h2>Gráfico de dimensões</h2>
            <div class="bars">${dimensionBars(result.dimensions)}</div>
        </section>

        <section class="reading-block">
            <h2>Sua potência</h2>
            <p>${result.exu.openingReading}</p>
            <p>${result.pombagira.openingReading}</p>
            <p>${exuText.potency} ${pombagiraText.potency}</p>
        </section>

        <section class="reading-block">
            <h2>Sua sombra ativa</h2>
            <p><strong>${result.activeShadow}</strong></p>
            <p>${exuText.shadow} ${pombagiraText.shadow}</p>
            ${insightList(result.dimensionInsights)}
        </section>

        <section class="reading-block">
            <h2>Relacionamentos</h2>
            <p>${result.exu.relationshipPattern}</p>
            <p>${result.pombagira.relationshipPattern}</p>
        </section>

        <section class="reading-block">
            <h2>Projetos e trabalho</h2>
            <p>${result.exu.workPattern}</p>
            <p>${result.pombagira.imagePattern}</p>
        </section>

        <section class="reading-block">
            <h2>Função que precisa ser desenvolvida</h2>
            <p><strong>${result.neededFunction}</strong></p>
            <p>${result.exu.practicalAdvice} ${result.pombagira.practicalAdvice}</p>
        </section>

        <section class="reading-block">
            <h2>Ritual psicológico</h2>
            <p>Escolha um papel e escreva: “O padrão que eu deixo na encruzilhada é...”. Depois escreva uma ação concreta que represente a função a desenvolver: <strong>${result.neededFunction}</strong>. Rasgue o papel antigo, guarde a ação prática e execute-a em até 24 horas. Este é um exercício simbólico de organização interna, sem promessa espiritual.</p>
        </section>

        <section class="reading-block">
            <h2>Plano de 14 dias</h2>
            <ol>${result.plan.map(item => `<li>${item}</li>`).join("")}</ol>
        </section>

        <section class="reading-block">
            <h2>Aviso metodológico</h2>
            <p>Este teste usa pontuação determinística em dimensões simbólicas. As frases usam linguagem probabilística: suas respostas sugerem, você tende a, este padrão pode aparecer como. A leitura não substitui orientação profissional de saúde, jurídica, financeira ou religiosa.</p>
        </section>

        ${feedbackForm()}

        <div class="button-row">
            <button type="button" id="shareButton">Compartilhar meu resultado</button>
            <button type="button" id="restartButton">Refazer teste</button>
            <button type="button" id="eraseResultButton">Apagar meus dados</button>
            ${testMode ? '<button type="button" id="exportFeedbackButton">Exportar feedback em JSON</button><button type="button" id="clearFeedbackButton">Apagar apenas feedbacks</button>' : ""}
        </div>
        <pre id="feedbackExport" class="hidden"></pre>
    `;
    document.querySelector("#restartButton").addEventListener("click", restart);
    document.querySelector("#eraseResultButton").addEventListener("click", eraseData);
    document.querySelector("#shareButton").addEventListener("click", handleShare);`n    document.querySelector("#toggleFullReport").addEventListener("click", () => document.querySelector("#fullReport").classList.toggle("hidden"));
    document.querySelector("#feedbackForm").addEventListener("submit", handleFeedbackSubmit);
    if (testMode) {
        document.querySelector("#exportFeedbackButton").addEventListener("click", showFeedbackExport);
        document.querySelector("#clearFeedbackButton").addEventListener("click", () => {
            clearFeedbackRecords();
            renderDebug(result);
        });
    }
    renderDebug(result);
}

function summaryCard(label, title, subtitle) {
    return `<article class="card"><h3>${label}</h3><strong>${title}</strong><p>${subtitle}</p></article>`;
}

function dimensionBars(dimensions) {
    return Object.entries(dimensions)
        .sort((a, b) => b[1] - a[1])
        .map(([dimension, value]) => `
            <div class="bar-row">
                <span>${dimension}</span>
                <span class="bar-track" aria-label="${dimension}: ${value} de 100"><span class="bar-fill" style="width:${value}%"></span></span>
                <strong>${value}</strong>
            </div>
        `).join("");
}

function contradictionList(items) {
    if (!items.length) return "<p>Nenhuma contradio prioritria foi ativada alm do eixo central.</p>";
    return `<div class="insight-list">${items.map(item => `<article class="card"><h3>${item.title}</h3><p>${item.explanation}</p><p><strong>Manifestao:</strong> ${item.manifestation}</p><p><strong>Potncia contida:</strong> ${item.potency}</p><p><strong>Risco:</strong> ${item.risk}</p><p><strong>Ao:</strong> ${item.action}</p></article>`).join("")}</div>`;
}
function insightList(insights) {
    if (!insights.length) return "<p>Nenhum insight condicional prioritário foi ativado além da leitura principal.</p>";
    return `<div class="insight-list">${insights.map(item => `
        <article class="card">
            <h3>${item.category}</h3>
            <p>${item.text}</p>
            <p><strong>Ação:</strong> ${item.suggestedAction}</p>
        </article>
    `).join("")}</div>`;
}

function feedbackForm() {
    return `
        <section class="reading-block">
            <h2>Feedback para teste fechado</h2>
            <form id="feedbackForm" class="feedback-form">
                ${rangeField("exuMatch", "Quanto o resultado de Exu representou você?")}
                ${rangeField("pombagiraMatch", "Quanto o resultado de Pombagira representou você?")}
                ${textField("mostPrecise", "Qual trecho pareceu mais preciso?")}
                ${textField("genericOrWrong", "Qual trecho pareceu genérico ou incorreto?")}
                ${textField("expectedResult", "Qual resultado você esperava receber?")}
                ${textField("confusingQuestion", "Alguma pergunta foi confusa?")}
                ${selectField("feltLong", "O teste pareceu longo?", ["não", "um pouco", "sim"])}
                ${selectField("wouldShare", "Você compartilharia o resultado?", ["sim", "talvez", "não"])}
                ${selectField("wouldPay", "Você pagaria por uma leitura completa?", ["sim", "talvez", "não"])}
                ${textField("fairPrice", "Qual valor consideraria justo?")}
                ${textField("deepen", "O que gostaria que a leitura aprofundasse?")}
                <div class="button-row"><button class="primary" type="submit">Salvar feedback local</button></div>
                <p id="feedbackStatus" class="notice hidden"></p>
            </form>
        </section>
    `;
}

function rangeField(name, label) {
    return `<label class="field">${label}<input name="${name}" type="range" min="0" max="10" value="5"><span>0 a 10</span></label>`;
}

function textField(name, label) {
    return `<label class="field">${label}<textarea name="${name}" rows="3"></textarea></label>`;
}

function selectField(name, label, options) {
    return `<label class="field">${label}<select name="${name}">${options.map(option => `<option value="${option}">${option}</option>`).join("")}</select></label>`;
}

function handleFeedbackSubmit(event) {
    event.preventDefault();
    const feedback = Object.fromEntries(new FormData(event.currentTarget).entries());
    const record = buildFeedbackRecord({ result: state.result, feedback });
    saveFeedbackRecord(record);
    const status = document.querySelector("#feedbackStatus");
    status.classList.remove("hidden");
    status.textContent = `Feedback salvo localmente com o código ${record.code}.`;
    renderDebug(state.result);
}

async function handleShare() {
    const button = document.querySelector("#shareButton");
    try {
        const outcome = await shareResult(state.result, window.location.href.split("?")[0]);
        button.textContent = outcome === "shared" ? "Resultado compartilhado" : "Resumo copiado";
    } catch {
        button.textContent = "Não foi possível compartilhar";
    }
}

function showFeedbackExport() {
    const pre = document.querySelector("#feedbackExport");
    pre.classList.remove("hidden");
    pre.textContent = exportFeedbackJson();
}

function setStage(stage) {
    state.stage = stage;
    saveState();
    render();
}

function restart() {
    state.stage = "form";
    state.answers = {};
    state.currentIndex = 0;
    state.result = null;
    saveState();
    render();
}

function eraseData() {
    clearStoredState();
    Object.assign(state, createEmptyState());
    render();
}

function saveState() {
    persistStoredState(state);
}

function handleDevClick(event) {
    const profileButton = event.target.closest("[data-profile]");
    const extremeButton = event.target.closest("[data-extreme]");
    if (!profileButton && !extremeButton) return;
    state.profile = { firstName: "Teste", birthDate: "1990-07-23", area: "espiritualidade", accepted: true };
    state.answers = buildProfileAnswers(profileButton?.dataset.profile || "balanced");
    state.result = extremeButton ? simulateDimensionResult(extremeButton.dataset.extreme) : generateResult(state.profile, state.answers);
    state.currentIndex = 0;
    state.stage = "result";
    saveState();
    render();
}

function exportJson() {
    els.debugScores.classList.remove("hidden");
    els.debugScores.textContent = JSON.stringify({ answers: state.answers, result: sanitizeResultForExport(state.result), feedbacks: loadFeedbackRecords() }, null, 2);
}

function sanitizeResultForExport(result) {
    if (!result) return null;
    const { firstName, ...safeResult } = result;
    return safeResult;
}

function renderDebug(result) {
    if (!testMode || !result) return;
    els.diagnosticPanel.classList.remove("hidden");
    els.diagnosticPanel.innerHTML = `
        <section class="diagnostic-section">
            <h2>Painel técnico</h2>
            <p><strong>Combinação gerada:</strong> ${result.combination.title}</p>
            <p>${result.combination.summary}</p>
            <p><strong>Insights ativados:</strong> ${result.dimensionInsights.map(item => `${item.id} (prioridade ${item.priority})`).join(", ") || "nenhum"}</p>
            <p><strong>Textos selecionados:</strong> ${result.exu.name} / ${result.pombagira.name}</p>
            <p><strong>Feedbacks salvos:</strong> ${loadFeedbackRecords().length}</p>`n            <h3>Matriz de diferenciacao</h3>`n            <table class="diagnostic-table"><thead><tr><th>Tipo</th><th>A</th><th>B</th><th>Similaridade</th></tr></thead><tbody>${differentiationRows()}</tbody></table>
            <table class="diagnostic-table"><thead><tr><th>Exu</th><th>Score</th></tr></thead><tbody>${scoreRows(result.exuScores)}</tbody></table>
            <table class="diagnostic-table"><thead><tr><th>Pombagira</th><th>Score</th></tr></thead><tbody>${scoreRows(result.pombagiraScores)}</tbody></table>
        </section>
    `;
}

function differentiationRows() {`n    return calculateDifferentiationAudit().map(item => `<tr><td>${item.kind}</td><td>${item.a}</td><td>${item.b}</td><td>${item.similarity}</td></tr>`).join("") || "<tr><td colspan=\"4\">Nenhuma redundancia acima do limite.</td></tr>";`n}`n`nfunction scoreRows(scores) {
    return scores.map(item => `<tr><td>${item.name}</td><td>${item.score}</td></tr>`).join("");
}

function addExtremeButtons() {
    const row = els.devPanel.querySelector(".button-row");
    const presets = [
        ["autonomy-low-consistency", "Alta autonomia / baixa constância"],
        ["magnetism-low-worth", "Alto magnetismo / baixa autoestima"],
        ["low-boundaries-high-attachment", "Limites baixos / apego alto"],
        ["high-shadow-low-transformation", "Sombra alta / baixa transformação"],
        ["high-boundaries-low-attachment", "Limites excessivos / vínculo baixo"],
        ["balanced-dimensions", "Dimensões equilibradas"]
    ];
    presets.forEach(([id, label]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.extreme = id;
        button.textContent = label;
        row.appendChild(button);
    });
}

function simulateDimensionResult(name) {
    const base = generateResult(state.profile, buildProfileAnswers("balanced"));
    const dimensions = {
        movement: 55, boundaries: 55, communication: 55, shadow: 55, transformation: 55, autonomy: 55,
        adaptability: 55, consistency: 55, selfWorth: 55, desire: 55, magnetism: 55, attachment: 55,
        emotionalIndependence: 55, imageConsciousness: 55
    };
    const presets = {
        "autonomy-low-consistency": { autonomy: 92, consistency: 32 },
        "magnetism-low-worth": { magnetism: 88, selfWorth: 35 },
        "low-boundaries-high-attachment": { boundaries: 28, attachment: 84 },
        "high-shadow-low-transformation": { shadow: 90, transformation: 34 },
        "high-boundaries-low-attachment": { boundaries: 90, attachment: 24 },
        "balanced-dimensions": {}
    };
    Object.assign(dimensions, presets[name] || {});
    const exuScores = calculateExuScores(dimensions);
    const pombagiraScores = calculatePombagiraScores(dimensions);
    const result = { ...base, dimensions, exu: exuScores[0], pombagira: pombagiraScores[0], exuScores, pombagiraScores };
    result.activeShadow = detectActiveShadows(dimensions);
    result.shadowDiagnostics = getShadowDiagnostics(dimensions);
    result.neededFunction = determineNeededFunction(dimensions);
    result.combination = generateCombination(result);
    result.dimensionInsights = selectDimensionInsights(dimensions);
    result.plan = generateSevenDayPlan(result);
    return result;
}




