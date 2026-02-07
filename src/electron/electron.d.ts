import type {
    BrowserWindowConstructorOptions,
    OpenDialogOptions,
    OpenDialogReturnValue,
    SaveDialogOptions,
    SaveDialogReturnValue,
} from "electron";

export {};

declare global {
    interface Window {
        /**
         * API exposed from Electron preload (via `contextBridge`).
         *
         * @remarks
         * Use this object in the renderer process to call IPC-backed methods.
         */
        readonly application: {
            /**
             * Opens the native "Save File" dialog.
             *
             * @param options - Dialog configuration.
             * @returns A promise with the dialog result.
             */
            showSaveFileDialog(
                options: SaveDialogOptions,
            ): Promise<SaveDialogReturnValue>;

            /**
             * Opens the native "Open File" dialog.
             *
             * @param options - Dialog configuration.
             * @returns A promise with the dialog result.
             */
            showOpenFileDialog(
                options: OpenDialogOptions,
            ): Promise<OpenDialogReturnValue>;

            /**
             * Writes data to disk.
             *
             * @param filePath - Target file path.
             * @param data - File contents to write.
             * @returns A promise that resolves when writing is complete.
             *
             * @remarks
             * Keep this return type in sync with the main-process IPC handler.
             */
            saveFileData(
                filePath: string,
                data: string | Uint8Array,
            ): Promise<void>;

            /**
             * Reads file content as UTF-8 text.
             *
             * @param filePath - Source file path.
             * @returns A promise with file contents as string.
             */
            openFileData(filePath: string): Promise<string>;

            /**
             * Opens a child `BrowserWindow` and loads the given URL.
             *
             * @param url - URL to load.
             * @param windowProperties - Optional BrowserWindow constructor options.
             */
            openNewURLWindow(
                url: string,
                windowProperties?: BrowserWindowConstructorOptions,
            ): void;
        };
    }
}
