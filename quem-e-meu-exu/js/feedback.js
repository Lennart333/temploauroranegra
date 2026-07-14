export const feedbackStorageKey = "temploAuroraNegra.quemEmeuExu.feedback.v1";

export function createAnonymousCode(random = Math.random) {
    const n = Math.floor(random() * 0xffffff).toString(16).toUpperCase().padStart(6, "0");
    return `T-${n}`;
}

export function buildFeedbackRecord({ result, feedback, now = new Date(), code = createAnonymousCode() }) {
    return {
        code,
        date: now.toISOString(),
        exu: result.exu.name,
        pombagira: result.pombagira.name,
        dimensions: result.dimensions,
        feedback: { ...feedback }
    };
}

export function loadFeedbackRecords(storage = window.localStorage) {
    try {
        const parsed = JSON.parse(storage.getItem(feedbackStorageKey) || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveFeedbackRecord(record, storage = window.localStorage) {
    const records = loadFeedbackRecords(storage);
    records.push(record);
    storage.setItem(feedbackStorageKey, JSON.stringify(records));
    return records;
}

export function clearFeedbackRecords(storage = window.localStorage) {
    storage.removeItem(feedbackStorageKey);
}

export function exportFeedbackJson(storage = window.localStorage) {
    return JSON.stringify(loadFeedbackRecords(storage), null, 2);
}
