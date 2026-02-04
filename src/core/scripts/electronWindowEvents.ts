import { BrowserWindow } from "electron";

export function initElectronWindowEvents(
    app: Electron.App,
    win: BrowserWindow,
) {
    console.log("[electronWindowEvents] Init core electron window events");

    // Close appliaction when all windows are closed
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
}
