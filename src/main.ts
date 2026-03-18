/**
 * @file Renderer entrypoint.
 * Bootstraps Vue app (Pinia, Router, Vuetify, context menu), loads theme CSS,
 * and syncs theme mode with localStorage + OS + Electron.
 */

import { ThemeMode } from "./core/types/ThemeMode";
import { SoundEffect } from "./core/types/SoundEffect";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import contextmenu from "v-contextmenu";
import { useRouterStore } from "./inc/store/routerStore";
import { DarkMode, LightMode } from "./core/scripts/themes";
import { windowExtraProperties } from "./electron/properties/windowExtraProperties";
import App from "./inc/App.vue";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles/main.css";

/**
 * Loads CSS chunks for the currently selected UI theme.
 * @remarks Uses Vite dynamic imports to include only the active theme styles.
 */
const theme = windowExtraProperties.uiTheme;
const cssLoaders = import.meta.glob("./core/styles/themes/*/*.css");
await cssLoaders[`./core/styles/themes/${theme}/variables.css`]?.();
await cssLoaders[`./core/styles/themes/${theme}/animations.css`]?.();
await cssLoaders[`./core/styles/themes/${theme}/components.css`]?.();
await cssLoaders[`./core/styles/themes/${theme}/app.css`]?.();

//include the rest of the styles
import "v-contextmenu/dist/themes/default.css";
import "./core/styles/base.css";
import "./core/styles/backgrounds.css";
import "./core/styles/helpers.css";
import "./public/style.css";

/** Vue application instance. */
const app = createApp(App);

/**
 * Vuetify plugin instance.
 * @remarks Default theme is derived from `localStorage.current_theme_mode`.
 */
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme:
            localStorage.getItem("current_theme_mode") === "dark"
                ? "DarkMode"
                : "LightMode",
        themes: { DarkMode, LightMode },
    },
});

/** Pinia store manager. */
const pinia = createPinia();
app.use(pinia);

/**
 * Router configuration.
 * @remarks Routes are generated from {@link useRouterStore} definitions with lazy-loaded pages.
 */
const routerStore = useRouterStore();
//@ts-ignore
const routes: RouteRecordRaw[] = routerStore.routes.map((route) => ({
    path: route.path,
    component: () => import(`./inc/page/${route.component}.vue`),
}));

/** Vue Router instance using hash-based navigation. */
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

/**
 * Updates navigation state after route changes and auto-closes navigator on small screens.
 */
routerStore.canGoBack = window.history.state.back !== null;
router.afterEach(() => {
    routerStore.canGoBack = window.history.state.back !== null;
    if (window.innerWidth < 800) {
        routerStore.navigatorOpened = false;
    }
});

app.use(router);
app.use(vuetify);
app.use(contextmenu);
app.mount("#app");

//@todo move to PreloadExpose.ts
window.coreAPI = {
    /**
     * Sets application theme mode and propagates the change:
     * - persists to localStorage
     * - updates Vuetify theme
     * - notifies Electron main process via `window.electronAPI`
     *
     * @param mode Theme mode: `"dark" | "light" | "system"`.
     */
    setCurrentThemeAppMode: (mode: ThemeMode = "system") => {
        console.log("[coreAPI] setCurrentThemeAppMode: ", mode);
        localStorage.setItem("current_theme_mode", mode);
        window.dispatchEvent(new Event("current_theme_mode_changed"));

        switch (mode) {
            case "dark":
                vuetify.theme.global.name.value = "DarkMode";
                window.electronAPI.setCurrentThemeMode("dark");
                break;
            case "light":
                vuetify.theme.global.name.value = "LightMode";
                window.electronAPI.setCurrentThemeMode("light");
                break;
            case "system":
                window.electronAPI.setCurrentThemeMode("system");
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    vuetify.theme.global.name.value = "DarkMode";
                } else {
                    vuetify.theme.global.name.value = "LightMode";
                }
                break;
        }
    },

    /**
     *
     * @param name Sound name. Sound files must be placed in `/public/sound/ui/[sound_pack_name]`.
     * All available sound names declared in `src/core/types/SoundEffect.ts`.
     * @returns
     */
    playSound(name: SoundEffect) {
        console.log("[coreAPI] playSound:", name);
        if (windowExtraProperties.soundPack === undefined) {
            console.log("[coreAPI] playSound: sound pack not loaded");
            return;
        }

        const src = `/src/public/sound/ui/${windowExtraProperties.soundPack}/${name}.wav`;
        let audio = new Audio(src);

        //clean memory
        audio.addEventListener("ended", () => {
            audio.remove();
        });

        audio.play();
    },
};

/**
 * OS theme change handler.
 * @remarks Applied only when the app theme mode is set to `"system"`.
 */
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
        if (localStorage.getItem("current_theme_mode") === "system") {
            window.coreAPI.setCurrentThemeAppMode("system");
        }
    });

/** Apply saved theme mode on startup (defaults to `"system"`). */
window.coreAPI.setCurrentThemeAppMode(
    (localStorage.getItem("current_theme_mode") || "system") as ThemeMode,
);
