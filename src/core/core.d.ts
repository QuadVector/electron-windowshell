export {};

declare global {
    interface Window {
        setCurrentThemeAppMode: (mode: string) => void;

        electronAPI: {
            closeApplication: () => void;
            getVersions: () => Promise<string[]>;
            setCurrentThemeMode: (mode: string) => void;
            toggleFullScreen: () => void;
            setZoomFactor: (zoomFactor: number) => void;
            getZoomFactor: () => Promise<number>;
            getCurrentWallpaper: () => Promise<string>;
        };
    }
}
