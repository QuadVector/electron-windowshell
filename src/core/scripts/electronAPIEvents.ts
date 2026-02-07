import { ipcMain, BrowserWindow } from "electron";
import { exec } from "child_process";
import os from "os";
import iconv from "iconv-lite";
const fs = require("fs");

/**
 * Registers core IPC handlers/events exposed by the main process.
 *
 * Sets up commands for retrieving runtime versions, controlling app/window state,
 * managing zoom level, and reading OS-specific values (e.g., wallpaper on Windows).
 *
 * @param app Electron application instance.
 * @param win Main application window reference.
 */
export function initElectronAPIEvents(app: Electron.App, win: BrowserWindow) {
    console.log("[electronAPIEvents] Init core electron API events");

    /**
     * Returns runtime versions (Electron, Chromium, Node.js, V8) and basic OS info.
     */
    ipcMain.handle("get-versions", (event: any) => {
        return {
            electronVersion: process.versions.electron,
            chromiumVersion: process.versions.chrome,
            nodejsVersion: process.versions.node,
            v8Version: process.versions.v8,
            osInfo: `${process.platform} ${process.arch} ${process.getSystemVersion()}`,
        };
    });

    /**
     * Quits the application.
     */
    ipcMain.on("close-application", (event: any) => {
        app.quit();
    });

    /**
     * Toggles fullscreen mode for the focused window (or the first available one).
     */
    ipcMain.on("toggle-fullscreen", (event: any) => {
        const win =
            BrowserWindow.getFocusedWindow() ||
            BrowserWindow.getAllWindows()[0];
        if (win.isFullScreenable()) {
            win.setFullScreen(!win.isFullScreen());
        }
    });

    /**
     * Sets the zoom factor for the focused window (or the first available one),
     * clamped to a safe range.
     *
     * @param zoomFactor Target zoom factor.
     */
    ipcMain.on("set-zoom-factor", (event: any, zoomFactor: number) => {
        const minZoomFactor = 0.5;
        const maxZoomFactor = 1.5;

        const win =
            BrowserWindow.getFocusedWindow() ||
            BrowserWindow.getAllWindows()[0];

        const currentZoomFactor = win.webContents.getZoomFactor();
        if (zoomFactor < minZoomFactor) zoomFactor = minZoomFactor;
        if (zoomFactor > maxZoomFactor) zoomFactor = maxZoomFactor;
        if (currentZoomFactor === zoomFactor) return;

        win.webContents.setZoomFactor(zoomFactor);
    });

    /**
     * Returns the current zoom factor for the focused window (or the first available one).
     */
    ipcMain.handle("get-zoom-factor", (event: any) => {
        const win =
            BrowserWindow.getFocusedWindow() ||
            BrowserWindow.getAllWindows()[0];
        return win.webContents.getZoomFactor();
    });

    /**
     * Returns the current desktop wallpaper path (Windows only).
     *
     * Resolves with an empty string when unavailable or on unsupported platforms.
     */
    ipcMain.handle("get-current-wallpaper", (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (os.platform() === "win32") {
                const command =
                    "powershell -Command \"Get-ItemPropertyValue -Path 'HKCU:\\Control Panel\\Desktop' -Name Wallpaper\"";
                exec(command, { encoding: "buffer" }, (err, stdout, stderr) => {
                    if (err) {
                        resolve("");
                    }

                    const decodedStdout = iconv
                        .decode(stdout, "cp866")
                        .replace(/\\/g, "/");
                    resolve(decodedStdout.trim());
                });
            } else {
                resolve("");
            }
        });
    });
}
