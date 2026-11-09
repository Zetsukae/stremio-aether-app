import React, { forwardRef } from 'react';
import { usePlatform } from 'stremio/common';
import { isTauri } from 'stremio/common/tauri';
import { MultiselectMenu, Toggle } from 'stremio/components';
import { Section, Option } from '../components';
import useInterfaceOptions from './useInterfaceOptions';

type Props = {
    profile: Profile,
};

const Interface = forwardRef<HTMLDivElement, Props>(({ profile }: Props, ref) => {
    const { shell } = usePlatform();

    const {
        interfaceLanguageSelect,
        quitOnCloseToggle,
        escExitFullscreenToggle,
        hideSpoilersToggle,
        gamepadSupportToggle,
        aetherTitlebarToggle,
        closeButtonSelect,
    } = useInterfaceOptions(profile);

    return (
        <Section ref={ref} label={'INTERFACE'}>
            <Option label={'SETTINGS_UI_LANGUAGE'}>
                <MultiselectMenu
                    className={'multiselect'}
                    {...interfaceLanguageSelect}
                />
            </Option>
            {
                shell.active &&
                    <Option label={'SETTINGS_QUIT_ON_CLOSE'}>
                        <Toggle
                            tabIndex={-1}
                            {...quitOnCloseToggle}
                        />
                    </Option>
            }
            {
                shell.active &&
                    <Option label={'SETTINGS_FULLSCREEN_EXIT'}>
                        <Toggle
                            tabIndex={-1}
                            {...escExitFullscreenToggle}
                        />
                    </Option>
            }
            {
                isTauri() &&
                    <Option label={'HORIZON_AETHER_TITLEBAR'}>
                        <Toggle
                            tabIndex={-1}
                            {...aetherTitlebarToggle}
                        />
                    </Option>
            }
            {
                isTauri() && aetherTitlebarToggle.checked &&
                    <Option label={'HORIZON_CLOSE_BUTTON'}>
                        <MultiselectMenu
                            className={'multiselect'}
                            {...closeButtonSelect}
                        />
                    </Option>
            }
            <Option label={'SETTINGS_BLUR_UNWATCHED_IMAGE'}>
                <Toggle
                    tabIndex={-1}
                    {...hideSpoilersToggle}
                />
            </Option>
            <Option label={'SETTINGS_GAMEPAD'}>
                <Toggle
                    tabIndex={-1}
                    {...gamepadSupportToggle}
                />
            </Option>
        </Section>
    );
});

export default Interface;
