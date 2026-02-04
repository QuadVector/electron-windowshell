/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare namespace NodeJS {
    interface ProcessEnv {
        VSCODE_DEBUG?: "true";
        DIST_ELECTRON: string;
        DIST: string;
        VITE_PUBLIC: string;
    }
}
