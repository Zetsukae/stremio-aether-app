// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { Button, Image } = require('stremio/components');
const NavMenu = require('stremio/components/NavBar/HorizontalNavBar/NavMenu');
const SearchBar = require('stremio/components/NavBar/HorizontalNavBar/SearchBar');
const styles = require('./MainNavBars.less');

const MobileTopNavBar = React.memo(({ route, query, navbarHidden }) => {
    const renderLogoMenuLabel = React.useCallback(({ ref, className, onClick, children }) => (
        <Button ref={ref} className={classnames(className, styles['mobile-top-logo-button'])} tabIndex={-1} onClick={onClick}>
            <Image className={styles['mobile-top-logo']} src={require('/assets/images/stremio_symbol.png')} alt={' '} />
            {children}
        </Button>
    ), []);
    return (
        <div className={classnames(styles['mobile-top-nav-bar'], { [styles['hidden']]: navbarHidden })}>
            <div className={classnames(styles['mobile-top-pill'], styles['mobile-top-logo-pill'])}>
                <NavMenu renderLabel={renderLogoMenuLabel} />
            </div>
            <div className={classnames(styles['mobile-top-pill'], styles['mobile-top-search-pill'])}>
                <SearchBar className={styles['mobile-top-search']} query={query} active={true} autoFocus={route === 'search'} />
            </div>
        </div>
    );
});

MobileTopNavBar.displayName = 'MobileTopNavBar';

MobileTopNavBar.propTypes = {
    route: PropTypes.string,
    query: PropTypes.string,
    navbarHidden: PropTypes.bool,
};

module.exports = MobileTopNavBar;
