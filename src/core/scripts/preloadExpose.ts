import { contextBridge, ipcRenderer } from "electron";

export function initPreloadElectronAPIMethods() {
    console.log("[preloadExpose] Init core preload electron API methods");

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
    });
}
