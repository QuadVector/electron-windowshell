import { join } from "path";

export const windowProperties = {
	title: "Electron Fluent template",
	icon: join(__dirname, "/favicon.ico"),
	width: 1280,
	height: 800,
	minWidth: 600,
	minHeight: 750,
	fullscreenable: true,
	offscreen: false,
	webPreferences: {
		nodeIntegration: false,
		contextIsolation: true,
		devTools: true,
		webSecurity: true,
		preload: join(__dirname, "preload.js"),
	},
	maximizable: true,
	resizable: true,
	autoHideMenuBar: true,
	show: false,
	titleBarOverlay: {
		height: 32,
	},
	backgroundColor: "default",
	frame: true,
	titleBarStyle: "default"
};
