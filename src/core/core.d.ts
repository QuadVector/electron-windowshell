import { ThemeMode } from "./types/ThemeMode";

// core.d.ts
export {};

declare global {
    interface Window {
        /**
         * Sets application theme mode and propagates the change:
         * - persists to localStorage
         * - updates Vuetify theme
         * - notifies Electron main process via `CoreAPI`
         * 
         * Implementation of this method is located in main.ts, i.e. it directly accesses vuetify
         *
         * @param mode Theme mode: `"dark" | "light" | "system"`.
         */
        setCurrentThemeAppMode: (mode: ThemeMode = "system") => void;

        /**
         * Electron APIs exposed from preload via contextBridge.
         */
        CoreAPI: {
            /**
             *
             * @param name Sound name. Sound files must be placed in `/public/sound/ui/[sound_pack_name]`.
             * @returns
             */
            playSound: (name: string) => void;

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
