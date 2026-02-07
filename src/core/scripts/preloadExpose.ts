import { contextBridge, ipcRenderer } from "electron";

/**
 * Exposes a minimal, safe Electron API to the renderer process via contextBridge.
 *
 * This registers `window.electronAPI` and maps each method to an IPC message or
 * invocation handled by the main process.
 */
export function initPreloadElectronAPIMethods() {
    console.log("[preloadExpose] Init core preload electron API methods");

    contextBridge.exposeInMainWorld("electronAPI", {
        /**
         * Requests the main process to close the application.
         *
         * Sends the "close-application" IPC event.
         */
        closeApplication: () => {
            ipcRenderer.send("close-application");
        },

        /**
         * Retrieves runtime versions from the main process.
         *
         * Invokes the "get-versions" IPC handler.
         *
         * @returns A promise resolving to the versions payload provided by the main process.
         */
        getVersions: () => {
            return ipcRenderer.invoke("get-versions");
        },

        /**
         * Updates the application's theme mode.
         *
         * Sends the "update-native-colors" IPC event with the requested mode.
         *
         * @param mode Theme mode to apply: "dark", "light", or "system".
         */
        setCurrentThemeMode: (mode: string = "system") => {
            ipcRenderer.send("update-native-colors", mode);
        },

        /**
         * Toggles fullscreen for the current window.
         *
         * Sends the "toggle-fullscreen" IPC event.
         */
        toggleFullScreen() {
            ipcRenderer.send("toggle-fullscreen");
        },

        /**
         * Sets the zoom factor for the current window.
         *
         * Sends the "set-zoom-factor" IPC event with the new zoom factor.
         *
         * @param zoomFactor Zoom factor where 1.0 is default, > 1 zooms in, and < 1 zooms out.
         */
        setZoomFactor(zoomFactor: number) {
            ipcRenderer.send("set-zoom-factor", zoomFactor);
        },

        /**
         * Retrieves the current zoom factor from the main process.
         *
         * Invokes the "get-zoom-factor" IPC handler.
         *
         * @returns A promise resolving to the current zoom factor.
         */
        getZoomFactor(): Promise<number> {
            return ipcRenderer.invoke("get-zoom-factor");
        },

        /**
         * Retrieves the current system wallpaper path/identifier from the main process.
         *
         * Invokes the "get-current-wallpaper" IPC handler.
         *
         * @returns A promise resolving to the current wallpaper value.
         */
        getCurrentWallpaper(): Promise<string> {
            return ipcRenderer.invoke("get-current-wallpaper");
        },
    });
}
