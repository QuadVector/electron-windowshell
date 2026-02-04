<template>
	<v-app id="app__container">
		<WindowBar>
			<template #prepend>
				<img
					:src="windowIcon"
					class="component__WindowBar-icon"
					alt=""
					v-if="displayFluentIcon" />
				<div class="component__WindowBar-buttons">
					<v-btn
						prepend-icon="mdi-arrow-left"
						@click="this.$router.go(-1)"
						:disabled="!this.routerStore.canGoBack"
						variant="text"
						class="component__WindowBar-buttons-btn component__WindowBar-btn__back"
						v-if="useNavigator"></v-btn>
					<v-btn
						prepend-icon="$menu"
						variant="text"
						class="component__WindowBar-buttons-btn component__WindowBar-btn__menu"
						@click="
							this.routerStore.navigatorOpened =
								!this.routerStore.navigatorOpened
						"
						v-if="useNavigator"></v-btn>
				</div>
				<MainMenu />
			</template>
		</WindowBar>
		<AboutModal :isActive="displayAboutModal" />
		<v-main class="app__content">
			<v-navigation-drawer
				v-model="navigatorOpened"
				floating
				:mobile-breakpoint="800"
				v-if="useNavigator">
				<v-list
					v-model:selected="navigatorSelectedItem"
					@update:selected="setnavigatorSelectedItem">
					<v-list-item
						v-for="(item, i) in navigatorMenuItems"
						:key="i"
						:value="item.routePath"
						:title="item.title"
						:prepend-icon="item.icon"
						:active="
							this.$router.currentRoute.value.path.toLowerCase() ===
							item.routePath.toLowerCase()
						">
					</v-list-item>
				</v-list>
			</v-navigation-drawer>
			<div class="app__page">
				<router-view v-slot="{ Component, route }">
					<transition name="scale-slide">
						<keep-alive>
							<component :is="Component" :key="route.path" />
						</keep-alive>
					</transition>
				</router-view>
			</div>
		</v-main>
	</v-app>
</template>

<script>
import MainMenu from "../../core/components/MainMenu.vue";
import WindowBar from "../../core/components/WindowBar.vue";
import AboutModal from "../../core/components/AboutModal.vue";
import { useRouterStore } from "../../inc/store/routerStore";
import { useMainStore } from "../../inc/store/mainStore";
import { windowExtraProperties } from "../../electron/windowExtraProperties";

export default {
	components: {
		WindowBar,
		AboutModal,
		MainMenu,
	},
	data() {
		return {
			windowIcon: document.querySelector("link[rel*='icon']").href,
			routerStore: useRouterStore(),
		};
	},
	computed: {
		displayFluentIcon() {
			return windowExtraProperties.displayFluentIcon;
		},
		useNavigator() {
			return windowExtraProperties.useNavigator;
		},
		displayAboutModal() {
			const mainStore = useMainStore();
			return mainStore.activeAboutModal;
		},

		navigatorMenuItems() {
			const routerStore = useRouterStore();
			if (routerStore.navigatorMenuItems) {
				return routerStore.navigatorMenuItems;
			}
			return [];
		},
		navigatorSelectedItem() {
			const routerStore = useRouterStore();
			if (routerStore.navigatorSelectedItem) {
				return routerStore.navigatorSelectedItem;
			}
			return [];
		},
		navigatorOpened() {
			const routerStore = useRouterStore();
			if (routerStore.navigatorOpened) {
				return routerStore.navigatorOpened;
			}
			return false;
		},
	},
	methods: {
		setnavigatorSelectedItem(routeName) {
			if (routeName[0]) {
				this.$router.push(routeName[0]);
			}
		},
		appResize() {
			const routerStore = useRouterStore();
			if (window.innerWidth > 799) {
				routerStore.navigatorOpened = true;
			} else {
				routerStore.navigatorOpened = false;
			}
		},
	},
	mounted() {
		window.addEventListener("resize", this.appResize);
	},
	unmounted() {
		window.removeEventListener("resize", this.appResize);
	},
};
</script>
