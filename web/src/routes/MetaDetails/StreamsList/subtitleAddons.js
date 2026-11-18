const supportsSubtitles = (addon, type, id) => {
    const resources = addon?.manifest?.resources;
    if (!Array.isArray(resources)) {
        return false;
    }

    return resources.some((resource) => {
        const name = typeof resource === 'string' ? resource : resource?.name;
        if (name !== 'subtitles') {
            return false;
        }

        if (typeof resource === 'string') {
            return true;
        }

        if (Array.isArray(resource.types) && !resource.types.includes(type)) {
            return false;
        }

        return !Array.isArray(resource.idPrefixes) ||
            resource.idPrefixes.some((prefix) => id.startsWith(prefix));
    });
};

const subtitleLookupKey = (stream) => {
    const hints = stream?.behaviorHints;
    if (!hints || !(hints.videoHash || hints.videoSize || hints.filename)) {
        return 'episode';
    }

    return JSON.stringify([
        hints.videoHash || null,
        hints.videoSize || null,
        hints.filename || null,
    ]);
};

const subtitlesForStream = (stream, subtitlesByKey) => {
    const key = subtitleLookupKey(stream);
    const episodeSubtitles = subtitlesByKey?.episode || [];
    return key === 'episode' ?
        episodeSubtitles
        :
        episodeSubtitles.concat(subtitlesByKey?.[key] || []);
};

const subtitleAddonRequests = (addons, type, id, streams = []) => {
    if (!Array.isArray(addons) || typeof type !== 'string' || typeof id !== 'string') {
        return [];
    }

    const lookups = new Map([['episode', {}]]);
    if (Array.isArray(streams)) {
        streams.forEach((stream) => {
            const hints = stream?.behaviorHints;
            const key = subtitleLookupKey(stream);
            if (key !== 'episode') {
                lookups.set(key, {
                    videoHash: hints.videoHash,
                    videoSize: hints.videoSize,
                    filename: hints.filename,
                });
            }
        });
    }

    return addons
        .filter((addon) => supportsSubtitles(addon, type, id))
        .flatMap((addon) => Array.from(lookups, ([key, hints]) => {
            const url = new URL(
                `subtitles/${encodeURIComponent(type)}/${encodeURIComponent(id).replace(/%3A/gi, ':')}.json`,
                `${addon.transportUrl.replace(/\/?manifest\.json$/, '').replace(/\/?$/, '/')}`
            );
            Object.entries(hints).forEach(([name, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.set(name, String(value));
                }
            });
            return { key, name: addon.manifest.name, url: url.toString() };
        }));
};

const fetchEpisodeSubtitles = async (requests, signal) => {
    const results = await Promise.all(requests.map(async ({ key, name, url }) => {
        const requestController = new AbortController();
        const abortRequest = () => requestController.abort();
        let timedOut = false;
        signal.addEventListener('abort', abortRequest, { once: true });
        const timeout = setTimeout(() => {
            timedOut = true;
            abortRequest();
        }, 10000);
        try {
            const response = await fetch(url, { signal: requestController.signal });
            if (!response.ok) {
                throw new Error(`subtitle request returned HTTP ${response.status}`);
            }

            const data = await response.json();
            return { key, subtitles: Array.isArray(data.subtitles) ? data.subtitles : [] };
        } catch (error) {
            if (timedOut) {
                console.warn(`Subtitle request timed out for ${name}.`);
            } else if (error?.name !== 'AbortError') {
                console.warn(`Failed to load subtitles from ${name}:`, error);
            }
            return { key, subtitles: [] };
        } finally {
            clearTimeout(timeout);
            signal.removeEventListener('abort', abortRequest);
        }
    }));

    return results.reduce((subtitlesByKey, result) => {
        subtitlesByKey[result.key] = (subtitlesByKey[result.key] || []).concat(result.subtitles);
        return subtitlesByKey;
    }, {});
};

module.exports = {
    fetchEpisodeSubtitles,
    subtitleLookupKey,
    subtitleAddonRequests,
    subtitlesForStream,
};
