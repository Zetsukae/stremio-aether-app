const React = require('react');
const { useModelState } = require('stremio/common');
const { fetchEpisodeSubtitles, subtitleAddonRequests } = require('./subtitleAddons');

const useEpisodeSubtitles = (type, videoId, streams) => {
    const action = React.useMemo(() => type ?
        {
            action: 'Load',
            args: {
                model: 'InstalledAddonsWithFilters',
                args: {
                    request: { type }
                }
            }
        }
        :
        { action: 'Unload' }, [type]);
    const installedAddons = useModelState({ model: 'installed_addons', action });
    const addons = installedAddons?.catalog;
    const requests = React.useMemo(() => subtitleAddonRequests(addons, type, videoId, streams), [addons, type, videoId, streams]);
    const requestKey = JSON.stringify(requests.map(({ url }) => url));
    const [subtitleResult, setSubtitleResult] = React.useState({ key: null, subtitlesByKey: {} });

    React.useEffect(() => {
        if (requests.length === 0) {
            setSubtitleResult({ key: requestKey, subtitlesByKey: {} });
            return undefined;
        }

        const controller = new AbortController();
        let active = true;
        fetchEpisodeSubtitles(requests, controller.signal).then((subtitlesByKey) => {
            if (active) {
                setSubtitleResult({ key: requestKey, subtitlesByKey });
            }
        });

        return () => {
            active = false;
            controller.abort();
        };
    }, [requestKey, requests]);

    return subtitleResult.key === requestKey ? subtitleResult.subtitlesByKey : {};
};

module.exports = useEpisodeSubtitles;
