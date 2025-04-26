import { defineStore } from 'pinia';

export const useRouterStore = defineStore("routerStore", {
	state: () => ({
		routes: [
			{ path: '', component: "Main" }
		]
	})
});