import { ipcMain, BrowserWindow } from "electron";
import { exec } from "child_process";
import os from "os";
import iconv from "iconv-lite";
const fs = require("fs");

export function initElectronAPIEvents(app: Electron.App, win: BrowserWindow) {
    console.log("[electronAPIEvents] Init core electron API events");

    // Get the versions of Electron, Chromium, Node.js, and V8
    ipcMain.handle("get-versions", (event: any) => {
        return {
            electronVersion: process.versions.electron,
            chromiumVersion: process.versions.chrome,
            nodejsVersion: process.versions.node,
            v8Version: process.versions.v8,
            osInfo: `${process.platform} ${process.arch} ${process.getSystemVersion()}`,
        };
    });

    // Close the application
    ipcMain.on("close-application", (event: any) => {
        app.quit();
    });

    // Toggle the full screen mode
    ipcMain.on("toggle-fullscreen", (event: any) => {
        const win =
            BrowserWindow.getFocusedWindow() ||
            BrowserWindow.getAllWindows()[0];
        if (win.isFullScreenable()) {
            win.setFullScreen(!win.isFullScreen());
        }
    });

    // Set the zoom factor
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

    // Get the zoom factor
    ipcMain.handle("get-zoom-factor", (event: any) => {
        const win =
            BrowserWindow.getFocusedWindow() ||
            BrowserWindow.getAllWindows()[0];
        return win.webContents.getZoomFactor();
    });

    // Get the current wallpaper
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
