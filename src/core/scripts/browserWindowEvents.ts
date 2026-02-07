import { BrowserWindow, shell } from "electron";
import { windowProperties } from "../../electron/windowProperties";

/**
 * Initializes core browser window events for an Electron application window.
 * Sets up event listeners for window focus/blur, fullscreen mode changes,
 * content loading, and window opening behavior.
 *
 * @param win - The Electron BrowserWindow instance to attach events to
 * @param windowMaterialType - The type of window material/style to apply. Defaults to "default" if undefined
 *
 * @remarks
 * This function modifies the window's DOM by adding/removing CSS classes based on window state.
 * It also handles external link opening and applies window material styling on load.
 *
 * @public
 */
export function initBrowserWindowEvents(
    win: BrowserWindow,
    windowMaterialType: string,
) {
    console.log("[browserWindowEvents] Init core browser window events");

    if (windowMaterialType === undefined) windowMaterialType = "default";

    /**
     * Handles window focus event.
     * Removes the "unfocused" CSS class from the body element when window gains focus.
     */
    win.on("focus", function () {
        win.webContents.executeJavaScript(
            `document.querySelector("body").classList.remove("unfocused");`,
        );
    });

    /**
     * Handles window blur event.
     * Adds the "unfocused" CSS class to the body element and triggers a click
     * on the body to close any open menus when window loses focus.
     */
    win.on("blur", function () {
        win.webContents.executeJavaScript(
            `document.querySelector("body").classList.add("unfocused");`,
        );

        // Close main menu on blur and other blur actions
        win.webContents.executeJavaScript(
            `document.querySelector("body").click();`,
        );
    });

    /**
     * Handles entering fullscreen mode.
     * Adds the "fullscreen" CSS class to the body element.
     */
    win.on("enter-full-screen", () => {
        win.webContents.executeJavaScript(
            `document.querySelector("body").classList.add("fullscreen");`,
        );
    });

    /**
     * Handles leaving fullscreen mode.
     * Removes the "fullscreen" CSS class from the body element.
     */
    win.on("leave-full-screen", () => {
        win.webContents.executeJavaScript(
            `document.querySelector("body").classList.remove("fullscreen");`,
        );
    });

    /**
     * Handles content load completion.
     * Sends a test message with current timestamp to the renderer process.
     *
     * @remarks
     * This appears to be for testing IPC communication between main and renderer processes.
     */
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send(
            "main-process-message",
            new Date().toLocaleString(),
        );
    });

    /**
     * Configures external link handling.
     * Opens all HTTPS links in the system's default browser instead of the application window.
     *
     * @param url - The URL that is attempting to open
     * @returns An object with action "deny" to prevent the link from opening in the app
     */
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https:")) shell.openExternal(url);
        return { action: "deny" };
    });

    /**
     * Handles window ready state.
     * Executes initialization script when window is ready to show:
     * - Retrieves theme mode from localStorage
     * - Removes loading state
     * - Applies window material type styling
     * - Applies vibrancy/background material effects if configured
     * - Shows the window after initialization
     *
     * @remarks
     * The window is shown only after all styling is applied to prevent visual flashing.
     */
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
