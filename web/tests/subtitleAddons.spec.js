const { subtitleAddonRequests, subtitlesForStream } = require('../src/routes/MetaDetails/StreamsList/subtitleAddons');

describe('subtitleAddonRequests', () => {
    const addons = [
        {
            manifest: {
                name: 'Subtitle addon',
                resources: [{
                    name: 'subtitles',
                    types: ['series'],
                    idPrefixes: ['tt'],
                }],
            },
            transportUrl: 'https://subtitles.example/manifest.json',
        },
        {
            manifest: {
                name: 'Stream addon',
                resources: ['stream'],
            },
            transportUrl: 'https://streams.example/',
        },
    ];

    test('builds an episode lookup and file-specific requests from stream hints', () => {
        expect(subtitleAddonRequests(addons, 'series', 'tt123:1:2', [{
            behaviorHints: {
                videoHash: 'abc123',
                videoSize: 1024,
                filename: 'episode.mkv',
            },
        }])).toEqual([
            {
                key: 'episode',
                name: 'Subtitle addon',
                url: 'https://subtitles.example/subtitles/series/tt123:1:2.json',
            },
            {
                key: JSON.stringify(['abc123', 1024, 'episode.mkv']),
                name: 'Subtitle addon',
                url: 'https://subtitles.example/subtitles/series/tt123:1:2.json?videoHash=abc123&videoSize=1024&filename=episode.mkv',
            },
        ]);
    });

    test('filters subtitle resources by supported type and ID prefix', () => {
        expect(subtitleAddonRequests(addons, 'movie', 'tt123')).toEqual([]);
        expect(subtitleAddonRequests(addons, 'series', 'kitsu123:1:2')).toEqual([]);
    });

    test('ignores malformed inputs', () => {
        expect(subtitleAddonRequests(null, 'series', 'tt123')).toEqual([]);
        expect(subtitleAddonRequests(addons, null, 'tt123')).toEqual([]);
    });

    test('combines episode and file-specific subtitles for streams with hints', () => {
        const stream = {
            behaviorHints: {
                videoHash: 'abc123',
                videoSize: 1024,
                filename: 'episode.mkv',
            },
        };
        const fileKey = JSON.stringify(['abc123', 1024, 'episode.mkv']);
        const episodeSubtitle = { lang: 'eng', id: 'episode-en' };
        const fileSubtitle = { lang: 'fra', id: 'file-fr' };

        expect(subtitlesForStream(stream, {
            episode: [episodeSubtitle],
            [fileKey]: [fileSubtitle],
        })).toEqual([episodeSubtitle, fileSubtitle]);
    });

    test('does not duplicate episode subtitles for streams without hints', () => {
        const episodeSubtitle = { lang: 'eng', id: 'episode-en' };

        expect(subtitlesForStream({}, {
            episode: [episodeSubtitle],
        })).toEqual([episodeSubtitle]);
    });
});
