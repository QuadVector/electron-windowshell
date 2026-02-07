import { BrowserWindow, nativeTheme } from "electron";
import { DarkMode, LightMode } from "./themes";
import { windowExtraProperties } from "../../electron/windowExtraProperties";
import { windowProperties } from "../../electron/windowProperties";

/**
 * Applies the requested theme mode to all open windows.
 *
 * Updates window appearance (title bar overlay/background) for supported window
 * material types and optionally synchronizes Electron's nativeTheme source.
 *
 * @param mode Theme mode to apply: "dark", "light", or "system".
 */
export function setCurrentThemeMode(mode: string = "system") {
    console.log(`[helpers] Setting theme mode to ${mode}`);

    const windows = BrowserWindow.getAllWindows();

    /**
     * Supported explicit theme variants.
     */
    type ThemeMode = "dark" | "light";

    /**
     * Theme definitions mapped by mode.
     */
    const themes = {
        dark: DarkMode,
        light: LightMode,
    };

    /**
     * Applies a theme variant to a single window.
     *
     * Updates title bar overlay and background color when enabled by window
     * configuration, and optionally sets the global nativeTheme source.
     *
     * @param win Target BrowserWindow.
     * @param mode Theme variant to apply.
     * @param changeThemeSource Whether to update nativeTheme.themeSource.
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

    /**
     * Applies the requested mode to each open window, resolving "system" to the
     * current OS preference.
     */
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
