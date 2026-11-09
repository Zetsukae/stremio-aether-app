import { useEffect, useState } from 'react';
import { usePlatform } from 'stremio/common/Platform';

const COMPACT_QUERY = '(max-width: 640px)';

const useCompactLayout = (): boolean => {
    const platform = usePlatform();
    const [narrow, setNarrow] = useState(() => window.matchMedia(COMPACT_QUERY).matches);
    useEffect(() => {
        const mediaQuery = window.matchMedia(COMPACT_QUERY);
        const handleChange = (event: MediaQueryListEvent) => setNarrow(event.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    return platform.isMobile || narrow;
};

export default useCompactLayout;
