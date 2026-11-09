const STORAGE_KEY_PROMPT = "herzkrom_username";
const STORAGE_KEY_DISPLAY = "herzkrom_username_display";

function getLocalStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function saveUsername(promptName, displayName, storage = getLocalStorage()) {
  try {
    storage?.setItem(STORAGE_KEY_PROMPT, promptName);
    storage?.setItem(STORAGE_KEY_DISPLAY, displayName);
  } catch {
    return;
  }
}

function getSavedUsername(storage = getLocalStorage()) {
  try {
    const promptName = storage?.getItem(STORAGE_KEY_PROMPT);
    const displayName = storage?.getItem(STORAGE_KEY_DISPLAY);
    return {
      prompt: promptName || null,
      display: displayName || null,
    };
  } catch {
    return { prompt: null, display: null };
  }
}

function clearSavedUsername(storage = getLocalStorage()) {
  removeStoredItem(storage, STORAGE_KEY_PROMPT);
  removeStoredItem(storage, STORAGE_KEY_DISPLAY);
}

function removeStoredItem(storage, key) {
  try {
    storage?.removeItem(key);
  } catch {
    return;
  }
}

export { saveUsername, getSavedUsername, clearSavedUsername };
