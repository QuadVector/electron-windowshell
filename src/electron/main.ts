/**
 * @file Electron main process entry.
 * Creates the main window, sets build paths, enforces single-instance mode,
 * and registers app/window/API/theme event handlers.
 */

import { app, BrowserWindow } from "electron";
import { release } from "node:os";
import { join, dirname } from "path";
import { fileURLToPath } from "node:url";
import { windowProperties } from "./properties/windowProperties";
import { windowExtraProperties } from "./properties/windowExtraProperties";
import { initElectronWindowEvents } from "../core/scripts/electronWindowEvents";
import { initBrowserWindowEvents } from "../core/scripts/browserWindowEvents";
import { initCoreAPIEvents } from "../core/scripts/coreAPIEvents";
import { initDarkModeEvents } from "../core/scripts/darkModeEvents";
import { initApplicationAPIEvents } from "./applicationAPIEvents";
import { nativeTheme } from "electron";
import { DarkMode, LightMode } from "../core/scripts/themes";

/** ESM-compatible `__filename` used across the main process. */
globalThis.__filename = fileURLToPath(import.meta.url);

/** ESM-compatible `__dirname` used across the main process. */
globalThis.__dirname = dirname(__filename);

/** Electron dist root (main process). */
process.env.DIST_ELECTRON = join(__dirname, "..");
/** Renderer dist folder. */
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
/** Public assets root (dev: src/public, prod: dist). */
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, "../src/public")
    : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

/** Quit if another instance already holds the single-instance lock. */
if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

/** Main application window instance. */
let mainWindow: BrowserWindow;

/** Dev server URL (when running via Vite). */
const url: string = String(process.env.VITE_DEV_SERVER_URL);
/** Bundled renderer entry file path. */
const indexHtml = join(process.env.DIST, "index.html");

/**
 * Creates the main {@link BrowserWindow}, loads renderer content, and wires events.
 */
async function createMainWindow() {
    const isFluent = windowExtraProperties.windowMaterialType === "fluent";

    //window properties depending on windowMaterialType
    windowProperties.titleBarStyle = isFluent ? "hidden" : "default";
    windowProperties.frame = !isFluent;

    //default background color (only if backgroundMaterial is not set)
    windowProperties.backgroundColor = windowProperties.backgroundMaterial
        ? undefined
        : (windowProperties.backgroundColor ??
          (nativeTheme.shouldUseDarkColors
              ? DarkMode.colors["background"]
              : LightMode.colors["background"]));

    //@ts-ignore
    mainWindow = new BrowserWindow(windowProperties);
    mainWindow.setMenuBarVisibility(false); //remove electron window menu

    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(url);
    } else {
        mainWindow.loadFile(indexHtml);
    }

    //initialize
    initBrowserWindowEvents(
        mainWindow,
        windowExtraProperties.windowMaterialType,
    );
    initElectronWindowEvents(app, mainWindow);
    initApplicationAPIEvents(app, mainWindow);
    initCoreAPIEvents(app, mainWindow);
    initDarkModeEvents(app, mainWindow);

    /** macOS-style re-activate: focus existing window or recreate. */
    app.on("activate", () => {
        const allWindows = BrowserWindow.getAllWindows();
        if (allWindows.length) {
            allWindows[0].focus();
        } else {
            createMainWindow();
        }
    });
}

/** Focus/restore the existing window on a second instance (optional). */
if (windowExtraProperties.disableSecondInstance) {
    app.on("second-instance", () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

/** Main entry: create the window when Electron is ready. */
app.whenReady().then(() => {
    createMainWindow();
});
