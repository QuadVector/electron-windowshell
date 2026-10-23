<template>
	<div
		class="page-content vertical-scroll inner-padding-horizontal inner-padding-bottom">
		<div class="page__title">
			<div class="page__title__text">Components</div>
			<div class="page__title__actions">
				<v-btn variant="tonal" @click="$router.go(-1)">Back</v-btn>
			</div>
		</div>

		<v-container>
			<v-row dense>
				<v-col cols="12">
					<v-card flat class="h-100 w-100">
						<v-card-title>Buttons</v-card-title>
						<v-card-text>
							<v-row dense>
								<v-col cols="auto">
									<v-btn flat>Default</v-btn>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="primary">Primary</v-btn>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="secondary"
										>Secondary</v-btn
									>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="success">Success</v-btn>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="warning">Warning</v-btn>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="error">Error</v-btn>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="info">Info</v-btn>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="6">
					<v-card flat class="h-100 w-100">
						<v-card-title>Checkboxes</v-card-title>
						<v-card-text>
							<v-checkbox
								label="Checkbox 1"
								color="primary"
								description="Checkbox description example"
								v-model="exampleCheckbox1"></v-checkbox>
							<v-checkbox
								label="Checkbox 2"
								color="primary"
								v-model="exampleCheckbox2"></v-checkbox>
							<v-checkbox
								label="Checkbox 3"
								color="primary"
								v-model="exampleCheckbox3"></v-checkbox>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="6">
					<v-card flat class="h-100 w-100">
						<v-card-title>Radio Buttons</v-card-title>
						<v-card-text>
							<v-radio-group v-model="exampleRadio">
								<v-radio
									color="primary"
									label="Option 1"
									value="1"></v-radio>
								<v-radio
									color="primary"
									label="Option 2"
									value="2"></v-radio>
								<v-radio
									color="primary"
									label="Option 3"
									value="3"></v-radio>
							</v-radio-group>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="6">
					<v-card flat class="h-100 w-100">
						<v-card-title>Switches</v-card-title>
						<v-card-text>
							<v-switch
								label="Switch 1"
								color="primary"
								v-model="exampleSwitch1"></v-switch>
							<v-switch
								label="Switch 2"
								color="primary"
								v-model="exampleSwitch2"></v-switch>
							<v-switch
								label="Switch 3"
								color="primary"
								v-model="exampleSwitch3"></v-switch>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="6">
					<v-card flat class="h-100 w-100">
						<v-card-title>Pie chart</v-card-title>
						<v-card-text class="content-center">
							<v-pie
								animation
								legend
								width="100%"
								:tooltip="{ transition: false }"
								:palette="piePalette"
								:items="pieItems" />
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="12">
					<v-card flat class="h-100 w-100">
						<v-card-title>Line chart</v-card-title>
						<v-card-text class="content-center">
							<v-sparkline
								:gradient="lineChartGradient"
								:model-value="lineChartValues"
								:tooltip="{
									class: 'sparkline-tooltip',
									transition: false,
								}"
								height="60"
								line-width="1"
								marker-size="4"
								marker-stroke="rgb(var(--v-theme-surface))"
								min="0"
								label-size="4"
								auto-draw
								inset
								interactive
								auto-line-width="1"
								smooth>
								<template v-slot:tooltip="{ index, value }">
									<v-list-item density="compact">
										<div class="text-body-medium">
											${{ value.toLocaleString() }}
										</div>
									</v-list-item>
								</template>
								<template v-slot:label="item">
									{{ item.value }}
								</template>
							</v-sparkline>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="12">
					<v-card flat class="h-100 w-100">
						<v-card-title>Alerts</v-card-title>
						<v-card-text>
							<v-row dense>
								<v-col cols="12" md="12">
									<v-alert>Default</v-alert>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="primary">Primary</v-alert>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="secondary"
										>Secondary</v-alert
									>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="success">Success</v-alert>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="warning">Warning</v-alert>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="error">Error</v-alert>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="info">Info</v-alert>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat class="h-100 w-100">
						<v-card-title>Login form</v-card-title>
						<v-card-text>
							<v-form>
								<v-row dense>
									<v-col cols="12" md="6">
										<v-text-field
											clearable
											variant="solo-filled"
											label="Login"></v-text-field>
									</v-col>

									<v-col cols="12" md="6">
										<v-text-field
											label="Password"
											type="password"
											variant="solo-filled"
											clearable></v-text-field>
									</v-col>
								</v-row>

								<v-row dense align="center">
									<v-col cols="auto">
										<v-btn flat color="primary"
											>Login</v-btn
										>
									</v-col>
									<v-col cols="auto">
										<v-btn flat color="secondary"
											>Register</v-btn
										>
									</v-col>
									<v-spacer></v-spacer>
									<v-col cols="auto">
										<a href="javascript:"
											>Forgot password?</a
										>
									</v-col>
								</v-row>
							</v-form>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat class="h-100 w-100">
						<v-card-title>Dialog example</v-card-title>
						<v-card-text>
							<v-row dense>
								<v-col cols="12">
									<v-dialog max-width="500">
										<template
											v-slot:activator="{
												props: activatorProps,
											}">
											<v-btn
												v-bind="activatorProps"
												color="primary"
												text="Open Dialog"
												variant="flat"></v-btn>
										</template>

										<template v-slot:default="{ isActive }">
											<v-card title="Dialog">
												<v-card-text>
													Lorem ipsum dolor sit amet,
													consectetur adipiscing elit,
													sed do eiusmod tempor
													incididunt ut labore et
													dolore magna aliqua.
												</v-card-text>

												<v-card-actions>
													<v-spacer></v-spacer>

													<v-btn
														text="Close Dialog"
														@click="
															isActive.value = false
														"></v-btn>
												</v-card-actions>
											</v-card>
										</template>
									</v-dialog>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat class="h-100 w-100">
						<v-card-title>Selects</v-card-title>
						<v-card-text>
							<v-row dense>
								<v-col cols="6">
									<v-select
										label="Select"
										:items="[
											'California',
											'Colorado',
											'Florida',
											'Georgia',
											'Texas',
											'Wyoming',
										]"
										variant="solo-filled"></v-select>
								</v-col>
								<v-col cols="6">
									<v-select
										clearable
										chips
										label="Select"
										:items="[
											'California',
											'Colorado',
											'Florida',
											'Georgia',
											'Texas',
											'Wyoming',
										]"
										multiple
										variant="solo-filled"></v-select>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat class="h-100 w-100">
						<v-card-title>Context menu</v-card-title>
						<v-card-text>
							<v-row dense>
								<v-col cols="12">
									<div v-contextmenu:contextmenu>
										Right click here
									</div>
									<v-contextmenu ref="contextmenu">
										<v-contextmenu-item>
											<v-icon icon="mdi-github"></v-icon>
											GitHub
										</v-contextmenu-item>
										<v-contextmenu-item>
											<v-icon icon="mdi-gitlab"></v-icon>
											GitLab
										</v-contextmenu-item>

										<v-contextmenu-divider />

										<v-contextmenu-submenu title="Item 1">
											<v-contextmenu-item
												@click="contextMenuTest()"
												>Show alert</v-contextmenu-item
											>

											<v-contextmenu-submenu
												title="Item 2">
												<v-contextmenu-item
													>Item 1</v-contextmenu-item
												>
												<v-contextmenu-item
													>Item 2</v-contextmenu-item
												>
											</v-contextmenu-submenu>

											<v-contextmenu-item
												>Item 3</v-contextmenu-item
											>
										</v-contextmenu-submenu>

										<v-contextmenu-item disabled
											>Item 2</v-contextmenu-item
										>

										<v-contextmenu-divider />

										<v-contextmenu-group>
											<v-contextmenu-item>
												<v-icon
													icon="mdi-content-copy"></v-icon>
											</v-contextmenu-item>
											<v-contextmenu-item>
												<v-icon
													icon="mdi-content-paste"></v-icon>
											</v-contextmenu-item>
											<v-contextmenu-item disabled>
												<v-icon
													icon="mdi-content-cut"></v-icon>
											</v-contextmenu-item>
											<v-contextmenu-item>
												<v-icon
													icon="mdi-delete-outline"></v-icon>
											</v-contextmenu-item>
										</v-contextmenu-group>
									</v-contextmenu>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat class="h-100 w-100">
						<v-card-title>Sliders</v-card-title>
						<v-card-text>
							<v-row>
								<v-col cols="12" md="4">
									<v-slider
										color="red"
										:max="100"
										thumb-label
										prepend-icon="mdi-volume-high"></v-slider>
								</v-col>
								<v-col cols="12" md="4">
									<v-slider
										color="green"
										:max="100"
										prepend-icon="mdi-alarm"></v-slider>
								</v-col>
								<v-col cols="12" md="4">
									<v-slider
										color="blue"
										:max="100"
										thumb-label
										prepend-icon="mdi-magnify-minus-outline"
										append-icon="mdi-magnify-plus-outline"></v-slider>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat class="h-100 w-100">
						<v-card-text>
							Other UI examples you can find in the
							<a
								target="_blank"
								href="https://vuetifyjs.com/en/components/all/"
								>documentation.</a
							>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { VPie } from "vuetify/labs/VPie";

const exampleCheckbox1 = ref(true);
const exampleCheckbox2 = ref(true);
const exampleCheckbox3 = ref(false);

const exampleSwitch1 = ref(true);
const exampleSwitch2 = ref(true);
const exampleSwitch3 = ref(false);

const lineChartValues = ref([
	37, 82, 15, 64, 91, 28, 53, 76, 9, 44, 68, 100, 22, 59, 85, 12, 47, 73, 31,
	96, 5, 61, 40, 88, 19, 70,
]);
const lineChartGradient = ref(["#BFE093", "#F45916"]);

const exampleRadio = ref(1);

const piePalette = ref(["#048BA8", "#99C24D", "#F18F01"]);
const pieItems = ref([
	{ key: 1, title: "Yes", value: 45 },
	{ key: 2, title: "No", value: 40 },
	{ key: 3, title: "Maybe", value: 15 },
]);

const contextMenuTest = function () {
	alert("Test");
};
</script>
