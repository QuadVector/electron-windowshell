import { contextBridge, ipcRenderer } from "electron";
import {
    BrowserWindowConstructorOptions,
    OpenDialogOptions,
    OpenDialogReturnValue,
    SaveDialogOptions,
    SaveDialogReturnValue,
} from "electron";

import { initPreloadCoreAPIMethods } from "../core/scripts/corePreload";
/**
 * Renderer-facing API exposed via Electron `contextBridge`.
 *
 * @remarks
 * This object is available as `window.ApplicationAPI` in the renderer process.
 * All methods are backed by IPC calls to the main process.
 */
export function initPreloadApplicationAPIMethods() {
    console.log("[preload] Init application preload API methods");
    contextBridge.exposeInMainWorld("ApplicationAPI", {
        /**
         * Opens the native "Save File" dialog.
         *
         * @param options - Save dialog options.
         * @returns Promise with the dialog result.
         */
        showSaveFileDialog(
            options: SaveDialogOptions,
        ): Promise<SaveDialogReturnValue> {
            console.log("[ApplicationAPI] showSaveFileDialog");
            return ipcRenderer.invoke("show-save-file-dialog", options);
        },

        /**
         * Writes UTF-8 text data to disk.
         *
         * @param filePath - Destination path.
         * @param data - Text to write.
         * @returns Promise that resolves when the write completes.
         *
         * @remarks
         * The main-process handler returns `void`, so this resolves to `void`.
         */
        saveFileData(filePath: string, data: string): Promise<void> {
            console.log("[ApplicationAPI] saveFileData");
            return ipcRenderer.invoke("save-file-data", filePath, data);
        },

        /**
         * Opens the native "Open File" dialog.
         *
         * @param options - Open dialog options.
         * @returns Promise with the dialog result.
         */
        showOpenFileDialog(
            options: OpenDialogOptions,
        ): Promise<OpenDialogReturnValue> {
            console.log("[ApplicationAPI] showOpenFileDialog");
            return ipcRenderer.invoke("show-open-file-dialog", options);
        },

        /**
         * Reads a file as UTF-8 text.
         *
         * @param filePath - Source file path.
         * @returns Promise with file contents.
         */
        openFileData(filePath: string): Promise<string> {
            console.log("[ApplicationAPI] openFileData");
            return ipcRenderer.invoke("open-file-data", filePath);
        },

        /**
         * Opens a child window and loads the given URL.
         *
         * @param url - URL to load.
         * @param windowProperties - Optional BrowserWindow constructor options.
         */
        openNewURLWindow(
            url: string,
            windowProperties?: BrowserWindowConstructorOptions,
        ): void {
            console.log("[ApplicationAPI] openNewURLWindow");
            ipcRenderer.send("open-new-url-window", url, windowProperties);
        },
    });
}

initPreloadCoreAPIMethods();
initPreloadApplicationAPIMethods();
