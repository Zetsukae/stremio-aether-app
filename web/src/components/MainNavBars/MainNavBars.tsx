// Copyright (C) 2017-2023 Smart code 203358507

import React, { memo, useRef } from 'react';
import classnames from 'classnames';
import { HorizontalNavBar } from 'stremio/components/NavBar';
import useNavbarScroll from 'stremio/common/useNavbarScroll';
import useCompactLayout from 'stremio/common/useCompactLayout';
import { useContentGamepadNavigation, useVerticalNavGamepadNavigation } from 'stremio/services/GamepadNavigation';
import { isTauri } from 'stremio/lib/tauri-events';
import MobileTopNavBar from './MobileTopNavBar';
import styles from './MainNavBars.less';

const TABS = [
    { id: 'board', label: 'WEBSITE_PAGE_HOME', icon: 'home', href: '/' },
    { id: 'discover', label: 'Discover', icon: 'discover', href: '/discover' },
    { id: 'library', label: 'Library', icon: 'library', href: '/library' },
    { id: 'downloads', label: 'DOWNLOADS', icon: 'download', href: '/downloads', desktopOnly: true },
    { id: 'calendar', label: 'Calendar', icon: 'calendar', href: '/calendar' },
    { id: 'addons', label: 'WEBSITE_PAGE_ADDONS', icon: 'addons', href: '/addons' },
    { id: 'settings', label: 'SETTINGS', icon: 'settings', href: '/settings', mobileOnly: true },
];

type Props = {
    className: string,
    route?: string,
    query?: string,
    overlay?: boolean,
    children?: React.ReactNode,
};

const MainNavBars = memo(({ className, route, query, overlay, children }: Props) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const autoHide = route === 'board' || route === 'metadetails';
    const { visible, scrolled } = useNavbarScroll(contentRef, autoHide);
    const compact = useCompactLayout();
    const tabs = TABS.filter((tab) => (!tab.desktopOnly || (isTauri() && !compact)) && (!tab.mobileOnly || compact));

    const navRoute = route === 'continue_watching' ? 'library' : (route ?? '');
    useContentGamepadNavigation(contentRef, navRoute);
    useVerticalNavGamepadNavigation(navRoute);

    return (
        <div className={classnames(className, styles['main-nav-bars-container'], { [styles['overlay']]: overlay })}>
            <HorizontalNavBar
                className={styles['horizontal-nav-bar']}
                route={route}
                query={query}
                backButton={false}
                searchBar={!compact}
                navMenu={!compact}
                tabs={tabs}
                selected={route}
                navbarHidden={autoHide && !visible}
                navbarScrolled={scrolled || route === 'search'}
            />
            {compact &&
                <MobileTopNavBar route={route} query={query} navbarHidden={autoHide && !visible} />
            }
            <div ref={contentRef} className={styles['nav-content-container']}>{children}</div>
        </div>
    );
});

export default MainNavBars;
