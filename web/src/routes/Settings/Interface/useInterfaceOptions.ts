import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCore } from 'stremio/core';
import { interfaceLanguages, useLanguageSorting } from 'stremio/common';
import { CloseButtonPosition, setTitlebarCloseButton, setTitlebarEnabled, useTitlebarSettings } from 'stremio/common/titlebar';

const useInterfaceOptions = (profile: Profile) => {
    const core = useCore();
    const { t } = useTranslation();
    const titlebar = useTitlebarSettings();
    const aetherTitlebar = titlebar?.enabled;

    const interfaceLanguageOptions = useMemo(() =>
        interfaceLanguages.map(({ name, codes }) => ({
            value: codes[0],
            label: name,
        })),
    []);

    const { sortedOptions } = useLanguageSorting(interfaceLanguageOptions);

    const interfaceLanguageSelect = useMemo(() => ({
        options: sortedOptions,
        value:
            interfaceLanguages.find(({ codes }) => codes[1] === profile.settings.interfaceLanguage)?.codes?.[0] ||
            profile.settings.interfaceLanguage,
        onSelect: (value: string) => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        interfaceLanguage: value
                    }
                }
            });
        }
    }), [profile.settings, sortedOptions]);

    const escExitFullscreenToggle = useMemo(() => ({
        checked: profile.settings.escExitFullscreen,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        escExitFullscreen: !profile.settings.escExitFullscreen
                    }
                }
            });
        }
    }), [profile.settings]);

    const quitOnCloseToggle = useMemo(() => ({
        checked: profile.settings.quitOnClose,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        quitOnClose: !profile.settings.quitOnClose
                    }
                }
            });
        }
    }), [profile.settings]);

    const hideSpoilersToggle = useMemo(() => ({
        checked: profile.settings.hideSpoilers,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        hideSpoilers: !profile.settings.hideSpoilers
                    }
                }
            });
        }
    }), [profile.settings]);

    const gamepadSupportToggle = useMemo(() => ({
        checked: profile.settings.gamepadSupport,
        onClick: () => {
            core.transport.dispatch({
                action: 'Ctx',
                args: {
                    action: 'UpdateSettings',
                    args: {
                        ...profile.settings,
                        gamepadSupport: !profile.settings.gamepadSupport
                    }
                }
            });
        }
    }), [profile.settings]);

    const aetherTitlebarToggle = useMemo(() => ({
        checked: aetherTitlebar === true,
        onClick: () => {
            setTitlebarEnabled(aetherTitlebar !== true).catch(console.error);
        }
    }), [aetherTitlebar]);

    const closeButtonSelect = useMemo(() => {
        const positions: CloseButtonPosition[] = ['left', 'center', 'right'];
        return {
            options: positions.map((position) => ({
                value: position,
                label: t(`HORIZON_CLOSE_BUTTON_${position.toUpperCase()}`),
            })),
            value: titlebar?.closeButton ?? 'right',
            onSelect: (value: CloseButtonPosition) => {
                setTitlebarCloseButton(value).catch(console.error);
            },
        };
    }, [titlebar?.closeButton, t]);

    return {
        interfaceLanguageSelect,
        escExitFullscreenToggle,
        quitOnCloseToggle,
        hideSpoilersToggle,
        gamepadSupportToggle,
        aetherTitlebarToggle,
        closeButtonSelect,
    };
};

export default useInterfaceOptions;
