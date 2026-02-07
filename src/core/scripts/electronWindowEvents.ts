import { BrowserWindow } from "electron";

/**
 * Registers core application/window lifecycle event listeners.
 *
 * Handles app shutdown behavior when all windows are closed, following
 * platform conventions (keeps the app running on macOS).
 *
 * @param app Electron application instance.
 * @param win Main application window reference.
 */
export function initElectronWindowEvents(
    app: Electron.App,
    win: BrowserWindow,
) {
    console.log("[electronWindowEvents] Init core electron window events");

    /**
     * Quits the app when all windows are closed on non-macOS platforms.
     */
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
}
