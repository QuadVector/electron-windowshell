import { BrowserWindow, ipcMain } from "electron";
const remoteMain = require("@electron/remote/main");

export function initElectronWindowEvents(
    app: Electron.App,
    win: BrowserWindow,
) {
    console.log("[electronWindowEvents] Init electron window events");

    // Close appliaction when all windows are closed
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
}
