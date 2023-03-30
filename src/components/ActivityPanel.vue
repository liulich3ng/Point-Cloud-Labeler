<template>
    <div class="activity-panel" v-show="activityPanelName!=null">
        <div v-show="activityPanelName===Panels.OBJECTS">
            Object List
        </div>
        <div v-show="activityPanelName===Panels.LABELS">
            List List
        </div>
    </div>
</template>

<script setup lang="ts">
import {activityPanelName} from "@/store/global";
import {NSpace} from "naive-ui";
import {Panels} from "@/types/global";

</script>

<style scoped>
.activity-panel {
    display: inline-flex;
    height: 100%;
    width: var(--side-panel-width);
    border-right: 1px solid var(--border-color);
}
</style>
