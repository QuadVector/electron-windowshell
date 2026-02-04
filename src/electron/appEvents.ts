import {
    ipcMain,
    dialog,
    BrowserWindow,
    SaveDialogReturnValue,
    OpenDialogReturnValue,
} from "electron";
import { nativeTheme } from "electron";
import fs from "fs";
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

    // Create new parent window with the specified file from /src/app/ folder
    ipcMain.on(
        "open-new-window",
        (
            event: any,
            fileName: string,
            windowProperties: any,
            windowExtraProperties: any,
        ) => {
            if (fileName === "") return;

            //set main window as parent
            windowProperties.parent = win;

            const isFluent =
                windowExtraProperties.windowMaterialType === "fluent";

            //window properties depending on windowMaterialType
            windowProperties.titleBarStyle = isFluent ? "hidden" : "default";
            windowProperties.frame = !isFluent;

            //default background color (only if backgroundMaterial is not set)
            windowProperties.backgroundColor =
                windowProperties.backgroundMaterial
                    ? undefined
                    : (windowProperties.backgroundColor ??
                      (nativeTheme.shouldUseDarkColors
                          ? DarkMode.colors["background"]
                          : LightMode.colors["background"]));

            initBrowserWindowEvents(
                win,
                windowExtraProperties.windowMaterialType,
            );
            initElectronWindowEvents(app, win);
            initAppEvents(app, win);
            initElectronAPIEvents(app, win);
            initDarkModeEvents(app, win);

            const childWindow = new BrowserWindow(windowProperties);
            childWindow.loadFile(fileName);
        },
    );

    ipcMain.on(
        "open-new-url-window",
        (event: any, url: string, windowProperties: any) => {
            //set main window as parent
            windowProperties.parent = win;

            const childWindow = new BrowserWindow(windowProperties);
            childWindow.loadURL(url);
        },
    );
}
