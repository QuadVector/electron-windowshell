<template>
    <div class="page-content inner-padding-horizontal inner-padding-bottom">
        <v-sheet elevation="4" class="h-full">
            <v-tabs color="primary" v-model="tab">
                <v-tab value="one">Item One</v-tab>
                <v-tab value="two">Item Two</v-tab>
                <v-tab value="three">Item Three</v-tab>
            </v-tabs>

            <v-divider></v-divider>

            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="one">
                    <v-sheet class="pa-5"> Content of the first tab </v-sheet>
                </v-tabs-window-item>
                <v-tabs-window-item value="two">
                    <v-sheet class="pa-5"> Content of the second tab </v-sheet>
                </v-tabs-window-item>
                <v-tabs-window-item value="three">
                    <v-sheet class="pa-5"> Content of the third tab </v-sheet>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-sheet>
    </div>
</template>

<script>
export default {
    data: () => ({
        tab: "one",
    }),
};
</script>
<style scoped></style>
