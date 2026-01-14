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
const remoteMain = require("@electron/remote/main");

globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.__dirname = dirname(__filename);

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

let win: BrowserWindow;
const url: string = String(process.env.VITE_DEV_SERVER_URL);
const indexHtml = join(__dirname, "..", "dist", "index.html");

async function createWindow() {
	if (windowExtraProperties.windowMaterialType == "fluent") {
		windowProperties.titleBarStyle = "hidden";
		windowProperties.frame = false;
	} else {
		windowProperties.titleBarStyle = "default";
		windowProperties.frame = true;
	}

	//@ts-ignore
	win = new BrowserWindow(windowProperties);
	if (process.env.VITE_DEV_SERVER_URL) {
		win.loadURL(url);
	} else {
		win.loadFile(indexHtml);
	}

	remoteMain.initialize();
	initBrowserWindowEvents(win, windowExtraProperties.windowMaterialType);
	initElectronWindowEvents(app, win);
	initAppEvents(app, win);
	initElectronAPIEvents(app, win);
	initDarkModeEvents(app, win);

	app.on("activate", () => {
		const allWindows = BrowserWindow.getAllWindows();
		if (allWindows.length) {
			allWindows[0].focus();
		} else {
			createWindow();
		}
	});

	remoteMain.enable(win.webContents);
}

//disable second instance
app.on("second-instance", () => {
	if (win) {
		if (win.isMinimized()) win.restore();
		win.focus();
	}
});

app.whenReady().then(() => {
	createWindow();
});