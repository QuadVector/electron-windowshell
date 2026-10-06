<template>
	<DockMenu
		:items="mainMenuItems"
		:on-selected="menuSelect"
		class="no-drag component__WindowBar-menu"></DockMenu>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import DockMenu from "../../core/components/vue-router-menu/components/MenuBar.vue";
import { useMenuStore } from "../../inc/store/menuStore";
import { menuSelectEvent } from "../../inc/menuEvents";

import { useTinykeys } from "vue-tinykeys";

const router = useRouter();

const menuSelect = function (e) {
	console.info("[Selected menu item]", e);
	menuSelectEvent(e, router);
};

const mainMenuItems = computed(() => {
	const menuStore = useMenuStore();
	if (menuStore.mainMenuItems) {
		return menuStore.mainMenuItems;
	}
	return [];
});

/**
 * Registers keyboard shortcuts that trigger menu navigation/actions.
 */
useMenuStore().AnchorExecutableShortcuts.forEach((value) => {
	useTinykeys(value.shortcut, (e) => {
		// prevent native browser behavior for the shortcut
		e.preventDefault();
		e.stopPropagation();
		
		// trigger the menu action associated with the shortcut
		menuSelectEvent({ anchor: value.anchor }, router);
	});
});

onMounted(() => {
	/**
	 * Synchronizes visibility of the context menu and the window menu.
	 *
	 * Uses a delayed setup to ensure the menu DOM is mounted before attaching listeners.
	 */
	document
		.querySelector(".menu-bar-items")
		.addEventListener("mouseup", function (event) {
			/**
			 * On left click, hides the context menu and restores window menus.
			 */
			if (event.which == 1) {
				try {
					let contextMenu = document.querySelector(".v-contextmenu");
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
			.includes(document.querySelector(".component__WindowBar-menu"));

		if (!bounds) {
			try {
				let contextMenu = document.querySelector(".v-contextmenu");
				if (contextMenu) {
					contextMenu.style.display = "block";
				}

				let openedMenus = document.querySelectorAll(".menu-container");
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
});

onUnmounted(() => {
	window.oncontextmenu = null;
});
</script>
