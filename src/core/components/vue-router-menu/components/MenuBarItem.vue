<template>
	<div
		ref="menuBarItemRef"
		:class="[...menuBarStyle, 'menu-bar-item-container']"
		:style="{ background: bgColor }"
		tabindex="0"
		@pointerenter="handlePointerEnter"
		@pointerleave="handlePointerLeave"
		@keyup="handleKeyUp">
		<span
			:class="[...menuBarStyle, 'name-container']"
			:style="{ color: theme.textColor }">
			{{ getName }}
		</span>
		<span class="menu-container" :style="menuStyle">
			<transition name="fade">
				<DockMenu
					v-if="menuActive && showMenu"
					:items="menu"
					:dock="dock"
					:parent="name"
					:theme="theme"
					:is-touch="isMobileDevice"
					:on-selected="onSelected"
					:initial-highlight-index="highlightIndex">
				</DockMenu>
			</transition>
		</span>
	</div>
</template>

<script lang="ts">
import DockPosition from "../models/MenuBarDockPosition";
import { MenuItemModel } from "../models/MenuItemModel";
import {
	defineComponent,
	PropType,
	ref,
	computed,
	watch,
	onMounted,
	nextTick,
	unref,
	onUnmounted,
} from "vue";
import DockMenu from "./Menu.vue";
import { MenuTheme } from "../models/Theme";
import { isMobile } from "./isMobileDevice";

