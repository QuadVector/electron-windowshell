import { BrowserWindow, shell } from "electron";
import { windowProperties } from "../../electron/windowProperties";

export function initBrowserWindowEvents(
    win: BrowserWindow,
    windowMaterialType: string,
) {
    console.log("[browserWindowEvents] Init core browser window events");

    if (windowMaterialType === undefined) windowMaterialType = "default";

    // Focus event
    win.on("focus", function () {
        win.webContents.executeJavaScript(
            `document.querySelector("body").classList.remove("unfocused");`,
        );
    });

    // Blur event
    win.on("blur", function () {
        win.webContents.executeJavaScript(
            `document.querySelector("body").classList.add("unfocused");`,
        );

        //close main menu on blur and other blur actions
        win.webContents.executeJavaScript(
            `document.querySelector("body").click();`,
        );
    });

    // Fullscreen mode body class
    win.on("enter-full-screen", () => {
        win.webContents.executeJavaScript(
            `document.querySelector("body").classList.add("fullscreen");`,
        );
    });

    // Fullscreen mode body class
    win.on("leave-full-screen", () => {
        win.webContents.executeJavaScript(
            `document.querySelector("body").classList.remove("fullscreen");`,
        );
    });

    // Test actively push message to the Electron-Renderer
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send(
            "main-process-message",
            new Date().toLocaleString(),
        );
    });

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https:")) shell.openExternal(url);
        return { action: "deny" };
    });

    // Execute a script for window properties
    win.once("ready-to-show", () => {
        let backgroundMaterial = windowProperties.backgroundMaterial;
        let doesHaveBackgroundMaterial = backgroundMaterial !== undefined;
        win.webContents
            .executeJavaScript(
                `
				localStorage.getItem("current_theme_mode");
				document.querySelector("body").classList.remove("loading");
				document.querySelector("body").classList.add("window-material-type-${windowMaterialType}");
				if(${doesHaveBackgroundMaterial}) {
                    document.querySelector("body").classList.add("vibrancy-window");
                    document.querySelector("body").classList.add("vibrancy-window-${backgroundMaterial}");
                }
			`,
                true,
            )
            .then(() => {
                win?.show();
            });
    });
}
