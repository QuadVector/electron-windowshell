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

<script setup>
import { ref, onMounted } from "vue";

const windowTitle = ref(document.title); // Current window title (based on document title in the DOM)

// create a title observer for the DOM
let titleObserver = null; // Observes title changes in the DOM
onMounted(function () {
	const titleElement = document.querySelector("title");

	if (titleElement) {
		titleObserver = new MutationObserver(() => {
			windowTitle.value = document.title;
		});

		titleObserver.observe(titleElement, {
			childList: true,
		});
	}
});
</script>
