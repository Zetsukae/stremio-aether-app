import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFullscreen } from 'stremio/common';
import { invokeTauri } from 'stremio/common/tauri';
import { loadTitlebarSettings, useTitlebarSettings } from 'stremio/common/titlebar';
import Icon from 'stremio/components/Icon';
import styles from './styles.less';

const TitleBar = () => {
    const { t } = useTranslation();
    const [fullscreen] = useFullscreen();
    const titlebar = useTitlebarSettings();
    const visible = titlebar?.enabled === true && !fullscreen;

    useEffect(() => {
        loadTitlebarSettings().catch(console.error);
    }, []);

    useEffect(() => {
        if (visible) {
            document.documentElement.dataset.aetherTitlebar = 'true';
        } else {
            delete document.documentElement.dataset.aetherTitlebar;
        }
    }, [visible]);

    if (!titlebar || !visible) {
        return null;
    }

    const onClose = () => {
        invokeTauri('plugin:window|close', { label: 'main' }).catch(console.error);
    };

    return (
        <div className={[styles['titlebar'], styles[titlebar.closeButton]].join(' ')} data-tauri-drag-region>
            <button className={styles['close-button']} type={'button'} title={t('BUTTON_CLOSE')} onClick={onClose}>
                <Icon className={styles['icon']} name={'close'} />
            </button>
        </div>
    );
};

export default TitleBar;
