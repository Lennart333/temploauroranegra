export const storageKey = "temploAuroraNegra.quemEmeuExu.v2";
const legacyStorageKey = "temploAuroraNegra.quemEmeuExu.v1";
export function createEmptyState(){ return { stage:"landing", profile:null, answers:{}, currentIndex:0, result:null }; }
export function sanitizeState(value){ if(!value || typeof value !== "object") return null; const state=createEmptyState(); state.stage=typeof value.stage==="string"?value.stage:state.stage; state.profile=value.profile&&typeof value.profile==="object"?value.profile:null; state.answers=value.answers&&typeof value.answers==="object"?value.answers:{}; state.currentIndex=Number.isInteger(value.currentIndex)?value.currentIndex:0; state.result=value.result&&typeof value.result==="object"?value.result:null; return state; }
export function loadState(storage=window.localStorage){ try { const raw=storage.getItem(storageKey)||storage.getItem(legacyStorageKey); return sanitizeState(JSON.parse(raw)); } catch(error){ return null; } }
export function saveState(state, storage=window.localStorage){ storage.setItem(storageKey, JSON.stringify(sanitizeState(state)||createEmptyState())); }
export function clearState(storage=window.localStorage){ storage.removeItem(storageKey); storage.removeItem(legacyStorageKey); }
