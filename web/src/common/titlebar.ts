import { useSyncExternalStore } from 'react';
import { invokeTauri, isTauri } from './tauri';

export type CloseButtonPosition = 'left' | 'center' | 'right';

export type TitlebarSettings = {
    enabled: boolean,
    closeButton: CloseButtonPosition,
};

let settings: TitlebarSettings | null = null;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = () => settings;

export const useTitlebarSettings = () => useSyncExternalStore(subscribe, getSnapshot);

export const loadTitlebarSettings = async () => {
    if (!isTauri()) return;

    settings = await invokeTauri<TitlebarSettings>('get_titlebar_settings');
    notify();
};

export const setTitlebarEnabled = async (enabled: boolean) => {
    await invokeTauri('set_titlebar_enabled', { enabled });
    await loadTitlebarSettings();
};

export const setTitlebarCloseButton = async (position: CloseButtonPosition) => {
    await invokeTauri('set_titlebar_close_button', { position });
    await loadTitlebarSettings();
};
