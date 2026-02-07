import {
    ipcMain,
    dialog,
    BrowserWindow,
    OpenDialogOptions,
    OpenDialogReturnValue,
    SaveDialogOptions,
    SaveDialogReturnValue,
    BrowserWindowConstructorOptions,
    App,
} from "electron";
import fs from "node:fs";

/**
 * Registers IPC handlers/listeners used by the app.
 *
 * @param app - Electron App instance (currently unused, kept for future extension).
 * @param win - Main application window used as parent for child windows.
 */
export function initAppEvents(app: App, win: BrowserWindow): void {
    /**
     * Returns the currently focused window or the first available window.
     *
     * @returns Active BrowserWindow instance.
     */
    const getActiveWindow = (): BrowserWindow => {
        return BrowserWindow.getFocusedWindow() ?? win;
    };

    /**
     * Opens a native "Save File" dialog.
     *
     * @param _event - IPC invoke event (not used).
     * @param options - Save dialog options.
     * @returns Promise with the save dialog result.
     */
    ipcMain.handle(
        "show-save-file-dialog",
        (
            _event,
            options: SaveDialogOptions,
        ): Promise<SaveDialogReturnValue> => {
            return dialog.showSaveDialog(getActiveWindow(), { ...options });
        },
    );

    /**
     * Writes data to disk at the given path (UTF-8).
     *
     * @param _event - IPC invoke event (not used).
     * @param filePath - Destination path.
     * @param data - Text content to write.
     * @returns Promise that resolves when the file is written.
     */
    ipcMain.handle(
        "save-file-data",
        async (_event, filePath: string, data: string): Promise<void> => {
            await fs.promises.writeFile(filePath, data, "utf-8");
        },
    );

    /**
     * Opens a native "Open File" dialog.
     *
     * @param _event - IPC invoke event (not used).
     * @param options - Open dialog options.
     * @returns Promise with the open dialog result.
     */
    ipcMain.handle(
        "show-open-file-dialog",
        (
            _event,
            options: OpenDialogOptions,
        ): Promise<OpenDialogReturnValue> => {
            return dialog.showOpenDialog(getActiveWindow(), { ...options });
        },
    );

    /**
     * Reads file contents as UTF-8 text.
     *
     * @param _event - IPC invoke event (not used).
     * @param filePath - Source path.
     * @returns Promise with file content.
     */
    ipcMain.handle(
        "open-file-data",
        (_event, filePath: string): Promise<string> => {
            return fs.promises.readFile(filePath, "utf-8");
        },
    );

    /**
     * Opens a new child BrowserWindow and loads the given URL.
     *
     * @param _event - IPC event (not used).
     * @param url - URL to load in the new window.
     * @param windowProperties - Optional BrowserWindow constructor options.
     */
    ipcMain.on(
        "open-new-url-window",
        (
            _event,
            url: string,
            windowProperties: BrowserWindowConstructorOptions = {},
        ) => {
            const childWindow = new BrowserWindow({
                ...windowProperties,
                parent: win,
            });

            childWindow.loadURL(url);
        },
    );
}
