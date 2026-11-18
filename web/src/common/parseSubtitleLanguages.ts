import * as languages from './languages';

type Subtitle = {
    lang?: string | null,
};

const LANGUAGE_REGIONS: Record<string, string> = {
    ara: 'SA',
    ben: 'BD',
    bul: 'BG',
    cat: 'ES',
    ces: 'CZ',
    dan: 'DK',
    deu: 'DE',
    ell: 'GR',
    eng: 'GB',
    fas: 'IR',
    fin: 'FI',
    fra: 'FR',
    heb: 'IL',
    hin: 'IN',
    hrv: 'HR',
    hun: 'HU',
    ind: 'ID',
    ita: 'IT',
    jpn: 'JP',
    kor: 'KR',
    msa: 'MY',
    nld: 'NL',
    nor: 'NO',
    pol: 'PL',
    por: 'PT',
    ron: 'RO',
    rus: 'RU',
    sin: 'LK',
    slk: 'SK',
    spa: 'ES',
    srp: 'RS',
    swe: 'SE',
    tam: 'IN',
    tel: 'IN',
    tha: 'TH',
    tur: 'TR',
    ukr: 'UA',
    urd: 'PK',
    vie: 'VN',
    zho: 'CN',
    zul: 'ZA',
    mya: 'MM',
};

const flagEmoji = (region: string): string => {
    return String.fromCodePoint(...Array.from(region, (letter) => 0x1F1E6 + letter.charCodeAt(0) - 65));
};

type SubtitleLanguage = {
    code: string,
    label: string,
    flag: string,
};

const parseSubtitleLanguages = (subtitles?: Subtitle[] | null, primaryLanguage?: string | null): SubtitleLanguage[] => {
    if (!Array.isArray(subtitles)) {
        return [];
    }

    const seen = new Set<string>();
    const labels = subtitles.reduce<SubtitleLanguage[]>((parsed, subtitle) => {
        if (typeof subtitle?.lang !== 'string' || subtitle.lang.trim().length === 0) {
            return parsed;
        }

        const rawCode = subtitle.lang.trim();
        const languageCode = rawCode.split(/[-_]/, 1)[0];
        const code = languages.toCode(languageCode).toLowerCase();
        if (!seen.has(code)) {
            seen.add(code);
            const region = rawCode.match(/[-_]([a-z]{2})(?:$|[-_])/i)?.[1]?.toUpperCase()
                || LANGUAGE_REGIONS[code];
            parsed.push({
                code,
                label: languages.label(rawCode),
                flag: region ? flagEmoji(region) : '🌐',
            });
        }
        return parsed;
    }, []);

    if (typeof primaryLanguage !== 'string' || primaryLanguage.trim().length === 0) {
        return labels;
    }

    const primaryCode = languages.toCode(primaryLanguage.trim().split(/[-_]/, 1)[0]).toLowerCase();
    const primaryIndex = labels.findIndex(({ code }) => code === primaryCode);
    if (primaryIndex > 0) {
        labels.unshift(labels.splice(primaryIndex, 1)[0]);
    }

    return labels;
};

export default parseSubtitleLanguages;
