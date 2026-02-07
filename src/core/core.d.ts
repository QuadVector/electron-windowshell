// core.d.ts
export {};

declare global {
    /**
     * Theme mode values supported by the app.
     */
    type ThemeMode = "dark" | "light" | "system" | (string & {});

    interface Window {
        /**
         * Sets the current application theme mode (renderer-level helper).
         *
         * @param mode Theme mode to set (e.g. "dark", "light", "system").
         */
        setCurrentThemeAppMode: (mode: ThemeMode) => void;

        /**
         * Electron APIs exposed from preload via contextBridge.
         */
        electronAPI: {
            /**
             * Requests the main process to close the application.
             */
            closeApplication: () => void;

            /**
             * Gets runtime versions from the main process.
             *
             * Note: if your IPC returns an object (recommended), update this type accordingly.
             */
            getVersions: () => Promise<string[]>;

            /**
             * Updates the native/theme mode through the main process.
             *
             * @param mode Theme mode to set.
             */
            setCurrentThemeMode: (mode: ThemeMode) => void;

            /**
             * Toggles fullscreen mode of the current window.
             */
            toggleFullScreen: () => void;

            /**
             * Sets the zoom factor of the current window.
             *
             * @param zoomFactor 1.0 is default; >1 zoom in; <1 zoom out.
             */
            setZoomFactor: (zoomFactor: number) => void;

            /**
             * Gets the current zoom factor.
             */
            getZoomFactor: () => Promise<number>;

            /**
             * Gets the current system wallpaper path/identifier.
             */
            getCurrentWallpaper: () => Promise<string>;
        };
    }
}
