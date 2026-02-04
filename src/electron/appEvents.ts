import {
    ipcMain,
    dialog,
    BrowserWindow,
    SaveDialogReturnValue,
    OpenDialogReturnValue,
} from "electron";
import { nativeTheme } from "electron";
import fs from "fs";
import { join, dirname } from "path";
import { initElectronWindowEvents } from "../core/scripts/electronWindowEvents";
import { initBrowserWindowEvents } from "../core/scripts/browserWindowEvents";
import { initElectronAPIEvents } from "../core/scripts/electronAPIEvents";
import { initDarkModeEvents } from "../core/scripts/darkModeEvents";
import { DarkMode, LightMode } from "../core/scripts/themes";

export function initAppEvents(app: Electron.App, win: BrowserWindow) {
    /*
		Example methods. You can delete or keep one of these if you don't need them
	*/
    // Show save file dialog
    ipcMain.handle(
        "show-save-file-dialog",
        (event: any, options: object): Promise<SaveDialogReturnValue> => {
            const totalOptions = { ...options };
            const win =
                BrowserWindow.getFocusedWindow() ||
                BrowserWindow.getAllWindows()[0];
            return dialog.showSaveDialog(win, totalOptions);
        },
    );

    // Save file data
    ipcMain.handle(
        "save-file-data",
        async (event, filePath: string, data: string): Promise<void> => {
            try {
                await fs.promises.writeFile(filePath, data);
            } catch (error) {
                throw error;
            }
        },
    );

    // Show open file dialog
    ipcMain.handle(
        "show-open-file-dialog",
        (event: any, options: object): Promise<OpenDialogReturnValue> => {
            const totalOptions = { ...options };
            const win =
                BrowserWindow.getFocusedWindow() ||
                BrowserWindow.getAllWindows()[0];
            return dialog.showOpenDialog(win, totalOptions);
        },
    );

    // Open file data
    ipcMain.handle(
        "open-file-data",
        (event, filePath: string): Promise<any> => {
            try {
                return fs.promises.readFile(filePath, "utf-8");
            } catch (error) {
                throw error;
            }
        },
    );

    ipcMain.on(
        "open-new-url-window",
        (event: any, url: string, windowProperties: any = {}) => {
            //set main window as parent
            windowProperties.parent = win;

            const childWindow = new BrowserWindow(windowProperties);
            childWindow.loadURL(url);
        },
    );
}
