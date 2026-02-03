import { app, BrowserWindow } from "electron";
import { release } from "node:os";
import { join, dirname } from "path";
import { fileURLToPath } from "node:url";
import { windowProperties } from "../electron/windowProperties";
import { windowExtraProperties } from "../electron/windowExtraProperties";
import { initElectronWindowEvents } from "../core/scripts/electronWindowEvents";
import { initBrowserWindowEvents } from "../core/scripts/browserWindowEvents";
import { initElectronAPIEvents } from "../core/scripts/electronAPIEvents";
import { initDarkModeEvents } from "../core/scripts/darkModeEvents";
import { initAppEvents } from "./appEvents";
import { nativeTheme } from "electron";
import { DarkMode, LightMode } from "../core/scripts/themes";
const remoteMain = require("@electron/remote/main");

//global variables
globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.__dirname = dirname(__filename);

// process env
process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, "../src/public")
    : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

let mainWindow: BrowserWindow;
const url: string = String(process.env.VITE_DEV_SERVER_URL);
const indexHtml = join(process.env.DIST, "index.html");

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
    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(url);
    } else {
        mainWindow.loadFile(indexHtml);
    }

    //initialize
    remoteMain.initialize();
    initBrowserWindowEvents(
        mainWindow,
        windowExtraProperties.windowMaterialType,
    );
    initElectronWindowEvents(app, mainWindow);
    initAppEvents(app, mainWindow);
    initElectronAPIEvents(app, mainWindow);
    initDarkModeEvents(app, mainWindow);

    app.on("activate", () => {
        const allWindows = BrowserWindow.getAllWindows();
        if (allWindows.length) {
            allWindows[0].focus();
        } else {
            createMainWindow();
        }
    });

    remoteMain.enable(mainWindow.webContents);
}

//disable second instance
if (windowExtraProperties.disableSecondInstance) {
    app.on("second-instance", () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

app.whenReady().then(() => {
    createMainWindow();
});
