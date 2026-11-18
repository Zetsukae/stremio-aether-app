const parseSubtitleLanguages = require('../src/common/parseSubtitleLanguages').default;

describe('parseSubtitleLanguages', () => {
    test('returns unique language flags and accessible names for available subtitles', () => {
        expect(parseSubtitleLanguages([
            { lang: 'fra' },
            { lang: 'eng' },
            { lang: 'en' },
            { lang: 'jpn' },
        ])).toEqual([
            { code: 'fra', label: 'Français', flag: '🇫🇷' },
            { code: 'eng', label: 'English', flag: '🇬🇧' },
            { code: 'jpn', label: '日本語', flag: '🇯🇵' },
        ]);
    });

    test('puts the selected primary language first when it is available', () => {
        expect(parseSubtitleLanguages([
            { lang: 'fra' },
            { lang: 'eng' },
            { lang: 'jpn' },
        ], 'jpn').map(({ code }) => code)).toEqual(['jpn', 'fra', 'eng']);
    });

    test('uses the region from locale-specific language codes', () => {
        expect(parseSubtitleLanguages([
            { lang: 'zh-TW' },
        ])).toEqual([
            { code: 'zho', label: 'zh-TW', flag: '🇹🇼' },
        ]);
    });

    test('ignores missing and blank language values', () => {
        expect(parseSubtitleLanguages([
            { lang: '' },
            { lang: '  ' },
            {},
            null,
        ])).toEqual([]);
    });

    test('returns an empty list when no subtitles are available', () => {
        expect(parseSubtitleLanguages()).toEqual([]);
        expect(parseSubtitleLanguages(null)).toEqual([]);
    });
});
