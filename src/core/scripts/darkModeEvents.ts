import { ipcMain, systemPreferences, BrowserWindow, nativeTheme } from "electron";
import { ThemeMode } from "../../core/types/ThemeMode";
import { DarkMode, LightMode } from "./themes";
import { windowExtraProperties } from "../../electron/properties/windowExtraProperties";
import { windowProperties } from "../../electron/properties/windowProperties";

/**
 * Initializes system's dark/light switch events
 *
 * @param app Electron Application instance
 * @param win The Electron BrowserWindow instance to attach events to
 *
 * @public
 */
export function initDarkModeEvents(app: Electron.App, win: BrowserWindow) {
    console.log("[darkModeEvents] Init core dark mode events");

    /* Handles system accent color change and setting the dark/light mode of the application */
    systemPreferences.on("accent-color-changed", (event, mode) => {
        setCurrentThemeMode(mode);
    });

    /* Handles system color scheme change and setting the dark/light mode of the application */
    ipcMain.on("color-scheme-toggle", (event, mode) => {
        setCurrentThemeMode(mode);
    });

    /* Handles system color scheme change and setting the dark/light mode of the application */
    ipcMain.on("update-native-colors", (event, mode) => {
        setCurrentThemeMode(mode);
    });
}

/**
 * Applies the requested theme mode to all open windows.
 *
 * Updates window appearance (title bar overlay/background) for supported window
 * material types and optionally synchronizes Electron's nativeTheme source.
 *
 * @param mode Theme mode to apply: "dark", "light", or "system".
 */
export function setCurrentThemeMode(mode: string = "system") {
    const windows = BrowserWindow.getAllWindows();

    /**
     * Theme definitions mapped by mode.
     */
    const themes = {
        dark: DarkMode,
        light: LightMode,
        system: nativeTheme.shouldUseDarkColors ? DarkMode : LightMode,
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
