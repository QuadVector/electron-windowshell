import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import contextmenu from "v-contextmenu";
import { useRouterStore } from "./inc/store/routerStore";
import { DarkMode, LightMode } from "./core/scripts/themes";
import { windowExtraProperties } from "./electron/windowExtraProperties";
import App from "./App.vue";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

//подключение стилей текущей темы приложения
const theme = windowExtraProperties.uiTheme;
const cssLoaders = import.meta.glob("./core/styles/themes/*/*.css");
await cssLoaders[`./core/styles/themes/${theme}/variables.css`]?.();
await cssLoaders[`./core/styles/themes/${theme}/animations.css`]?.();
await cssLoaders[`./core/styles/themes/${theme}/components.css`]?.();
await cssLoaders[`./core/styles/themes/${theme}/app.css`]?.();

//подключение остальных стилей
import "v-contextmenu/dist/themes/default.css";
import "./core/fonts/segoe-ui/stylesheet.css";
import "./core/styles/themes/windows11/variables.css";
import "./core/styles/themes/windows11/animations.css";
import "./core/styles/base.css";
import "./core/styles/backgrounds.css";
import "./core/styles/helpers.css";
import "./core/styles/themes/windows11/components.css";
import "./core/styles/themes/windows11/app.css";
import "./public/style.css";

const app = createApp(App);

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

const pinia = createPinia();
app.use(pinia);

const routerStore = useRouterStore();
//@ts-ignore
const routes: RouteRecordRaw[] = routerStore.routes.map((route) => ({
	path: route.path,
	component: () => import(`./inc/workspace/${route.component}.vue`),
}));

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

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

window.setCurrentThemeAppMode = function (mode: string = "system") {
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
};

//os color theme change trigger
window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", () => {
		if (localStorage.getItem("current_theme_mode") === "system") {
			window.setCurrentThemeAppMode("system");
		}
	});

window.setCurrentThemeAppMode(
	localStorage.getItem("current_theme_mode") || "system"
);
