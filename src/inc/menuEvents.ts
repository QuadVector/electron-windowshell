import { useMainStore } from "./store/mainStore";
import { useMenuStore } from "./store/menuStore";

/* Menu item selection events */
export const menuSelectEvent = (e: any, router: any) => {
    switch (e.anchor) {
        case "file-new":
            alert("New file");
            break;
        case "app-close":
            CoreAPI.closeApplication();
            break;
        case "full-screen":
            CoreAPI.toggleFullScreen();
            break;
        case "zoom-in":
            CoreAPI.getZoomFactor().then((zoomFactor) => {
                CoreAPI.setZoomFactor(zoomFactor + 0.25);
            });
            break;
        case "zoom-out":
            CoreAPI.getZoomFactor().then((zoomFactor) => {
                CoreAPI.setZoomFactor(zoomFactor - 0.25);
            });
            break;
        case "color-theme-light":
            window.setCurrentThemeAppMode("light");
            useMenuStore().ChangeElementState("color-theme-light", {
                checked: true,
            });
            useMenuStore().ChangeElementState("color-theme-dark", {
                checked: false,
            });
            useMenuStore().ChangeElementState("color-theme-system", {
                checked: false,
            });
            break;
        case "color-theme-dark":
            window.setCurrentThemeAppMode("dark");
            useMenuStore().ChangeElementState("color-theme-light", {
                checked: false,
            });
            useMenuStore().ChangeElementState("color-theme-dark", {
                checked: true,
            });
            useMenuStore().ChangeElementState("color-theme-system", {
                checked: false,
            });
            break;
        case "color-theme-system":
            window.setCurrentThemeAppMode("system");
            useMenuStore().ChangeElementState("color-theme-light", {
                checked: false,
            });
            useMenuStore().ChangeElementState("color-theme-dark", {
                checked: false,
            });
            useMenuStore().ChangeElementState("color-theme-system", {
                checked: true,
            });
            break;
        case "help-about":
            useMainStore().activeAboutModal = true;
            break;
        case "add-recent-file":
            useMenuStore().CreateElement(
                {
                    anchor: "test-" + Date.now(),
                    name: "New test item",
                },
                "open-recent-file",
            );
            break;
    }
};
