import { contextBridge, ipcRenderer } from "electron";

export function initPreloadElectronAPIMethods() {
    console.log("[preloadExpose] Init preload electron API methods");

    contextBridge.exposeInMainWorld("electronAPI", {
        /**
         * Send a message to the main process to close the application.
         * This method will trigger the "close-application" event in the main process.
         */
        closeApplication: () => {
            ipcRenderer.send("close-application");
        },

        /**
         * Get the versions of Electron, Chromium, Node.js, and V8.
         * This method will return a promise that resolves with an array of strings.
         * The array will contain the following versions in order:
         * - Electron version
         * - Chromium version
         * - Node.js version
         * - V8 version
         * @returns {Promise<string[]>} A promise that resolves with an array of strings.
         */
        getVersions: () => {
            return ipcRenderer.invoke("get-versions");
        },

        /**
         * Set the current theme mode of the application.
         * This method will send a message to the main process to update the native colors of the application.
         * The main process will then update the native colors of the application based on the provided theme mode.
         * @param {string} [mode="system"] The theme mode to set. Can be "dark", "light", or "system". Defaults to "system".
         */
        setCurrentThemeMode: (mode: string = "system") => {
            ipcRenderer.send("update-native-colors", mode);
        },

        /**
         * Show a save file dialog to the user.
         * This method will send a message to the main process to show a save file dialog.
         * The main process will then show a save file dialog to the user based on the provided options.
         * @param {object} options The options to pass to the save file dialog.
         * @returns {Promise<SaveDialogReturnValue>} A promise that resolves with the result of the save file dialog.
         */
        showSaveFileDialog(options: object) {
            return ipcRenderer.invoke("show-save-file-dialog", options);
        },

        /**
         * Save the provided data to the provided file path.
         * This method will send a message to the main process to save the provided data to the provided file path.
         * The main process will then save the provided data to the provided file path.
         * @param {string} filePath The file path to save the data to.
         * @param {string} data The data to save.
         * @returns {Promise<boolean>} A promise that resolves with true if the data was saved successfully, false otherwise.
         */
        saveFileData(filePath: string, data: string) {
            return ipcRenderer.invoke("save-file-data", filePath, data);
        },

        /**
         * Show an open file dialog to the user.
         * This method will send a message to the main process to show an open file dialog.
         * The main process will then show an open file dialog to the user based on the provided options.
         * @param {object} options The options to pass to the open file dialog.
         * @returns {Promise<OpenDialogReturnValue>} A promise that resolves with the result of the open file dialog.
         */
        showOpenFileDialog(options: object) {
            return ipcRenderer.invoke("show-open-file-dialog", options);
        },

        /**
         * Opens the provided file path and reads its contents.
         * This method will send a message to the main process to open the provided file path and read its contents.
         * The main process will then open the provided file path, read its contents and return the result to the renderer process.
         * @param {string} filePath The file path to open and read.
         * @returns {Promise<string>} A promise that resolves with the contents of the file.
         */
        openFileData(filePath: string) {
            return ipcRenderer.invoke("open-file-data", filePath);
        },

        /**
         * Toggles the full screen mode of the application window.
         * This method will send a message to the main process to toggle the full screen mode of the application window.
         */
        toggleFullScreen() {
            ipcRenderer.send("toggle-fullscreen");
        },

        /**
         * Sets the zoom factor of the application window.
         * This method will send a message to the main process to set the zoom factor of the application window.
         * @param {number} zoomFactor The zoom factor to set. A value of 1.0 is the default zoom level, and values greater than 1.0 will zoom in, while values less than 1.0 will zoom out.
         */
        setZoomFactor(zoomFactor: number) {
            ipcRenderer.send("set-zoom-factor", zoomFactor);
        },

        /**
         * Gets the current zoom factor of the application window.
         * This method will send a message to the main process to get the current zoom factor of the application window.
         * The main process will then get the current zoom factor of the application window and return the result to the renderer process.
         * @returns {Promise<number>} A promise that resolves with the current zoom factor of the application window.
         */
        getZoomFactor(): Promise<number> {
            return ipcRenderer.invoke("get-zoom-factor");
        },

        /**
         * Gets the current wallpaper of the system.
         * This method will send a message to the main process to get the current wallpaper of the system.
         * The main process will then get the current wallpaper of the system and return the result to the renderer process.
         * @returns {Promise<string>} A promise that resolves with the current wallpaper of the system.
         */
        getCurrentWallpaper(): Promise<string> {
            return ipcRenderer.invoke("get-current-wallpaper");
        },

        /**
         * Opens a new parent window with the specified file path and window properties.
         * This method will send a message to the main process to open a new parent window with the specified file path and window properties.
         * The main process will then open a new parent window with the specified file path and window properties and return the result to the renderer process.
         * @param {string} filePath The file path to open in the new parent window.
         * @param {any} windowProperties The window properties to set for the new parent window.
         * @param {any} windowExtraProperties The window extra properties to set for the new parent window.
         */
        openNewWindow(
            filePath: string,
            windowProperties: any,
            windowExtraProperties: any,
        ) {
            ipcRenderer.send(
                "open-new-window",
                filePath,
                windowProperties,
                windowExtraProperties,
            );
        },
    });
}
