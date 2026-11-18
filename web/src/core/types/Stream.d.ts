
type StreamDeepLinks = {
    player: string | null,
    externalPlayer: ExternalPlayerLinks,
};

type StreamSubtitle = {
    id: string,
    lang: string,
    url?: string | null,
    fallbackUrl?: string | null,
    label?: string | null,
};

type StreamBehaviorHints = {
    videoHash?: string | null,
    videoSize?: number | null,
    filename?: string | null,
};

type Stream = {
    ytId?: string,
    name: string,
    description: string,
    subtitles?: StreamSubtitle[],
    behaviorHints?: StreamBehaviorHints,
    infoHash?: string,
    fileIdx?: string,
    url?: string,
    externalUrl?: string,
    deepLinks?: {
        player: string,
        externalPlayer: ExternalPlayerLinks,
    },
};
