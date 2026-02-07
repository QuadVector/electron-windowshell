/// <reference types="vite/client" />

/**
 * Allows importing `.vue` files in TypeScript by typing them as Vue components.
 */
declare module "*.vue" {
    import type { DefineComponent } from "vue";

    /**
     * Vue SFC default export.
     */
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

/**
 * Node.js process environment variables used by the Electron/Vite build setup.
 */
declare namespace NodeJS {
    interface ProcessEnv {
        /**
         * Enables VS Code debug mode integration when set to `"true"`.
         */
        VSCODE_DEBUG?: "true";

        /** Path to the Electron distribution root (main process). */
        DIST_ELECTRON: string;

        /** Path to the renderer distribution folder. */
        DIST: string;

        /** Path to public assets root (dev/prod dependent). */
        VITE_PUBLIC: string;
    }
}
