
export interface Theme {
    background: string,
    text: string,
    uiPrimary: string,
    uiSecondary: string,
    link: string,
    linkVisited: string,
}

const themeKey = " theme";

/**
 * Loads the current theme from local storage, if stored. Requires the story title for a unique key.
 */
export function loadTheme(title: string): Theme | null {
    let t = window.localStorage.getItem(title + themeKey);
    if (t !== null) {
        return JSON.parse(t);
    }
    return null;
}

/**
 * Applies the theme to the document.
 */
export function applyTheme(theme: Theme) {
    document.documentElement.style.cssText = `--background-color: ${theme.background}; --text-color: ${theme.text}; --ui-primary-color: ${theme.uiPrimary}; --ui-secondary-color: ${theme.uiSecondary}; --link-color: ${theme.link}; --link-visited-color: ${theme.linkVisited};`;
}

/**
 * Saves the current theme to local storage. Requires the story title for a unique key.
 */
export function saveTheme(title: string, theme: Theme) {
    window.localStorage.setItem(title + themeKey, JSON.stringify(theme));
}

