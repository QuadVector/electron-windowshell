import { defineStore } from "pinia";

/**
 * Router/UI navigation store.
 * Keeps route definitions for Vue Router and state for the navigator (dock) UI
 * such as "can go back" and whether the navigator panel is opened.
 */
export const useRouterStore = defineStore("routerStore", {
    state: () => ({
        canGoBack: false,
        navigatorOpened: true,
        routes: [
            { path: "", component: "Main" },
            { path: "/components", component: "Components" },
            { path: "/grid", component: "Grid" },
            { path: "/tabs", component: "Tabs" },
        ],
        //dock menu items (navigator menu) (works only if useNavigator in windowExtraProperties.ts is true)
        navigatorMenuItems: [
            { title: "Welcome", routePath: "/", icon: "mdi-home" },
            {
                title: "Components",
                routePath: "/components",
                icon: "mdi-wrench",
            },
            { title: "Grid", routePath: "/grid", icon: "mdi-table" },
            { title: "Tabs", routePath: "/tabs", icon: "mdi-table" },
        ],
    }),
});