export default defineComponent({
	name: "MenuBarItem",
	components: {
		DockMenu,
	},
	props: {
		name: {
			type: String,
			default: "",
			required: true,
		},
		menu: {
			type: Array as PropType<MenuItemModel[]>,
			required: true,
		},
		menuActive: {
			type: Boolean,
			default: false,
			required: true,
		},
		menuBarActive: {
			type: Boolean,
			default: false,
			required: true,
		},
		showMenu: {
			type: Boolean,
			default: false,
			required: true,
		},
		menuBarDimensions: {
			type: Object as PropType<{ height: number; width: number }>,
			default: () => {},
			required: true,
		},
		dock: {
			required: true,
			default: DockPosition.TOP,
			type: String,
		},
		id: {
			required: true,
			type: String,
		},
		theme: {
			required: true,
			type: Object as PropType<MenuTheme>,
		},
		isMobileDevice: {
			type: Boolean,
			default: false,
		},
		activeMenuSelectionIndex: {
			type: Number,
			default: -1,
		},
		onSelected: {
			required: true,
			type: Function as PropType<
				({
					anchor,
					name,
					checked,
					extra,
				}: {
					anchor?: string;
					name: string;
					checked: boolean;
					extra: any;
				}) => void
			>,
		},
		highlightFirstElement: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	emits: [
		"show",
		"deactivate",
		"activate",
		"selected",
		"activate-next",
		"activate-previous",
		"highlight-menu-item",
		"select-highlighted-menu-item",
	],
	setup(props, { emit }) {
		const menuBarItemRef = ref<HTMLDivElement>();
		const menuBarItemActive = ref(false);
		const menuStyle = ref();
		const isMobileRef = ref(isMobile());

		const getName = computed(() => {
			if (
				props.dock === DockPosition.LEFT ||
				props.dock === DockPosition.RIGHT
			) {
				return !props.menuBarActive ? props.name[0] : props.name;
			} else {
				return props.name;
			}
		});

		// activate menu
		const setMenuViewable = (viewable: boolean) => {
			if (viewable) {
				emit("activate", props.id);
			} else {
				emit("deactivate", props.id);
			}
		};

		const handlePointerEnter = (event: PointerEvent) => {
			if (event.pointerType !== "touch") {
				setMenuViewable(true);
			}
		};

		const handlePointerLeave = (event: PointerEvent) => {
			if (event.pointerType !== "touch") {
				setMenuViewable(false);
			}
		};

		// toggle menu
		const toggleMenu = (event: MouseEvent | TouchEvent) => {
			event.stopPropagation();
			const isOpen = props.menuActive && props.showMenu;
			emit("show", !isOpen, props.id);
		};

		const handleMenuSelection = ($event: any) => props.onSelected($event);

		const highlightIndex = ref(-1);

		const computeMenuStyle = () => {
			const newStyle: {
				top?: string;
				left?: string;
				right?: string;
				bottom?: string;
			} = {};

			const { clientHeight, clientWidth } =
				menuBarItemRef.value as HTMLDivElement;

			if (props.dock === DockPosition.LEFT) {
				newStyle.top = "0px";
				newStyle.left = `${clientWidth}px`;
			} else if (props.dock === DockPosition.RIGHT) {
				newStyle.top = "0px";
				newStyle.right = `${clientWidth}px`;
			} else if (props.dock === DockPosition.TOP) {
				newStyle.top = `${clientHeight}px`;
				newStyle.left = "0px";
			} else if (props.dock === DockPosition.BOTTOM) {
				newStyle.bottom = `${clientHeight}px`;
				newStyle.left = "0px";
			}

			menuStyle.value = newStyle;
		};

		const menuBarStyle = computed(() => {
			return [
				props.dock.toLowerCase(),
				menuBarItemActive.value ? "active" : "",
				props.menuBarActive ? "expanded" : "",
			];
		});

		watch(
			() => props.showMenu,
			(newValue) => {
				menuBarItemActive.value = newValue;
				if (newValue) {
					nextTick(() => menuBarItemRef.value?.focus());
				}
			},
		);

		watch(
			() => [props.dock, props.menuBarActive],
			() => {
				nextTick(() => {
					setTimeout(() => {
						computeMenuStyle();
					}, 150);
				});
			},
		);

		watch(
			() => props.highlightFirstElement,
			(value) => {
				if (value) {
					highlightIndex.value = 0;
				} else {
					highlightIndex.value = -1;
				}
			},
		);

		onMounted(() => {
			computeMenuStyle();
			const menuBarItem = unref(menuBarItemRef);
			const mobile = unref(isMobileRef);

			if (!menuBarItem) {
				return;
			}

			if (mobile) {
				menuBarItem.addEventListener("touchend", toggleMenu);
			} else {
				menuBarItem.addEventListener("click", toggleMenu);
			}
		});

		onUnmounted(() => {
			const menuBarItem = unref(menuBarItemRef);
			const mobile = unref(isMobileRef);

			if (!menuBarItem) {
				return;
			}

			if (mobile) {
				menuBarItem.removeEventListener("touchend", toggleMenu);
			} else {
				menuBarItem.removeEventListener("click", toggleMenu);
			}
		});

		const bgColor = computed(() => {
			if (menuBarItemActive.value) {
				return props.theme.secondary;
			} else {
				return "transparent";
			}
		});

		const keyNavType = computed(() => {
			if (props.dock === "TOP" || props.dock === "BOTTOM") {
				return "horizontal";
			} else {
				return "vertical";
			}
		});

		const handleKeyUp = (event: KeyboardEvent) => {
			const { key } = event;
			const navType = unref(keyNavType);

			if (key === "Tab") {
				emit("activate", props.id);
			} else if (key === "Enter") {
				if (props.activeMenuSelectionIndex < 0) {
					emit("show", !props.menuActive, props.id);
				} else {
					emit("select-highlighted-menu-item");
				}
			} else if (key === "Escape") {
				emit("show", false);
			} else if (
				(key === "ArrowRight" && navType === "horizontal") ||
				(key === "ArrowDown" && navType === "vertical")
			) {
				emit("activate-next", props.id, "next");
			} else if (
				(key === "ArrowLeft" && navType === "horizontal") ||
				(key === "ArrowUp" && navType === "vertical")
			) {
				emit("activate-previous", props.id, "prev");
			} else if (key === "ArrowDown" && navType === "horizontal") {
				emit("highlight-menu-item", "down", props.id);
			} else if (key === "ArrowUp" && navType === "horizontal") {
				emit("highlight-menu-item", "up", props.id);
			}
		};

		return {
			getName,
			menuBarItemRef,
			menuBarStyle,
			menuStyle,
			setMenuViewable,
			handlePointerEnter,
			handlePointerLeave,
			toggleMenu,
			handleMenuSelection,
			computeMenuStyle,
			bgColor,
			handleKeyUp,
			highlightIndex,
		};
	},
});
</script>

<style src="./MenuBarItem.css" scoped></style>
