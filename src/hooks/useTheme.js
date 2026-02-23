import { useEffect, useMemo, useState } from 'react';

export default function useTheme(initialMode = 'system') {
  const supportsMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';

  const [themeMode, setThemeMode] = useState(initialMode);
  const [systemTheme, setSystemTheme] = useState(
    supportsMatchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    if (!supportsMatchMedia) {
      return undefined;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event) => setSystemTheme(event.matches ? 'dark' : 'light');

    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [supportsMatchMedia]);

  const effectiveTheme = useMemo(
    () => (themeMode === 'system' ? systemTheme : themeMode),
    [themeMode, systemTheme]
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  return { themeMode, setThemeMode, effectiveTheme };
}

