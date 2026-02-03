import { BrowserWindow, nativeTheme } from "electron";
import { DarkMode, LightMode } from "./themes";
import { windowExtraProperties } from "../../electron/windowExtraProperties";
import { windowProperties } from "../../electron/windowProperties";

export function setCurrentThemeMode(mode: string = "system") {
    const windows = BrowserWindow.getAllWindows();

    // Define the available themes
    type ThemeMode = "dark" | "light";
    const themes = {
        dark: DarkMode,
        light: LightMode,
    };

    /**
     * Sets the theme mode for the given window.
     *
     * @param {BrowserWindow} win - The window for which to set the theme mode.
     * @param {ThemeMode} mode - The theme mode to set. One of "dark" or "light".
     * @param {boolean} [changeThemeSource=true] - Whether to change the theme source of the native theme.
     * @returns {void}
     */
    function setThemeMode(
        win: BrowserWindow,
        mode: ThemeMode,
        changeThemeSource: boolean = mode === "dark",
    ) {
        const theme = themes[mode];

        if (windowExtraProperties.windowMaterialType === "fluent") {
            if (windowProperties.titleBarOverlay) {
                win.setTitleBarOverlay({
                    color: "#ffffff00",
                    symbolColor: theme.colors.text,
                    height: 32,
                });
            }

            if (windowProperties.backgroundColor !== undefined) {
                win.setBackgroundColor(theme.colors.background);
            }
        }

        if (changeThemeSource) {
            nativeTheme.themeSource = mode;
        }
    }

    // Set the theme mode for each window
    windows.forEach((win) => {
        switch (mode) {
            case "dark":
                setThemeMode(win, "dark", true);
                break;
            case "light":
                setThemeMode(win, "light", true);
                break;

            case "system":
                nativeTheme.themeSource = "system";
                if (nativeTheme.shouldUseDarkColors) {
                    setThemeMode(win, "dark", false);
                } else {
                    setThemeMode(win, "light", false);
                }
                break;
        }
    });
}
