import { SoundEffect } from "./types/SoundEffect";
import { ThemeMode } from "./types/ThemeMode";

// core.d.ts
export {};

declare global {
    interface Window {
        /**
         * Core APIs exposed from preload via contextBridge.
         */
        coreAPI: {
            /**
             * Sets the current application theme mode (renderer-level helper).
             *
             * @param mode Theme mode to set (e.g. "dark", "light", "system").
             */
            setCurrentThemeAppMode: (mode: ThemeMode) => void;

            /**
             *
             * @param name Sound name. Sound files must be placed in `/public/sound/ui/[sound_pack_name]`.
             * All available sound names declared in `src/core/types/SoundEffect.ts`.
             * @returns
             */
            playSound: (name: SoundEffect) => void;
        };

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
