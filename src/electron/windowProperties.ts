import { join } from "path";

export const windowProperties: any = {
    title: "Electron Fluent template",
    icon: join(__dirname, "/favicon.ico"),
    width: 1280,
    height: 800,
    minWidth: 600,
    minHeight: 750,
    offscreen: true,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        devTools: true,
        webSecurity: true,
        preload: join(__dirname, "preload.js"),
    },
    show: false,
    titleBarOverlay: {
        height: 32,
    },
    backgroundMaterial: "mica",
    useNavigator: true, //use sidebar navigator menu
    displayFluentIcon: true, // display window icon, when windowMaterialType is fluent
    windowMaterialType: "fluent", // fluent or default,
    uiTheme: "windows11",
    disableSecondeInstance: true,
};
