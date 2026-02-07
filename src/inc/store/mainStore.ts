import { defineStore } from "pinia";

/**
 * Main application store.
 *
 * Holds lightweight UI state shared across the app.
 */
export const useMainStore = defineStore("mainStore", {
    /**
     * Store state.
     */
    state: () => ({
        /**
         * Controls visibility of the "About" modal dialog.
         */
        activeAboutModal: false,
    }),
});
