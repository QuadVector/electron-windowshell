<template>
    <DockMenu
        :items="mainMenuItems"
        :on-selected="menuSelect"
        class="no-drag component__WindowBar-menu"></DockMenu>
</template>

<script>
import DockMenu from "../../core/components/vue-router-menu/components/MenuBar.vue";
import { useMenuStore } from "../../inc/store/menuStore";
import { menuSelectEvent } from "../../inc/menuEvents";

import { useTinykeys } from "vue-tinykeys";

export default {
    /**
     * Component state.
     */
    data() {
        return {};
    },

    components: {
        /** Main menu bar component. */
        DockMenu,
    },

    /**
     * Component props.
     */
    props: {},

    methods: {
        /**
         * Handles menu item selection and forwards it to the central menu handler.
         *
         * @param e Selected menu item payload.
         */
        menuSelect(e) {
            console.info("[Selected menu item]", e);
            menuSelectEvent(e, this.$router);
        },
    },

    computed: {
        /**
         * Returns menu items from the menu store.
         */
        mainMenuItems() {
            const menuStore = useMenuStore();
            if (menuStore.mainMenuItems) {
                return menuStore.mainMenuItems;
            }
            return [];
        },
    },

    created() {
        /**
         * Registers keyboard shortcuts that trigger menu navigation/actions.
         */
        useMenuStore().AnchorExecutableShortcuts.forEach((value) => {
            useTinykeys(value.shortcut, () => {
                menuSelectEvent({ anchor: value.anchor }, this.$router);
            });
        });

        /**
         * Synchronizes visibility of the context menu and the window menu.
         *
         * Uses a delayed setup to ensure the menu DOM is mounted before attaching listeners.
         */
        setTimeout(function () {
            document
                .querySelector(".menu-bar-items")
                .addEventListener("mouseup", function (event) {
                    /**
                     * On left click, hides the context menu and restores window menus.
                     */
                    if (event.which == 1) {
                        try {
                            let contextMenu =
                                document.querySelector(".v-contextmenu");
                            if (contextMenu) {
                                contextMenu.style.display = "none";
                            }

                            let openedMenus =
                                document.querySelectorAll(".menu-container");
                            if (openedMenus) {
                                openedMenus.forEach(function (value) {
                                    value.style.display = "block";
                                });
                            }
                        } catch {}
                    }
                });

            /**
             * Global context menu handler used to switch between context menu and window menus.
             */
            window.oncontextmenu = function (event) {
                /**
                 * Prevents context menu switching for events originating inside the menu container.
                 */
                let bounds = event
                    .composedPath()
                    .includes(
                        document.querySelector(".component__WindowBar-menu"),
                    );

                if (!bounds) {
                    try {
                        let contextMenu =
                            document.querySelector(".v-contextmenu");
                        if (contextMenu) {
                            contextMenu.style.display = "block";
                        }

                        let openedMenus =
                            document.querySelectorAll(".menu-container");
                        if (openedMenus) {
                            openedMenus.forEach(function (value) {
                                value.style.display = "none";
                            });
                        }

                        document
                            .querySelector(
                                ".menu-bar-item-container:has(.menu-items) .name-container",
                            )
                            .click();
                    } catch {}
                }
            };
        }, 1);
    },
};
</script>
