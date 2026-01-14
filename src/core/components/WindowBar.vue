<template>
	<div class="component__WindowBar">
		<v-app-bar class="component__WindowBar__bar" density="compact">
			<slot name="prepend"></slot>
			<v-app-bar-title class="component__WindowBar-title text-center">
				{{ windowTitle }}
			</v-app-bar-title>
		</v-app-bar>
	</div>
</template>

<script>
export default {
	data() {
		return {
			windowTitle: document.title,
			_titleObserver: null
		};
	},
	
	mounted() {
		//observer for document title
		const that = this;
		const titleElement = document.querySelector("title");

		if(titleElement) {
			this._titleObserver = new MutationObserver(() => {
				that.windowTitle = document.title;
			});

			this._titleObserver.observe(titleElement, {
				childList: true
			});
		}
	}
};
</script>
