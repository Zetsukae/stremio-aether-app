const STORAGE_KEY = 'aether-no-animations';
const ROOT_ATTRIBUTE = 'data-no-animations';

export const isNoAnimationsEnabled = () => localStorage.getItem(STORAGE_KEY) === 'true';

export const applyNoAnimations = (enabled: boolean) => {
    document.documentElement.toggleAttribute(ROOT_ATTRIBUTE, enabled);
};

export const setNoAnimations = (enabled: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
    applyNoAnimations(enabled);
};
