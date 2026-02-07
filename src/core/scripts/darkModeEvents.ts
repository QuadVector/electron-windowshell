import { ipcMain, systemPreferences, BrowserWindow } from "electron";
import { setCurrentThemeMode } from "./helpers";

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
