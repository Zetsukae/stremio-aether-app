// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useNavigate } = require('react-router');
const { Link } = require('react-router-dom');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('stremio/components/Icon');
const { Button, Image } = require('stremio/components');
const { useFullscreen } = require('stremio/common/Fullscreen');
const { default: usePWA } = require('stremio/common/usePWA');
const { useHorizontalNavGamepadNavigation } = require('stremio/services/GamepadNavigation');
const { isNoAnimationsEnabled } = require('stremio/common/reduceMotion');
const SearchBar = require('./SearchBar');
const NavMenu = require('./NavMenu');
const styles = require('./styles');
const { t } = require('i18next');

const SEARCH_CLOSE_DURATION = 200;

const HorizontalNavBar = React.memo(({ className, route, query, title, backButton, searchBar, fullscreenButton, navMenu, originPath, hdrInfo, tabs, selected, navbarHidden, navbarScrolled, ...props }) => {
    const navigate = useNavigate();
    const backButtonOnClick = React.useCallback(() => {
        if (originPath) {
            navigate(originPath, { replace: true });
        } else {
            navigate(-1);
        }
    }, [originPath, navigate]);
    const [fullscreen, requestFullscreen, exitFullscreen, , supported] = useFullscreen();
    const [isIOSPWA] = usePWA();
    const [searchState, setSearchState] = React.useState('closed');
    const searchOpen = searchState === 'open';
    const searchClosing = searchState === 'closing';
    const openSearch = React.useCallback(() => setSearchState('open'), []);
    const closeSearch = React.useCallback(() => {
        setSearchState((state) => {
            if (state !== 'open') return state;
            return isNoAnimationsEnabled() ? 'closed' : 'closing';
        });
    }, []);
    const pillRef = React.useRef(null);
    const renderNavMenuLabel = React.useCallback(({ ref, className, onClick, children, }) => (
        <Button ref={ref} className={classnames(className, styles['button-container'], styles['menu-button-container'])} tabIndex={-1} onClick={onClick}>
            <Icon className={styles['icon']} name={'person-outline'} />
            {children}
        </Button>
    ), []);
    const renderLogoMenuLabel = React.useCallback(({ ref, className, onClick, children, }) => (
        <Button ref={ref} className={classnames(className, styles['button-container'], styles['menu-button-container'])} tabIndex={-1} onClick={onClick}>
            <Image className={styles['nav-logo']} src={require('/assets/images/stremio_symbol.png')} alt={' '} />
            {children}
        </Button>
    ), []);
    const showSearchIcon = searchBar;
    const showFullscreen = supported && !isIOSPWA && fullscreenButton;
    const hasTabs = Array.isArray(tabs) && tabs.length > 0;
    useHorizontalNavGamepadNavigation(route || className, backButton);

    React.useEffect(() => {
        if (route === 'search' && searchBar) {
            openSearch();
        } else {
            closeSearch();
        }
    }, [route, searchBar, openSearch, closeSearch]);

    React.useEffect(() => {
        if (!searchClosing) return;
        const timeout = setTimeout(() => setSearchState('closed'), SEARCH_CLOSE_DURATION);
        return () => clearTimeout(timeout);
    }, [searchClosing]);

    React.useEffect(() => {
        if (!searchOpen) return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') closeSearch();
        };
        const onMouseDown = (event) => {
            if (route !== 'search' && pillRef.current && !pillRef.current.contains(event.target)) closeSearch();
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('mousedown', onMouseDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('mousedown', onMouseDown);
        };
    }, [searchOpen, closeSearch, route]);

    return (
        <nav {...props} className={classnames(className, styles['horizontal-nav-bar-container'], {
            [styles['navbar-hidden']]: navbarHidden,
            [styles['navbar-scrolled']]: navbarScrolled,
            [styles['nav-pill-container']]: hasTabs,
        })}>
            {hasTabs && navMenu && <NavMenu renderLabel={renderLogoMenuLabel} />}
            {hasTabs &&
                <div ref={pillRef} className={styles['nav-pill']}>
                    {searchOpen || searchClosing ?
                        <SearchBar className={classnames(styles['nav-search'], { [styles['nav-search-exit']]: !searchOpen })} query={query} active={true} />
                        :
                        <React.Fragment>
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    className={classnames(styles['button-container'], styles['nav-tab'], { active: tab.id === selected })}
                                    to={tab.href}
                                    title={t(tab.label)}
                                    tabIndex={-1}
                                >
                                    <Icon className={styles['icon']} name={tab.id === selected ? tab.icon : `${tab.icon}-outline`} />
                                </Link>
                            ))}
                            {showSearchIcon &&
                                <Button className={classnames(styles['button-container'], styles['nav-tab'])} title={t('SEARCH')} tabIndex={-1} onClick={openSearch}>
                                    <Icon className={styles['icon']} name={'search'} />
                                </Button>
                            }
                        </React.Fragment>
                    }
                </div>
            }
            {backButton &&
                <Button className={classnames(styles['button-container'], styles['back-button-container'])} tabIndex={-1} onClick={backButtonOnClick}>
                    <Icon className={styles['icon']} name={'chevron-back'} />
                </Button>
            }
            {title &&
                <h2 className={styles['title']}>{title}</h2>
            }
            {!hasTabs &&
                <div className={styles['buttons-container']}>
                    {hdrInfo && (hdrInfo.gamma === 'pq' || hdrInfo.gamma === 'hlg') &&
                        <div className={styles['hdr-indicator']} title={hdrInfo.gamma === 'pq' ? 'HDR10' : 'HLG'}>
                            <Icon className={styles['icon']} name={'hdr'} />
                        </div>
                    }
                    {showSearchIcon && <SearchBar query={query} active={false} />}
                    {showFullscreen &&
                        <Button className={styles['button-container']} title={fullscreen ? t('EXIT_FULLSCREEN') : t('ENTER_FULLSCREEN')} tabIndex={-1} onClick={fullscreen ? exitFullscreen : requestFullscreen}>
                            <Icon className={styles['icon']} name={fullscreen ? 'minimize' : 'maximize'} />
                        </Button>
                    }
                    {navMenu && <NavMenu renderLabel={renderNavMenuLabel} />}
                </div>
            }
        </nav>
    );
});

HorizontalNavBar.displayName = 'HorizontalNavBar';

HorizontalNavBar.propTypes = {
    className: PropTypes.string,
    route: PropTypes.string,
    query: PropTypes.string,
    title: PropTypes.string,
    backButton: PropTypes.bool,
    searchBar: PropTypes.bool,
    fullscreenButton: PropTypes.bool,
    navMenu: PropTypes.bool,
    originPath: PropTypes.string,
    hdrInfo: PropTypes.shape({
        gamma: PropTypes.string,
    }),
    tabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        href: PropTypes.string,
    })),
    selected: PropTypes.string,
    navbarHidden: PropTypes.bool,
    navbarScrolled: PropTypes.bool,
};

module.exports = HorizontalNavBar;
