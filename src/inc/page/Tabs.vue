<template>
    <div class="page-content inner-padding-horizontal inner-padding-bottom">
        <v-sheet class="h-full no-background">
            <v-tabs v-model="tab">
                <v-tab value="one">Item One</v-tab>
                <v-tab value="two">Item Two</v-tab>
                <v-tab value="three">Item Three</v-tab>
            </v-tabs>

            <v-divider></v-divider>

            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="one">
                    <v-sheet class="py-3 no-background"> Content of the first tab </v-sheet>
                </v-tabs-window-item>
                <v-tabs-window-item value="two">
                    <v-sheet class="py-3 no-background"> Content of the second tab </v-sheet>
                </v-tabs-window-item>
                <v-tabs-window-item value="three">
                    <v-sheet class="py-3 no-background"> Content of the third tab </v-sheet>
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
